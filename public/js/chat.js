const socket = io();
const chatroom = document.querySelector('#chatroom');

const chatMessageTemplate = "<div class=\"box is-marginless\">\n" +
  "    <p id=\"messageText\"><%= text %></p>\n" +
  "</div>\n" +
  "<nav class=\"level is-mobile is-size-7\">\n" +
  "    <div class=\"level-left\"></div>\n" +
  "\n" +
  "    <div class=\"level-right\">\n" +
  "        <div class=\"level-item\">\n" +
  "            <span class=\"icon is-small\"><i class=\"fas fa-clock\" aria-hidden=\"true\"></i>                           </span>\n" +
  "            <i id=\"timeSpan\"><%= time %></i>\n" +
  "        </div>\n" +
  "    </div>\n" +
  "</nav>\n" +
  "\n";

moment.locale('en-il');

const addChatMessage = (text) => {
  let chatHtml = ejs.render(chatMessageTemplate, { text: text, time: moment().format('LLLL') }, {});
  // console.log(chatHtml);
  chatroom.insertAdjacentHTML('beforeend', chatHtml);

  //https://www.w3schools.com/jsref/prop_element_scrolltop.asp
  const body = document.body; // Safari
  const html = document.documentElement; // Chrome, Firefox, IE and Opera places the overflow at the <html> level, unless else is specified. Therefore, we use the documentElement property for these browsers
  body.scrollTop = body.scrollHeight;
  html.scrollTop = html.scrollHeight;
};


ready(() => {
  const messageForm = document.querySelector('#sendMessageForm');
  const messageTextArea = document.querySelector('#messageTextArea');
  const sendLocationBtn = document.querySelector('#sendLocationBtn');

  messageForm.addEventListener('submit', (e) => {
    // console.log('on submit...', e);
    e.preventDefault();
    const text = e.target.elements.messageTextArea.value;

    if (text) socket.emit('userMessage', text);

    e.target.elements.messageTextArea.value = '';
  });


  sendLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return openModal('geoNotSupportedModal');

    //https://stackoverflow.com/a/6092416/1245302
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);

        socket.emit('userLocation', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.log(error);
        openModal('geoNotSupportedModal');
      });
  });

  messageTextArea.addEventListener('keypress', (e) => {
    // console.log(e);
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13)) {
      messageForm.querySelector('button').click();
    }
  });

  socket.on('message', (message) => {
    console.log('Server message', message);
  });

  socket.on('userMessage', (message) => {
    addChatMessage(message);
  });

  socket.on('userLocation', (location) => {
    addChatMessage(JSON.stringify(location));
  });
});


