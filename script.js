const search = document.getElementById("mySearch");
const render = document.getElementById("render");
const searchInput = document.getElementById("searchInput");
const searchValue = document.getElementById("searchValue");
const repoList = document.getElementById("repoList");

const debouncedInputHandler = debounse();

search.addEventListener('input', function(event) {
    const currentValue = event.target.value; 
    debouncedInputHandler(currentValue);
});

function debounse() {
    let timeSave;
    return function(val) {
        clearTimeout(timeSave);
        timeSave = setTimeout(() => {
            serverGet(val);
        }, 400);
    }
}
async function serverGet(inputVal) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(inputVal)}`;
    const response = await fetch(url);
    const data = await response.json()
 
    clear();
    renderSearchValue(data)
    
} 

function clear() {
    while (searchValue.firstChild) {
        searchValue.removeChild(searchValue.firstChild);
    }
}

function renderSearchValue(data) {
    for (let i = 0; i < 5 && i < data.items.length; i++) {
        const button = document.createElement('button');
        button.style = 'width:100%;height:30px;';
        searchValue.appendChild(button);
        button.textContent = data.items[i].name;
        button.value = data.items[i].name;
        button.addEventListener('click', function(event) {
            const currentValue = event.target.value; 
            searchInput.value = currentValue;
            addRepo (data.items[i]);
            debouncedInputHandler(currentValue);
            
        });
    }
}
function addRepo(repoObj) {
    let div = document.createElement('div');
    div.style.marginLeft = '50px';
    div.innerHTML = `
        <br>
        <br>
        <button id='deleteButton'>Удалить</button>
        <h1>Имя репозитория: ${repoObj.name}</h1>
        <h2>Имя создателя: ${repoObj.owner.login}</h2>
        <span>Звезды: ${repoObj.stargazers_count}</span>
    `;

    const deleteButton = div.querySelector("#deleteButton");
    deleteButton.addEventListener('click', function() {
        div.remove();
    });

    repoList.append(div);
} 