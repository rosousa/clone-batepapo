function checkName(){
    const url = 'https://mock-api.driven.com.br/api/v6/uol/participants';
    const user_name = {
        name: askName()
    };
    const promisse = axios.post(url, user_name);
    promisse
        .catch(nameNotAvailable)
        .then(nameAvailable);
    function nameAvailable(response){
        chatRoom(user_name);
    }
    function nameNotAvailable(error){
        console.log(error.response.data);
        checkName();
    }
}

checkName();

function askName(){
    const user_name = prompt('Qual o seu nome?');
    return user_name;
}

function chatRoom(user_name){
    keepConnection(user_name);
    loadMessages();
}

function keepConnection(user_name){
    const connection = setInterval(() => {
        const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user_name);
        promisse
            .catch(error => {
                console.log(error);
                clearInterval(connection);
            })
            .then(response => {
                console.log(response.data)
            })
    }, 5000);
}

function loadMessages(){
    const url = 'https://mock-api.driven.com.br/api/v6/uol/messages';
    const promisse = axios.get(url);
    promisse
        .catch(error => {
            console.log(error.response);
        })
        .then(renderMessages);
}

function renderMessages(response){
    const ul = document.querySelector('.messages');
    for(let i = 0; i < response.data.length - 50; i++){
        ul.innerHTML += `<li class="message in-and-out">
                            <span>(${response.data[i].time})</span> <strong>${response.data[i].from}</strong> ${response.data[i].text}
                        </li>`;
    }
    console.log(response.data);
}