const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const moviesGrid = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');

let currentMovies = [];






searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetchMovies(searchTerm);
    }
});



async function fetchMovies(searchTerm) {
    try {

        const res = await fetch(`http://www.omdbapi.com/?apikey=160f0492&s=${searchTerm}`);
        const data = await res.json();

        if (data.Response === 'True') {
            currentMovies = data.Search;
            resultsInfo.textContent = `Showing: ${searchTerm}`;
            displayMovies(currentMovies);
        } else {
            moviesGrid.innerHTML = '<p>No movies found.</p>';
            currentMovies = [];
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        resultsInfo.textContent = 'An error occurred while fetching movies.';
    }
}


function displayMovies(movies) {
    if (!Array.isArray(movies)) {
        console.error('Expected an array but got:', movies);
        return;
    }
    const movieResults = movies.map((movie) => {
        const poster = movie.Poster !== 'N/A' ? movie.Poster : '';

        return `
            <div class="movie-card">
                ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}">` : `<div class="movie-card__no-img">No Image</div>`}
                <h2 class="movie-card__title">${movie.Title}</h2>
                <p class="movie-card__year">${movie.Year}</p>
            </div>
        `;    
    }).join('');

    moviesGrid.innerHTML = movieResults;
}



sortSelect.addEventListener('change', (event) => {
    sortMovies(event.target.value);
});

function sortMovies(sortType) {
    let sortedMovies = [...currentMovies];

    if (sortType === 'a-z') {
        sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortType === 'z-a') {
        sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (sortType === 'newest') {
        sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
    } else if (sortType === 'oldest') {
        sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
    }

    displayMovies(sortedMovies);
}