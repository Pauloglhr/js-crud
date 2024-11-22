const openForm = () => {
    document.querySelector('.modal')
        .hidden = false;
    setData()
}

//Função responsável por aplicar um data-set, diferenciando o formulário para salvar ou editar cliente.
const setData = () => {
    document.querySelector('#cadastrar')
        .addEventListener('click', (e)=>{
            e.preventDefault;
            document.querySelector('#nome').dataset.save = 'save'
        })
}

const closeForm = () => {
    document.querySelector('.modal')
        .hidden = true;
    resetForm();
}

const getLocalStorage = () => 
    JSON.parse(localStorage.getItem('db_client')) || [];
const setLocalStorage = (client) => 
    localStorage.setItem('db_client', JSON.stringify(client));

//CRUD

const deleteClient = (id) => {
    const storage = readStorage();
    storage.splice(id, 1);
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

const validDate = (client) => {
    const dataAtual = new Date();
    const dataArr = client.data.split('-');
    const anoClient = parseInt(dataArr[0]);
    const mesClient = parseInt(dataArr[1]) - 1; // Meses em JavaScript começam em 0
    const diaClient = parseInt(dataArr[2]);
  
    const dataCliente = new Date(anoClient, mesClient, diaClient);
  
    if (dataCliente >= dataAtual) {
        //Utilização da biblioteca sweet alert
        Swal.fire({
            title: 'Erro!',
            text: 'A data de nascimento não pode ser maior que a data atual.',
            icon: 'error',
            confirmButtonText: 'Confirmar'
          })
    } else {
      return true;
    }
  };

const saveClient = () => {
    if(validityForm()) {
        const client = {
            id: 0,
            nome: document.querySelector('#nome').value,
            data: document.querySelector('#data').value,
            email: document.querySelector('#email').value
        }

        const dataSet = document.querySelector('#nome').dataset.save;

        if(dataSet === 'save'){
            if(validDate(client)){
                client.id = readStorage().length;
                formatDate(client)
                createClient(client)
                updateTable(readStorage())
                closeForm()
            }
        } else {
            if(validDate(client)){
                client.id = parseInt(dataSet);
                formatDate(client)
                updateClient(client, dataSet)
                updateTable(readStorage())
                closeForm()
            }
        }
    
    }

}

const updateTable = (storage) => {
    const table = document.querySelector('.tabela tbody');

    table.innerHTML = '';

    storage.forEach((client) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.data}</td>
        <td>${client.email}</td>
        <td class="form-acoes">
            <button type="button" id="editar-${client.id}" class="btn-editar"></button>
            <button type="button" id="excluir-${client.id}" class="btn-excluir"></button>
        </td>
        `;
        table.appendChild(tr);
    });
}

updateTable(readStorage())

const resetForm = () => {
    const form = document.querySelector('#formulario')
    return form.reset()
}

const reverseDate = (client) => {
    const dataArr = client.data.split('/')
    return client.data = `${dataArr[2]}-${dataArr[1]}-${dataArr[0]}`
}

const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome
    reverseDate(client) //Formata a data para o padrão do localStorage.
    document.querySelector('#data').value = client.data
    document.querySelector('#email').value = client.email
    document.querySelector('#nome').dataset.save = client.id
}

const editClient = (index) => {
    const client = readStorage()[index]
    fillFields(client)
    openForm()
}

const editarOuExcluir = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        
        if(action == 'editar'){
            editClient(index)
        } else {
            //O problema esta aqui, criar uma função para redefinir o id de todos os elementos quando algum client for excluido.
            const client = readStorage()
            const del = confirm(`Você deseja excluir o usuário ${client[index].nome}?`)
            if(del){
                deleteClient(index)
                updateTable(readStorage())
            }
        }
    }
}

const filtrarClient = () => {
    const storage = readStorage()
    const str = document.querySelector('#filtro').value;
    const strLowerCase = str.toLowerCase()

    const clientsFiltrados = storage.filter((client) => 
        client.nome.toLowerCase().includes(strLowerCase));

    updateTable(clientsFiltrados);
};

//Eventos

document.querySelector('#salvar')
    .addEventListener('click', saveClient)

document.querySelector('#cancelar')
    .addEventListener('click', closeForm)

document.querySelector('.tabela > tbody')
    .addEventListener('click', editarOuExcluir)