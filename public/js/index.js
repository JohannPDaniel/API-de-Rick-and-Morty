document.addEventListener('DOMContentLoaded', async function () {
    let currentPage = 1;
    const charactersPerPage = 6;
    let totalPages = 0;
    let currentQuery = '';

    const audio = document.getElementById('background-audio');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    playBtn.addEventListener('click', function () {
        audio.play();
    });

    pauseBtn.addEventListener('click', function () {
        audio.pause();
    });

    audio.play();

    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        currentQuery = document.getElementById('query').value;
        currentPage = 1;
        console.log("Form submitted. Query:", currentQuery);
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
            const statusClass = applyStatusClass(character.status.toLowerCase());
            const hoverClass = applyHoverClass(character.status.toLowerCase());

            const firstEpisodeUrl = character.episode[0];
            const episodeName = await getEpisodeName(firstEpisodeUrl);

            const card = `
                <div class="col-12 col-sm-4 mb-3">
                    <div class="image-container">
                        <div class="card ${hoverClass}">
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
                                <button type="button" class="btn btn-success btn-sm pt-2">
                                    <a href="./detalhes.html?id=${character.id}" class="text-decoration-none text-white">Mais detalhes</a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        }
        updatePaginationControls(query);
    }

    function applyStatusClass(status) {
        switch (status) {
            case 'alive':
                return 'status-alive';
            case 'dead':
                return 'status-dead';
            default:
                return 'status-unknown';
        }
    }

    function applyHoverClass(status) {
        switch (status) {
            case 'alive':
                return 'card-hover-alive';
            case 'dead':
                return 'card-hover-dead';
            default:
                return 'card-hover-unknown';
        }
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
                console.log("Next page button clicked. Current page:", currentPage);
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

window.onscroll = function () { scrollFunction(); };

function scrollFunction() {
    const topBtn = document.getElementById("topBtn");
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
