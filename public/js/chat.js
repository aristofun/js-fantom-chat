/** https://stackoverflow.com/a/7053197/1245302 */
function ready(callback) {
  // in case the document is already rendered
  if (document.readyState != 'loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function () {
      if (document.readyState == 'complete') callback();
    });
}

const socket = io();
const chatroom = document.querySelector('#chatroom');

const chatMessageTemplate = "<div class=\"box is-marginless\">\n" +
  "    <p id=\"messageText\"><%= text %></p>\n" +
  "</div>\n" +
  "<nav class=\"level is-mobile\">\n" +
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
};


ready(() => {
  const messageForm = document.querySelector('#sendMessageForm');
  const messageTextArea = document.querySelector('#messageTextArea');

  messageForm.addEventListener('submit', (e) => {
    // console.log('on submit...', e);
    e.preventDefault();
    const text = e.target.elements.messageTextArea.value;
    console.log('#messageInput', text);

    if (text) socket.emit('sendMessage', text);

    e.target.elements.messageTextArea.value = '';
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
});
