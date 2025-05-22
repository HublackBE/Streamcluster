// This file handles displaying movies and streaming provider buttons.
// Handles fetching provider data, caching, and mapping UI events.


// Import the preferences object from the preferences module
import { preferences } from "./preferences";

// Options for TMDB API requests
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

// Creates the movie gallery by injecting movie cards into the DOM.
// @param {Array} movies - Array of movie objects to display.
export const createGallery = async (movies) => {
    const movieList = document.querySelector("#movieList");
    for (const movie of movies) {
        // Add movie card HTML
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

        // Add poster or fallback text if no image available
        if (movie.poster_path == null && movie.backdrop_path == null) {
            document.getElementById(movie.id).innerHTML += `<div class='imageTextDiv'><h1 class='imageText'>${movie.title}</h1></div></div>`;
        } else {
            document.getElementById(movie.id).innerHTML += `<img width="500" height="750" src='https://image.tmdb.org/t/p/w500${movie.poster_path == null ? movie.backdrop_path : movie.poster_path}'>
          </div>`;
        }
    }
}

// Creates streaming provider buttons for a movie.
// @param {string} id - Movie ID.
// @param {Array} providersList - List of provider objects.
export const createButtons = (id, providersList = []) => {
    const watchbuttonsDiv = document.getElementById(id).querySelector('.watchButtons');

    if (providersList.length == 0) {
        // No providers available
        watchbuttonsDiv.innerHTML += `<h3>Unavailable</h3>`
        return;
    } else {
        for (let provider of providersList) {
            // Only show accepted providers
            const acceptedProviders = [337, 8, 119, 1899];
            if (watchbuttonsDiv.innerHTML.trim() == `` && !acceptedProviders.includes(provider.provider_id)) {
                watchbuttonsDiv.innerHTML += `<h3>Unavailable</h3>`
                return;
            }

            // Add button for each supported provider
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

// Fetches streaming providers for a movie, with caching.
// @param {string} id - Movie ID.
// @returns {Promise<Array>} - Promise resolving to list of providers.
export const getProviders = (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers`

    // Try to get cached data from localStorage
    const cache = localStorage.getItem(id) == null ? null : JSON.parse(localStorage.getItem(id)); // Source: https://www.slingacademy.com/article/implement-caching-strategies-with-javascript-fetch/

    const region = preferences.region;

    // Use cache if not expired (24 hours)
    if (cache != null && Date.now() - cache.timestamp < 86400000) {
        try {
            return Promise.resolve(cache.results[region].flatrate);
        } catch (error) {
            return Promise.resolve([]);
        }

    } else {
        // Fetch from API if no cache or cache expired
        return fetch(url, options)
            .then(res => res.json())
            .then(json => {
                let providers;
                try {
                    providers = json.results[region].flatrate;

                } catch (error) {
                    providers = [];
                } finally {
                    // Store response in cache with timestamp
                    json.timestamp = Date.now()
                    localStorage.setItem(id, JSON.stringify(json));

                    return providers;
                }
            })
            .catch(err => { console.error(err); return [] });
    }
}

// Maps streaming and details buttons to their respective event handlers.
// @param {HTMLElement} div - Movie card div element.
export const mapButtons = async (div) => {

    const detailsButton = div.querySelector(`.details`);

    // Set IMDb link for details button
    detailsButton.href = `https://www.imdb.com/title/` + await fetch(`https://api.themoviedb.org/3/movie/${detailsButton.id.slice(0, -1)}/external_ids`, options).then(res => res.json()).then(json => json.imdb_id);

    // Map of button selectors to streaming service IDs
    const buttonsMap = new Map([
        [".watchButtonNetflix", "netflix"],
        [".watchButtonPrimeVideo", "prime"],
        [".watchButtonDisney", "disney"],
        [".watchButtonHBOMax", "hbo"]
    ])

    // Add click event for each streaming button
    for (const [buttonRef, streamingID] of buttonsMap) {
        for (const streamingButton of div.querySelectorAll(buttonRef)) {
            streamingButton.addEventListener('click', () => {
                goToStreaming(streamingButton.value, streamingID);
            })
        }
    }

    // Add click event for all details buttons
    for (const movie of document.querySelectorAll(".details")) {
        movie.addEventListener('click', () => {
            showDetails(movie.value);
        })
    }
}

// Opens the streaming link for a movie on the selected platform.
// @param {string} id - Movie ID.
// @param {string} streamingPlatform - Streaming platform identifier.
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