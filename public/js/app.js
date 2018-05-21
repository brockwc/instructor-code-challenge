document.addEventListener('DOMContentLoaded', 
function(event) {
    console.log("loaded")

    // SEARCH AND APPEND RESULTS
    const searchForm = document.forms['search-form'];
    searchForm.addEventListener("submit", findMovieByName);

    // Perform a search through OMDB
    function findMovieByName(event) {
        event.preventDefault();
        // Capture search term
        let searchTerm = document.getElementById('query').value;

        // Use fetch to create a promise that returns matches if successful or an error message if nothing is found
        let urlParams = new URLSearchParams();
            urlParams.append('apikey', 'efb7e3d0');
            urlParams.append('type', 'movie');
            urlParams.append('r', 'json');
            urlParams.append('s', `${searchTerm}`)

        const filmListPromise = fetch(`https://www.omdbapi.com/?${urlParams}`);
        filmListPromise
            .then(data => data.json())
            .then(data => { 
                console.log(data)
                appendFilmList(data)
                hydrateFilmDetails(data)
            })
            .catch((err) => {
                console.error(err);
            })

        document.getElementById('query').value = ''
    }

    // When results are successfully found, append them to the search-results container
    function appendFilmList(data) {
        let filmList = data.Search;
        const resultContainer = document.getElementById('search-results');
        const markup = `
        <ul>
            ${filmList.map(film => 
                `<li class='film'>
                    ${film.Title}
                    <div id='${film.imdbID}' style='display:none'></div>
                </li>`
            ).join('')}
        </ul>
        `;

        resultContainer.innerHTML = markup;
    }

    // RETRIEVE, APPEND, AND SHOW/HIDE FILM DETAILS
    function hydrateFilmDetails(data) {
        let filmList = data.Search;

        for (film of filmList) {
            let filmUrlParams = new URLSearchParams();
                filmUrlParams.append('apikey', 'efb7e3d0');
                filmUrlParams.append('type', 'movie');
                filmUrlParams.append('r', 'json');
                filmUrlParams.append('i', `${film.imdbID}`)

            let filmDetailPromise = fetch(`https://www.omdbapi.com/?${filmUrlParams}`);
            filmDetailPromise
            .then(filmData => filmData.json())
            .then(filmData => { 
                appendDetail(filmData)
                detailToggle()
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }

    // This uses the film ID to find where to place the details and the markup to do it
    function appendDetail(filmData) {
        let filmDetailContainer = document.getElementById(`${filmData.imdbID}`)
        const detailMarkup = `
            <form name="new-favorite" action="/favorites" method="post">
                <input type="hidden" name="name" value="${filmData.Title}">
                <input type="hidden" name="oid" value="${filmData.imdbID}">
                <input type="submit" value="Favourite" id="submit"/>
            </form>
            <p class="year">${filmData.Year}</p>
            <p class="writer">${filmData.Writer}</p>
            <p class="director">${filmData.Director}</p>
            <p class="actors">${filmData.Actors}</p>
            <p class="plot">${filmData.Plot}</p>
            <p class="rated">${filmData.Rated}</p>
        `;
        
        filmDetailContainer.innerHTML = detailMarkup;
    }

    // This provides toggling behaviour for showing and hiding the details to the user
    function detailToggle() {
        let foundFilms = document.getElementsByClassName('film')

        for (foundFilm of foundFilms) {
            foundFilm.onclick = function() {
                let filmDetails = this.firstElementChild;
                
                if (filmDetails.style.display === 'none') {
                    filmDetails.style.display = 'block'
                } else {
                    filmDetails.style.display = 'none'
                }
            }
        }
    }

    // SHOW LIST OF FAVORITES
    const faveFilmToggle = document.getElementById('favorite-film-toggle')
    const faveFilmsList = document.getElementById('favorites-container')

    faveFilmToggle.onclick = function() {
        if (faveFilmsList.style.display === 'none') {
            faveFilmsList.style.display = 'block'
        } else {
            faveFilmsList.style.display = 'none'
        }
    }
});