import { preferences } from "./preferences";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

export const createGallery = async (movies) => {
    const movieList = document.querySelector("#movieList");
    for (const movie of movies) {
        movieList.innerHTML += `
          <div class='movie' id="${movie.id}">
          <h1 class='movieTitle'>${movie.title}</h1>
          <button class='favorite' type='button' value='${movie.id}'></button>
          <div class="movieCenterDiv">
          <h2>Available on</h2>
          <hr>
          <div class="watchButtons">
          </div>
          </div>
          <a class='details' id='${movie.id}D' target="_blank"><img src='/IMDb.png' alt="IMDb"></img></a>
          `;

        if (movie.poster_path == null && movie.backdrop_path == null) {
            document.getElementById(movie.id).innerHTML += `<div class='imageTextDiv'><h1 class='imageText'>${movie.title}</h1></div></div>`;
        } else {
            document.getElementById(movie.id).innerHTML += `<img width="500" height="750" src='https://image.tmdb.org/t/p/w500${movie.poster_path == null ? movie.backdrop_path : movie.poster_path}'>
          </div>`;
        }
    }
}

export const createButtons = (id, providersList = []) => {
    const watchbuttonsDiv = document.getElementById(id).querySelector('.watchButtons');

    if (providersList.length == 0) {
        watchbuttonsDiv.innerHTML += `<h3>Unavailable</h3>`
        return;
    } else {
        for (let provider of providersList) {
            const acceptedProviders = [337, 8, 119, 1899];
            if (watchbuttonsDiv.innerHTML.trim() == `` && !acceptedProviders.includes(provider.provider_id)) {
                watchbuttonsDiv.innerHTML += `<h3>Unavailable</h3>`
                return;
            }

            switch (provider.provider_id) {
                // Disney+
                case 337:
                    watchbuttonsDiv.innerHTML += `<button class='watchButtonDisney' type='Button' value='${id}'><img src='/Disney.png' alt='Disney+'></img></button>`;
                    break;
                // Netflix
                case 8:
                    watchbuttonsDiv.innerHTML += `<button class='watchButtonNetflix' type='Button' value='${id}'><img src="/Netflix.svg" alt="Netflix"></img></button>`;
                    break;
                // Amazon Prime Video
                case 119:
                    watchbuttonsDiv.innerHTML += `<button class='watchButtonPrimeVideo' type='Button' value='${id}'><img src='/PrimeVideo.svg' alt='Prime Video'></img></button>`;
                    break;
                // HBO Max
                case 1899:
                    watchbuttonsDiv.innerHTML += `<button class='watchButtonHBOMax' type='Button' value='${id}'><img src='/HBOMax.png' alt='HBO Max'></img></button>`;
                    break;
                default:
                    break;
            }
        }
    }
}

export const getProviders = (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers`

    const cache = localStorage.getItem(id) == null ? null : JSON.parse(localStorage.getItem(id)); // Source: https://www.slingacademy.com/article/implement-caching-strategies-with-javascript-fetch/


    const region = preferences.region;

    if (cache != null && Date.now() - cache.timestamp < 86400000) {
        try {
            return Promise.resolve(cache.results[region].flatrate);
        } catch (error) {
            return Promise.resolve([]);
        }

    } else {

        return fetch(url, options)
            .then(res => res.json())
            .then(json => {
                let providers;
                try {
                    providers = json.results[region].flatrate;

                } catch (error) {
                    providers = [];
                } finally {
                    json.timestamp = Date.now()
                    localStorage.setItem(id, JSON.stringify(json));

                    return providers;
                }
            })
            .catch(err => { console.error(err); return [] });
    }
}

export const mapButtons = async (div) => {

    const detailsButton = div.querySelector(`.details`);

    detailsButton.href = `https://www.imdb.com/title/` + await fetch(`https://api.themoviedb.org/3/movie/${detailsButton.id.slice(0, -1)}/external_ids`, options).then(res => res.json()).then(json => json.imdb_id);


    const buttonsMap = new Map([
        [".watchButtonNetflix", "netflix"],
        [".watchButtonPrimeVideo", "prime"],
        [".watchButtonDisney", "disney"],
        [".watchButtonHBOMax", "hbo"]
    ])

    for (const [buttonRef, streamingID] of buttonsMap) {
        for (const streamingButton of div.querySelectorAll(buttonRef)) {
            streamingButton.addEventListener('click', () => {
                goToStreaming(streamingButton.value, streamingID);
            })
        }
    }

    for (const movie of document.querySelectorAll(".details")) {
        movie.addEventListener('click', () => {
            showDetails(movie.value);
        })
    }
}

const goToStreaming = async (id, streamingPlatform) => {
    const RapidAPIURL = `https://streaming-availability.p.rapidapi.com/shows/movie/${id}`

    fetch(RapidAPIURL, { method: 'GET', headers: { 'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY, 'x-rapidapi-host': 'streaming-availability.p.rapidapi.com' } })
        .then((res) => res.json())
        .then((returnJSON => { return returnJSON.streamingOptions[preferences.region.toLowerCase()] }))
        .then((platforms => {
            for (let platform of platforms) {
                if (platform.service.id == streamingPlatform && platform.type == "subscription") {
                    if (platform.videoLink != undefined) {
                        window.open(platform.videoLink);
                    } else {
                        window.open(platform.link)
                    }
                }
            }
        }))
        .catch(err => console.error(err))
}