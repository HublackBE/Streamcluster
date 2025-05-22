// This file handles filtering and sorting logic for the website.
// It manages sort order, genre selection, and updates the UI accordingly.


// Import the preferences object from the preferences module
import { preferences } from "./preferences";

// API request options for fetching genres
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

// Parse the current URL to extract query parameters
const url = new URL(window.location.href);

// Determine the current sort order from the URL, defaulting to 'popularity.desc'
export const sortBy = url.searchParams.get(`sort_by`) == null ? `popularity.desc` : url.searchParams.get(`sort_by`);

// Array to hold selected genres
export const genres = [];


// Populates the genres array with selected genres from the URL query parameters.
// Only parameters with value 'on' are considered selected.
const getGenres = () => {
        url.searchParams.forEach((value, param) => {
                if (value == `on`) {
                        genres.push(param);
                }
        })
}

// Main function to map sorting and filtering UI to the current state.
// Calls functions to map sort order, selected genres, and genre checkboxes.
export const mapFilterSort = () => {
        mapSort();

        getGenres();

        mapFilterGenres();
}

// Sets up the sort order dropdown and ensures the correct option is selected.
// Submits the form when the sort order changes.
const mapSort = () => {
        const orderSelect = document.querySelector(`#sort_by`)
        orderSelect.addEventListener(`change`, (event) => {
                document.querySelector(`#filterSort`).submit();
        })

        for (const option of orderSelect.querySelectorAll(`option`)) {
                if (sortBy == option.value) {
                        option.selected = true;
                }
        }
}

// Fetches all available genres from the API and populates the genre filter UI.
// Checks checkboxes for genres that are currently selected.
const mapFilterGenres = async () => {
        // Fetch genres from the API
        const allGenres = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${preferences.language}`, options).then(res => res.json()).then(json => json.genres).catch(err => console.error(err));

        const genresDiv = document.getElementById(`genres`);

        // Add a checkbox for each genre
        for (const genre of allGenres) {
                genresDiv.innerHTML += `<div class="genre"><input type="checkbox" id="${genre.id}G" name="${genre.id}"><label for="${genre.id}G">${genre.name}</label></div>`;
        }

        // Set checked state for selected genres
        for (const checkbox of document.querySelectorAll(`.genre input`)) {
                checkbox.checked = genres.includes(checkbox.name);
        }

}