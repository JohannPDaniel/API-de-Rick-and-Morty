document.addEventListener('DOMContentLoaded', async function() {
    let currentPage = 1;
    const charactersPerPage = 6;
    let totalPages = 0;
    let currentQuery = '';

    const audio = document.getElementById('background-audio');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    playBtn.addEventListener('click', function() {
        audio.play();
    });

    pauseBtn.addEventListener('click', function() {
        audio.pause();
    });

    audio.play();

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        currentQuery = document.getElementById('query').value;
        currentPage = 1;
        loadCharacters(currentPage, currentQuery);
    });

    async function loadCharacters(page, query = '') {
        const data = await callCards(page, query);
        totalPages = Math.ceil(data.info.count / charactersPerPage);
        const characters = data.results;

        const container = document.getElementById('character-cards');
        container.innerHTML = '';

        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            let statusClass = '';
            switch (character.status.toLowerCase()) {
                case 'alive':
                    statusClass = 'status-alive';
                    break;
                case 'dead':
                    statusClass = 'status-dead';
                    break;
                default:
                    statusClass = 'status-unknown';
                    break;
            }

            const firstEpisodeUrl = character.episode[0];
            const episodeName = await getEpisodeName(firstEpisodeUrl);

            const card = `
                <div class="col-12 col-sm-4">
                    <div class="image-container">
                        <div class="card">
                            <img src="${character.image}" class="card-img-top" alt="${character.name}">
                            <div class="card-body">
                                <h5 class="card-title">${character.name}</h5>
                                <p class="card-text">
                                    <span class="status ${statusClass}"></span>
                                    <span>${character.status} - ${character.species}</span>
                                </p>
                                <p class="location-title seen-title">Última localização conhecida</p>
                                <p class="card-text">${character.location.name}</p>
                                <p class="location-title seen-title">Visto pela última vez em</p>
                                <p class="location seen">${episodeName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        }
        updatePaginationControls(query);
    }

    function updatePaginationControls(query = '') {
        const prevPageButton = document.getElementById('prev-page');
        const nextPageButton = document.getElementById('next-page');

        prevPageButton.parentElement.classList.toggle('disabled', currentPage === 1);
        nextPageButton.parentElement.classList.toggle('disabled', currentPage === totalPages);

        prevPageButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                loadCharacters(currentPage, query);
                topFunction();
            }
        };

        nextPageButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadCharacters(currentPage, query);
                topFunction();
            }
        };
    }

    async function updateFooter() {
        const characterCount = await getCharacterCount();
        const locationCount = await getLocationCount();
        const episodeCount = await getEpisodeCount();

        document.getElementById('character-count').textContent = characterCount;
        document.getElementById('location-count').textContent = locationCount;
        document.getElementById('episode-count').textContent = episodeCount;
    }

    loadCharacters(currentPage);
    updateFooter();
});

window.onscroll = function() { scrollFunction(); };

function scrollFunction() {
    const topBtn = document.getElementById("topBtn");
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
}

// Função para rolar para o topo da página
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}