const socket = io();

ready(() => {
  const $chatroom = document.querySelector('#chatroom');
  // Templates
  const $chatMessageTemplate = document.querySelector('#template-textMessage');
  const $chatLocationTemplate = document.querySelector('#template-locationMessage');

  const addChatMessage = (text) => {
    let messageHtml = ejs.render($chatMessageTemplate.innerHTML, {
      text: text,
      time: moment().format('LLLL')
    }, {});

    $chatroom.insertAdjacentHTML('beforeend', messageHtml);

    scrollChatDown();
  };

  const addChatLocation = (location) => {
    let messageHtml = ejs.render($chatLocationTemplate.innerHTML, {
      url: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      frame: `<iframe
  width="100%"
  height="100%"
  allofullscreen
  frameborder="0" style="border:0;"
  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCRFlYZk-zQjyw1NERRbtfDmxmXj5448nk&q=${location.latitude},${location.longitude}" allowfullscreen>
</iframe>`,
      time: moment().format('LLLL')
    }, {});

    $chatroom.insertAdjacentHTML('beforeend', messageHtml);

    scrollChatDown();
  };

  moment.locale('en-il');

  const $messageForm = document.querySelector('#sendMessageForm');
  const $messageTextArea = document.querySelector('#messageTextArea');
  const $sendLocationBtn = document.querySelector('#sendLocationBtn');
  const $submitBtn = $messageForm.querySelector('#sendBtn');

  $messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('on form submit', e);

    $submitBtn.setAttribute('disabled', 'disabled');

    const text = e.target.elements.messageTextArea.value;

    if (text) socket.emit('userMessage', text, (arg) => {
      $submitBtn.removeAttribute('disabled');
      console.log('message delivered, errors:', arg);
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
          // $submitBtn.removeAttribute('disabled');
          console.log('Location sent, error: ', error);
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

  socket.on('userMessage', (message) => {
    addChatMessage(message);
  });

  socket.on('userLocation', (location) => {
    addChatLocation(location);
  });
});


