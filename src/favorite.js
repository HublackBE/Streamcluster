// This file is responsible for managing the favorite movies.
// It handles the logic for adding and removing movies from the favorites list.
// It also manages the display of the favorite button and its state.


// Import the preferences object from the preferences module
import { preferences } from "./preferences";

// Define the options for the fetch API call, including headers and authorization
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};


// Maps the favorite button in a given div element.
// Adds the 'favorited' class if the movie is already a favorite,
// and sets up the click event listener to handle favoriting/unfavoriting.
// @param {HTMLElement} div - The container element with a favorite button.
export const mapFavorite = (div) => {
    // Find the favorite button within the div
    const button = div.querySelector(`.favorite`);
    // Retrieve favorites from localStorage or initialize if not present
    const favorites = localStorage.getItem(`Favorites`) == null ? { favorites: [], cache: [] } : JSON.parse(localStorage.getItem(`Favorites`));

    // If the movie is already a favorite, add the 'favorited' class
    if (favorites.favorites.includes(button.value)) {
        button.classList.add(`favorited`);
    }

    // Add click event listener to handle favoriting/unfavoriting
    button.addEventListener(`click`, () => {
        favoriteMovie(button, button.value);
    })
}

// Handles the logic for favoriting or unfavoriting a movie.
// Updates the favorites and cache in localStorage accordingly.
// @param {HTMLElement} button - The favorite button element.
// @param {string} id - The movie ID.
const favoriteMovie = async (button, id) => {
    // Retrieve favorites from localStorage or initialize if not present
    const favorites = localStorage.getItem(`Favorites`) == null ? { favorites: [], cache: [] } : JSON.parse(localStorage.getItem(`Favorites`));

    // Fetch movie details from the API
    const movie = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=${preferences.language}`, options).then(res => res.json());

    // Toggle the 'favorited' class and update favorites/cache accordingly
    if (button.classList.toggle(`favorited`) /* Returns True when adding class */) {
        favorites.favorites.push(id);
        favorites.cache.push(movie);
    } else {
        favorites.favorites.splice(favorites.favorites.indexOf(id), 1);
        favorites.cache.splice(favorites.cache.indexOf(movie), 1);
    }

    // Save the updated favorites and cache back to localStorage
    localStorage.setItem(`Favorites`, JSON.stringify(favorites));
}