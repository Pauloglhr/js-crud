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
    
    if(validityForm()) {
        const client = {
            nome: document.querySelector('#nome').value,
            data: document.querySelector('#data').value,
            email: document.querySelector('#email').value
        }
    
        formatDate(client)
        createClient(client)
        updateTable()
        closeForm()
    }

}

const updateTable = () => {
    const table = document.querySelector('.tabela tbody');
    const storage = readStorage();

    table.innerHTML = '';

    storage.forEach((client, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.data}</td>
        <td>${client.email}</td>
        <td class="form-acoes">
            <button type="button" id="editar-${index}" class="btn-editar"></button>
            <button type="button" id="excluir-${index}" class="btn-excluir"></button>
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

//criar lógica de edição do cliente, de forma que os dados sejam puxados para o modal quando aberto.

const editarOuExcluir = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        
        if(action == 'editar'){
            editClient(index)
        } else {
            const client = readStorage()[index]
            const del = confirm(`Você deseja excluir o usuário ${client.nome}?`)
            if(del){
                deleteClient(index)
                updateTable()
            }
        }
    }
}

//Eventos

document.querySelector('#salvar')
    .addEventListener('click', saveClient)

document.querySelector('#cancelar')
    .addEventListener('click', closeForm)

document.querySelector('.tabela > tbody')
    .addEventListener('click', editarOuExcluir)