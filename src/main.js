// Main entry point for the website.
// Handles authentication, loads preferences, and initializes the movie list.


// Import styles and modules
import './style.css';
// Import the loadDiscover function from load.js
import { loadDiscover } from './load.js';
// Import the preferences object and mapPreferences function from preferences.js
import { preferences, mapPreferences } from './preferences.js';
// Import the mapFilterSort function from filterSort.js
import { mapFilterSort } from './filterSort.js';

// Options for the fetch request, including API key from environment variables
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};

// Parse URL parameters from the current window location
const urlParameters = new URLSearchParams(window.location.search);

// Checks the success property of the API response.
// If authentication fails, displays an error.
// If successful, sets up the UI and loads preferences and movies.
// @param {Object} json - The JSON response from the API.
const checkSuccess = async json => {
  if (!json.success) {
    // Display authentication error
    document.querySelector('#app').innerHTML += `<h1>Auth Error</h1><p>${JSON.stringify(json)}</p>`;
  } else {
    // Show loading animation and prepare movie list container
    document.querySelector('#app').innerHTML += `
        <div id="loadingAnimationList" class="loadingAnimation">
        <div class="loader"></div>
        <div class="loaderText"></div>
        </div>
        <div id="movieList" class='hidden'></div>`;

    // Map and store user preferences
    mapPreferences();
    localStorage.setItem(`preferences`, JSON.stringify(preferences));

    // Set up filter and sort options
    mapFilterSort();

    // Determine the page to load from URL parameters, default to 1
    const page = urlParameters.get(`page`) == null ? 1 : urlParameters.get(`page`);

    // Load the discover page with movies
    loadDiscover(page);
  }
}

// API endpoint for authentication
const url = 'https://api.themoviedb.org/3/authentication';

// Fetch authentication status from the API
fetch(url, options)
  .then(res => res.json())
  .then(json => checkSuccess(json))
  .catch(err => console.error(err));