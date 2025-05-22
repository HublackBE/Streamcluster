// Main entry point for the Favorites page.
// Handles authentication, loads user preferences, and displays favorite movies.


// Import styles and required modules
import './style.css';
// Import loadFavorites function from load.js
import { loadFavorites } from './load.js';
// Import preferences object and mapPreferences function from preferences.js
import { preferences, mapPreferences } from './preferences.js';


// Options for the API request, including authorization header
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};

// Checks the API response for success.
// If authentication fails, displays an error.
// If successful, sets up the UI and loads favorites.
// @param {Object} json - The JSON response from the API.
const checkSuccess = async json => {
  if (!json.success) {
    // Display authentication error
    document.querySelector('#app').innerHTML += `<h1>Auth Error</h1><p>${JSON.stringify(json)}</p>`;
  } else {
    // Show loading animation and hidden movie list
    document.querySelector('#app').innerHTML += `
        <div id="loadingAnimationList" class="loadingAnimation">
        <div class="loader"></div>
        <div class="loaderText"></div>
        </div>
        <div id="movieList" class='hidden'></div>`;

    // Map user preferences and store them in localStorage
    mapPreferences();
    localStorage.setItem(`preferences`, JSON.stringify(preferences));

    // Load the user's favorite movies
    loadFavorites();
  }
}

// API endpoint for authentication
const url = 'https://api.themoviedb.org/3/authentication';

// Fetch authentication status and handle response
fetch(url, options)
  .then(res => res.json())
  .then(json => checkSuccess(json))
  .catch(err => console.error(err));