const openForm = () => {
    document.querySelector('.formulario-container')
        .hidden = false;
}

const closeForm = () => {
    document.querySelector('.formulario-container')
        .hidden = true;
    resetForm();
}

const getLocalStorage = () => 
    JSON.parse(localStorage.getItem('db_client')) || [];
const setLocalStorage = (client) => 
    localStorage.setItem('db_client', JSON.stringify(client));

//CRUD

const deleteClient = (index) => {
    const storage = readStorage();
    storage.splice(index, 1);
    setLocalStorage(storage);
}

const updateClient = (client, index) => {
    const storage = readStorage();
    storage[index] = client;
    setLocalStorage(storage);
}

const readStorage = () => getLocalStorage();

const createClient = (client) => {
    const storage = getLocalStorage();
    storage.push(client);
    setLocalStorage(storage);
}

const validityForm = () => {
    return document.querySelector('#formulario').reportValidity()
}

const formatDate = (client) => {
    var dataArr = client.data.split('-')
    var dataFormatada = `${dataArr[2]}/${dataArr[1]}/${dataArr[0]}`
    
    return client.data = dataFormatada
}

const saveClient = () => {
    const client = {
        nome: document.querySelector('#nome').value,
        data: document.querySelector('#data').value,
        email: document.querySelector('#email').value
    }

    formatDate(client)
    
    if(validityForm()) {
        createClient(client)
        updateTable()
        closeForm()
    }

}

const updateTable = () => {
    const table = document.querySelector('.tabela tbody');
    const storage = readStorage();

    table.innerHTML = '';

    storage.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.data}</td>
        <td>${client.email}</td>
        <td class="form-acoes">
            <button><i class="fa-solid fa-pen"></i></button>
            <button><i class="fa-solid fa-trash"></i></button>
        </td>
        `;
        table.appendChild(tr);
    });
}

updateTable()

const resetForm = () => {
    const form = document.querySelector('#formulario')
    return form.reset()
}

//Eventos

document.querySelector('#salvar')
    .addEventListener('click', saveClient)
document.querySelector('#cancelar')
    .addEventListener('click', closeForm)