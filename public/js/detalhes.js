document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get('id');

    if (characterId) {
        await loadCharacterDetails(characterId);
    }
});

async function loadCharacterDetails(id) {
    try {
        const response = await api.get(`/character/${id}`);
        const character = response.data;

        document.querySelector('.retangulo img').src = character.image;
        document.querySelector('.retangulo img').alt = character.name;
        document.querySelector('#floatingInput').value = character.name;

        const statusInput = document.querySelector('#statusInput');
        statusInput.value = character.status;
        statusInput.classList.remove('status-alive', 'status-dead', 'status-unknown');
        statusInput.classList.add(getStatusClass(character.status.toLowerCase()));

        document.querySelector('#locationInput').value = character.location.name;
        document.querySelector('#episodeInput').value = await getEpisodeName(character.episode[0]);
    } catch (error) {
        console.error('Error fetching character details:', error);
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'alive':
            return 'status-alive';
        case 'dead':
            return 'status-dead';
        default:
            return 'status-unknown';
    }
}




async function getEpisodeName(url) {
    try {
        const response = await axios.get(url);
        return response.data.name;
    } catch (error) {
        console.error('Error fetching episode:', error);
        return 'Unknown episode';
    }
}
