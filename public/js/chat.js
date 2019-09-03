const socket = io();

ready(() => {

  // DOM elements
  const $chatroom = document.querySelector('#chatroom');
  const $messageForm = document.querySelector('#sendMessageForm');
  const $messageTextArea = document.querySelector('#messageTextArea');
  const $sendLocationBtn = document.querySelector('#sendLocationBtn');
  const $submitBtn = $messageForm.querySelector('#sendBtn');
  const $sidebar = document.querySelector('#sidebar');

  // Templates
  const $chatMessageTemplate = document.querySelector('#template-textMessage');
  const $chatLocationTemplate = document.querySelector('#template-locationMessage');
  const $userAddedTemplate = document.querySelector('#template-userAddedRemoved');
  const $sidebarTemplate = document.querySelector('#template-sidebar');

  // Options
  moment.locale('en-il');
  const { userName, roomName } = Qs.parse(location.search, { ignoreQueryPrefix: true });


  // Chat Functions
  const addChatPost = (message, template) => {
    let messageHtml = ejs.render(template.innerHTML, { message });
    $chatroom.insertAdjacentHTML('beforeend', messageHtml);
    scrollChatDown();
  };

  const scrollChatDown = () => {
    const newMessageNode = $chatroom.lastElementChild;
    const newMessageHeight = newMessageNode.offsetHeight
      + parseInt(getComputedStyle(newMessageNode).marginBottom);

    const visibleHeight = $chatroom.offsetHeight;
    const chatFullHeight = $chatroom.scrollHeight;
    const scrollOffset = $chatroom.scrollTop + visibleHeight;

    //
    if (chatFullHeight - newMessageHeight - 20 <= scrollOffset) {
      // scroll
      $chatroom.scrollTop = $chatroom.scrollHeight;
    }

    //https://www.w3schools.com/jsref/prop_element_scrolltop.asp
    // const body = document.body; // Safari
    // const html = document.documentElement; // Chrome, Firefox, IE and Opera places the overflow at the <html> level, unless else is specified. Therefore, we use the documentElement property for these browsers
    // body.scrollTop = body.scrollHeight;
    // html.scrollTop = html.scrollHeight;
  };


  // DOM Callbacks
  $messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('on form submit', e);

    $submitBtn.setAttribute('disabled', 'disabled');

    const text = e.target.elements.messageTextArea.value;

    if (text) socket.emit('userMessage', text, (error) => {
      $submitBtn.removeAttribute('disabled');
      console.log('message delivered, errors:', error);
      if (error) openModal('messageErrorModal', error);
    });

    $messageTextArea.value = '';
    $messageTextArea.focus();
  });


  $sendLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return openModal('geoNotSupportedModal');

    //https://stackoverflow.com/a/6092416/1245302
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);

        socket.emit('userLocation', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, (error) => {
          console.log('Location sent, error: ', error);
          if (error) openModal('messageErrorModal', error);
        });
      },
      (error) => {
        console.log(error);
        openModal('geoNotSupportedModal');
      });
  });

  $messageTextArea.addEventListener('keypress', (e) => {
    // console.log(e);
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13)) {
      $submitBtn.click();
    }
  });


  // Socket.io callbacks
  socket.on('userMessage', (message) => addChatPost(message, $chatMessageTemplate));
  socket.on('userLocation', (message) => addChatPost(message, $chatLocationTemplate));
  socket.on('userAddedRemoved', (message) => addChatPost(message, $userAddedTemplate));

  socket.on('userListUpdate', ({ roomName, userIds }) => {
    console.log(userIds, roomName);
    console.log($sidebarTemplate, $sidebar);

    let sidebarHtml = ejs.render($sidebarTemplate.innerHTML, { roomName, userIds });
    $sidebar.innerHTML = sidebarHtml;
  });

  // console.log(userName, roomName);
  socket.emit('join', { userName, roomName }, (error) => {
    console.log('Cant join server due to', error);
    // show modal error and kick back
    if (error) {
      openModal('roomJoinErrorModal', error);
      setTimeout(() => {
        location.href = '/'
      }, 2500);
    }
  });

});


