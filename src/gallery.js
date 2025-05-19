import { observer } from "./lazyLoading";
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
          <div class="movieCenterDiv">
          <h2>Available on</h2>
          <hr>
          <div class="watchButtons">
          </div>
          </div>
          <button class='details' type='Button' value='${movie.id}'>Details</button>
          `;

        if (movie.poster_path == null && movie.backdrop_path == null) {
            document.getElementById(movie.id).innerHTML += `<div class='imageTextDiv'><h1 class='imageText'>${movie.title}</h1></div>`;
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
            const acceptedProviders = [337, 8, 119, 1899]
            console.log(watchbuttonsDiv.innerHTML.trim() == ``);
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

    const cache = localStorage.getItem(id); // Source: https://www.slingacademy.com/article/implement-caching-strategies-with-javascript-fetch/


    const region = preferences.region;
    console.log(region);

    if (cache != null && Date.now() - JSON.parse(cache).timestamp < 86400000) {
        try {
            return Promise.resolve(JSON.parse(cache).results[region].flatrate);
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

const showDetails = async (id) => {
    const movieDescriptionDiv = document.querySelector(".movieDescription");
    movieDescriptionDiv.classList.remove("hidden");
    movieDescriptionDiv.querySelector(".description").innerHTML = ``;
    movieDescriptionDiv.querySelector(".description").innerHTML = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=${preferences.language}`, options).then(res => res.json()).then(json => json.overview);

    movieDescriptionDiv.querySelector("#loadingAnimationDescription").classList.add("hidden");
}

export const closeDetails = () => {
    const movieDescriptionDiv = document.querySelector(".movieDescription");
    movieDescriptionDiv.classList.add("hidden");

    movieDescriptionDiv.querySelector("#loadingAnimationDescription").classList.remove("hidden");
}

export const mapButtons = (div) => {
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
        .then((returnJSON => { return returnJSON.streamingOptions.be }))
        .then((platformsBE => {
            console.log(platformsBE)
            for (let platform of platformsBE) {
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