document.addEventListener('DOMContentLoaded', async function () {
    let currentPage = 1;
    const charactersPerPage = 6;
    let totalPages = 0;

    const toggleBtn = document.getElementById('toggleBtn');
    const volumeIcon = document.getElementById('volumeIcon');
    const audio = document.getElementById('background-audio');
    let isPlaying = false;

    toggleBtn.addEventListener('click', function () {
        if (isPlaying) {
            audio.pause();
            toggleBtn.classList.remove('btn-success');
            toggleBtn.classList.add('btn-danger');
            volumeIcon.src = './images/sem-som.png';
            volumeIcon.alt = 'sem som';
        } else {
            audio.play();
            toggleBtn.classList.remove('btn-danger');
            toggleBtn.classList.add('btn-success');
            volumeIcon.src = './images/volume-alto.png';
            volumeIcon.alt = 'com volume';
        }
        isPlaying = !isPlaying;
    });

    async function loadCharacters(page, query = '') {
        const data = await callCards(page, query);
        totalPages = Math.ceil(data.info.count / charactersPerPage);
        const characters = data.results;

        const container = document.getElementById('character-cards');
        container.innerHTML = '';

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
