const ulElement = document.querySelector('ol');
const logElement = document.querySelector('.log')
const buttonElement = document.querySelector('button');
const imageElement = document.querySelector('.profile img');
const nameElement = document.querySelector('.profile p');

const utils = {
    createListElement(repoName, link) {
        const listElement = document.createElement('li');
        const linkElement = document.createElement('a');
        const textElement = document.createTextNode(repoName);

        linkElement.setAttribute('href', `${link}`);
        linkElement.setAttribute('target', '_blank');

        linkElement.appendChild(textElement);
        listElement.appendChild(linkElement);
        ulElement.appendChild(listElement);
    },
    clearElements() {
        ulElement.innerHTML = '';
        logElement.innerHTML = '';
    },
    renderLoading() {
        this.clearElements();
    
        const loadingDiv = document.createElement('div');
        loadingDiv.setAttribute('class','loading');
    
        const loadingText = document.createTextNode("Loading...");
        
        loadingDiv.appendChild(loadingText);
        logElement.appendChild(loadingDiv);
    },
    renderError(param) {
        this.clearElements();
        
        const textError = document.createTextNode(param);
        const divElement = document.createElement('div');
        divElement.setAttribute('class', 'logErros');
    
        divElement.appendChild(textError);
        logElement.appendChild(divElement);
    },
}
const dev = {
    userExists(user) {
        axios.get(`https://api.github.com/users/${user}`)    
        .then(function(response) {
            return true;
        })
        .catch(function(error) {
            console.log(error);
            if(error.response.data.message === 'Not Found'){
                utils.renderError('User not found');
            }else {
                utils.renderError('error in promise');
            }
            return false;
        });
    },
    listGenerate(user){
        axios.get(`https://api.github.com/users/${user}/repos`)
        .then(function(response) {
                utils.clearElements();

                const repos = response.data;

                if(Array.isArray(repos) && repos.length){
                    for(repo of repos){
                        const link = repo.html_url;
                        utils.createListElement(repo.name, link);
                    }
                }else{
                    utils.renderError('User without repositories :(');
                }
        });
    },
    updateDev(user){
        axios.get(`https://api.github.com/users/${user}`)
        .then(function(response) {
            let name = '';
            if(response.data.name == null){
                name = document.getElementById('input').value;
            }else{
               name = response.data.name;
            }
            imageElement.src = response.data.avatar_url;
            nameElement.innerHTML = name;
        });
    }
}


function showRepositories(){
    utils.clearElements();

    const user = document.getElementById('input').value;   

    if (!user) return; // Ignora quando não se digita nada

    utils.renderLoading();

    if(!dev.userExists(user)){
        dev.listGenerate(user);
        dev.updateDev(user);
    }
}


let input = document.querySelector('#input');

buttonElement.addEventListener("click", function(event){
    buttonElement.onclick = showRepositories();
});

input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    buttonElement.onclick = showRepositories();
  }
});
