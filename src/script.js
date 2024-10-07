const openForm = () => {
    document.querySelector('.formulario-container')
        .hidden = false;
}

const closeForm = () => {
    document.querySelector('.formulario-container')
        .hidden = true;
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

//Eventos
