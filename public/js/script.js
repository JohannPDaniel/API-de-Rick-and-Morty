const list = document.getElementById("page-rickMorty")

const api = 'https://rickandmortyapi.com/documentation/?authuser=0#rest'

let personagens = []

const pegarPersonagens = async (api, nome = "") => {
    try {
        let response ;
        if (nome !== "") {
            response === await axios.get(`${api}?name=${nome}`)
        } else {
            response === await axios.get(api)
        }
    } catch (error) {
        
    }
}

const procurarPersonagens = (evento) => {
    evento.preventDefault();

    const nome = document.querySelector('form').value

    pegarPersonagens(api, nome)
}