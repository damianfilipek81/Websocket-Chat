const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content))
socket.on('userConnect', (name) => addMessage('Chat Bot', `${name} has joined the conversation!`))
socket.on('userDisconnect', (name) => addMessage('Chat Bot', `${name} has left the conversation... :(`))

const selectors = {
  loginForm: 'welcome-form',
  messagesSection: 'messages-section',
  messagesList: 'messages-list',
  addMessageForm: 'add-messages-form',
  userNameInput: 'username',
  messageContentInput: 'message-content',
};

let userName;

const loginForm = document.getElementById(selectors.loginForm);
const messagesSection = document.getElementById(selectors.messagesSection);
const messagesList = document.getElementById(selectors.messagesList);
const addMessageForm = document.getElementById(selectors.addMessageForm);
const userNameInput = document.getElementById(selectors.userNameInput);
const messageContentInput = document.getElementById(selectors.messageContentInput);

const login = (e) => {
  e.preventDefault();
  if (userNameInput.value.length > 0) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', { author: userName })
  } else {
    alert('You must type your name');
  }
}

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class=${author == 'Chat Bot' ? "message_content-bot" : "message_content"}>
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

const sendMessage = (e) => {
  e.preventDefault();
  let messageContent = messageContentInput.value;

  if (!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
}

loginForm.addEventListener('submit', (e) => {
  login(e);
})

addMessageForm.addEventListener('submit', (e) => {
  sendMessage(e);
})
