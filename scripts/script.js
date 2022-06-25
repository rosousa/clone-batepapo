let name_user;
let toUser;
function checkName() {
  const url = 'https://mock-api.driven.com.br/api/v6/uol/participants';
  const user_name = {
    name: askName(),
  };
  name_user = user_name.name;
  const promisse = axios.post(url, user_name);
  promisse.catch(nameNotAvailable).then(nameAvailable);
  function nameAvailable(response) {
    chatRoom(user_name);
  }
  function nameNotAvailable(error) {
    console.log(error.response.data);
    checkName();
  }
}

checkName();

function askName() {
  const user_name = prompt('Qual o seu nome?');
  return user_name;
}

function chatRoom(user_name) {
  keepConnection(user_name);
  setInterval(loadMessages, 3000);
}

function keepConnection(user_name) {
  setInterval(() => {
    const promisse = axios.post(
      'https://mock-api.driven.com.br/api/v6/uol/status',
      user_name
    );
    promisse
      .catch((error) => {
        console.log(error);
        checkName();
      })
      .then((response) => {
        console.log(response.data);
      });
  }, 5000);
}

function loadMessages() {
  const url = 'https://mock-api.driven.com.br/api/v6/uol/messages';
  const promisse = axios.get(url);
  promisse
    .catch((error) => {
      console.log(error.response);
    })
    .then(renderMessages);
}

function renderMessages(response) {
  const ul = document.querySelector('.messages');
  ul.innerHTML = '';
  let userMessages = response.data.filter(filterMessages);
}

function filterMessages(value) {
  const ul = document.querySelector('.messages');
  if (value.type === 'message') {
    ul.innerHTML += `<li class="message">
                            <span>(${value.time})</span> <strong>${value.from}</strong> para <strong>Todos</strong>: ${value.text}
                        </li>`;
  } else if (value.type === 'status') {
    ul.innerHTML += `<li class="message in-and-out">
                            <span>(${value.time})</span> <strong>${value.from}</strong> ${value.text}
                        </li>`;
  } else if (
    value.type === 'private_message' &&
    (value.from === name_user || value.to === name_user)
  ) {
    ul.innerHTML += `<li class="message whisper">
                            <span>(${value.time})</span> <strong>${value.from}</strong> reservadamente para <strong>${value.to}</strong>: ${value.text}
                        </li>`;
  }
  ul.scrollIntoView(false);
}

function sendMessage() {
  const text = document.querySelector('.chat-box textarea');
  const messageObj = {
    from: name_user,
    to: 'Todos',
    text: text.value,
    type: 'message', // ou "private_message" para o bônus
  };

  if (text.value[0] === '/') {
    messageObj.type = 'private_message';
    messageObj.to = text.value.replace('/', '').split(' ')[0];
    messageObj.text = text.value.replace(text.value.split(' ')[0] + ' ', '');
  }

  const promisse = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/messages',
    messageObj
  );
  promisse
    .catch((error) => {
      console.log(error);
    })
    .then((_) => {
      loadMessages();
      console.log('Mensagem enviada com sucesso!');
      console.log(messageObj);
      text.value = '';
    });
}

function userOnline() {
  const ul = document.querySelector('.contacts');
  const promisse = axios.get(
    'https://mock-api.driven.com.br/api/v6/uol/participants'
  );
  promisse
    .catch((error) => {
      console.log(error);
    })
    .then((res) => {
      ul.innerHTML = '';
      res.data.filter((i) => {
        ul.innerHTML += `<li class="contact" onclick="selectType(this)">
        <ion-icon name="person-circle"></ion-icon>
        <p class="user">${i.name}</p>
        <ion-icon class="check hidden" name="checkmark-sharp"></ion-icon>
      </li>`;
      });
    });
}

function showSidebar(element) {
  const sidebar = document.querySelector('.sidebar');
  const sidebardark = document.querySelector('.sidebarDark');
  const icon = document.querySelector('.showSidebar');
  if (element === icon) {
    sidebar.classList.add('visible');
    sidebardark.classList.add('visible');
  } else if (element === sidebardark) {
    sidebar.classList.remove('visible');
    sidebardark.classList.remove('visible');
  }
}

function selectType(element) {
  const el = element.querySelector('.check');
  const text = document.querySelector('.chat-box textarea');
  el.classList.toggle('hidden');
  toUser = element.querySelector('p').textContent;
  console.log(toUser, element);
  text.value = '';
  text.value = `/${toUser} `;
}

userOnline();
setInterval(userOnline, 5000);
