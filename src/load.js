// Handles loading and displaying movie data from The Movie Database (TMDb) API.
// Provides functions to fetch movies based on discovery filters, popularity, search queries, and user favorites.
// Integrates with modules for filtering, sorting, gallery creation, lazy loading, pagination, and user preferences.
// Manages the display of loading animations and the movie list in the UI.


// Import genres and sortBy from filterSort.js for filtering and sorting movies
import { genres, sortBy } from './filterSort.js';
// Import gallery module for creating the movie gallery
import * as gallery from './gallery.js';
// Import observer for lazy loading images
import { observer } from './lazyLoading.js';
// Import pagination creation function
import { createPagination } from './pagination.js';
// Import user preferences (language, region, streaming platforms)
import { preferences } from './preferences.js';

// Options for fetch requests, including API key from environment variables
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

// Generic load function to fetch data from a given URL and process the response
const load = url => {
    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            loadCreate(json);
        })
        .catch(err => console.error(err));
}

// Handles the creation of the gallery and pagination after data is loaded
const loadCreate = async (json) => {
    createPagination(json);

    await gallery.createGallery(json.results);

    // Observe each movie element for lazy loading
    for (const movie of document.querySelectorAll(`.movie`)) {
        observer.observe(movie);
    }

    // Hide loading animation and show the movie list
    document.querySelector("#loadingAnimationList").classList.add("hidden");
    document.querySelector('#movieList').classList.remove("hidden");
}

// Load movies using the "discover" endpoint with filters for streaming platforms and genres
export const loadDiscover = page => {
    let with_watch_providers = `with_watch_providers=`;

    // Add selected streaming platforms to the query
    for (const streamingPlatform of preferences.streamingPlatforms) {
        with_watch_providers += streamingPlatform + `|`;
    }

    let with_genres = `with_genres=`;

    // Add selected genres to the query
    for (const genre of genres) {
        with_genres += genre + `,`;
    }

    // Build the full API URL with all filters and preferences
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${preferences.language}&page=${page}&sort_by=${sortBy}&watch_region=${preferences.region}&${with_watch_providers}&${with_genres}`;

    load(url);
}

// Load popular movies using the "popular" endpoint
export const loadPopular = page => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=${preferences.language}&page=${page}&region=${preferences.region}`;

    load(url);
}

// Load movies based on a search query
export const loadSearch = (page, query) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=${preferences.language}&page=${page <= 0 ? 1 : page}&region=${preferences.region}`;

    load(url);
}

// Load favorite movies from localStorage and display them in the gallery
export const loadFavorites = async () => {
    // Retrieve favorites from localStorage or initialize if not present
    const favorites = localStorage.getItem(`Favorites`) == null ? { favorites: [], cache: [] } : JSON.parse(localStorage.getItem(`Favorites`));

    await gallery.createGallery(favorites.cache);

    // Observe each movie element for lazy loading
    for (const movie of document.querySelectorAll(`.movie`)) {
        observer.observe(movie);
    }

    // Hide loading animation and show the movie list
    document.querySelector("#loadingAnimationList").classList.add("hidden");
    document.querySelector('#movieList').classList.remove("hidden");
}