var ulElement = document.querySelector('ol');
var spaceElement = document.querySelector('.log')
var buttonElement = document.querySelector('button');


function createList(params) {

    var listElement = document.createElement('li');
    var textElement = document.createTextNode(params);

    listElement.appendChild(textElement);
    ulElement.appendChild(listElement);
}

function renderLoading() {
    ulElement.innerHTML = '';
    spaceElement.innerHTML = '';

    var loadingDiv = document.createElement('div');
    loadingDiv.setAttribute('class','loading');

    var loadingText = document.createTextNode("Carregando...");
    
    loadingDiv.appendChild(loadingText);
    spaceElement.appendChild(loadingDiv);
}

function renderError(param) {
    ulElement.innerHTML = "";
    spaceElement.innerHTML = '';
    
    var textError = document.createTextNode(param);
    var divElement = document.createElement('div');
    divElement.setAttribute('class', 'logErros');

    divElement.appendChild(textError);
    spaceElement.appendChild(divElement);
}

function showRepositories(){
    ulElement.innerHTML = '';
    spaceElement.innerHTML = '';

    var user = document.getElementById('input').value;   
    
    if (!user) return;

    renderLoading();
    
    axios.get(`https://api.github.com/users/${user}/repos`)    
    .then(function(response) {
        ulElement.innerHTML = '';
        spaceElement.innerHTML = '';
        
        var repos = response.data;
        for(repo of repos){
            createList(repo.name);
        }
    })
    .catch(function(error) {
        console.log(error)
        if(error.response.data.message === 'Not Found'){
            var strErro = 'Usuário não encontrado';
            renderError(strErro);
        }else {
            renderError(error);
        }
    });   
}

buttonElement.onclick = showRepositories;
