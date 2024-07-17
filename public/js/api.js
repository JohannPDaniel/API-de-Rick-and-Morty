const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
});

async function callCards(page = 1) {
    try {
        const response = await api.get(`/character?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching characters:', error);
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

async function getLocationCount() {
    try {
        const response = await api.get('/location');
        return response.data.info.count;
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
}

async function getCharacterCount() {
    try {
        const response = await api.get('/character');
        return response.data.info.count;
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
}

async function getEpisodeCount() {
    try {
        const response = await api.get('/episode');
        return response.data.info.count;
    } catch (error) {
        console.error('Error fetching episodes:', error);
    }
}
