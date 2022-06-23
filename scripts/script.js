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

function chatRoom(user_name){
    keepConnection(user_name);
}

function askName(){
    const user_name = prompt('Qual o seu nome?');
    return user_name;
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