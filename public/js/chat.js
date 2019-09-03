const socket = io();

ready(() => {

  // DOM elements
  const $chatroom = document.querySelector('#chatroom');
  const $messageForm = document.querySelector('#sendMessageForm');
  const $messageTextArea = document.querySelector('#messageTextArea');
  const $sendLocationBtn = document.querySelector('#sendLocationBtn');
  const $submitBtn = $messageForm.querySelector('#sendBtn');

  // Templates
  const $chatMessageTemplate = document.querySelector('#template-textMessage');
  const $chatLocationTemplate = document.querySelector('#template-locationMessage');

  // Options
  moment.locale('en-il');
  const { userName, roomName } = Qs.parse(location.search, { ignoreQueryPrefix: true });


  // Chat Functions
  const addChatPost = (message, template) => {
    let messageHtml = ejs.render(template.innerHTML, { message });
    $chatroom.insertAdjacentHTML('beforeend', messageHtml);
    scrollChatDown();
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
  socket.on('userMessage', (message) => {
    addChatPost(message, $chatMessageTemplate);
  });

  socket.on('userLocation', (message) => {
    addChatPost(message, $chatLocationTemplate);
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


