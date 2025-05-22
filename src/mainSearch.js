// Main entry point for the search page.
// Handles authentication, loads user preferences, and triggers the search.


// Import styles and required modules
import './style.css';
// Import loadSearch function from load.js
import { loadSearch } from './load.js';
// Import preferences object and mapPreferences function from preferences.js
import { preferences, mapPreferences } from './preferences.js';


// Set up fetch options with API key from environment variables
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};

// Parse URL parameters to get the search query
const urlParameters = new URLSearchParams(window.location.search);
const searchQuery = urlParameters.get('query');

// Checks the authentication response.
// If successful, sets up the UI and loads search results.
// If not, displays an authentication error.
// @param {Object} json - The response JSON from the authentication API.
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

    // Map and save user preferences
    mapPreferences();
    localStorage.setItem(`preferences`, JSON.stringify(preferences));

    // Determine the current page (default to 1)
    const page = urlParameters.get(`page`) == null ? 1 : urlParameters.get(`page`);

    // Load search results
    loadSearch(page, encodeURIComponent(searchQuery));
  }
}

// Authentication API endpoint
const url = 'https://api.themoviedb.org/3/authentication';

// Fetch authentication status and handle the response
fetch(url, options)
  .then(res => res.json())
  .then(json => checkSuccess(json))
  .catch(err => console.error(err));