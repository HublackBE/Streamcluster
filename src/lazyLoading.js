// This file handles lazy loading of watch and favorite buttons for movie items.
// Uses Intersection Observer to detect when movie elements enter the viewport,
// then dynamically loads and attaches the appropriate buttons.


// Import the mapFavorite function from the favorite module
import { mapFavorite } from "./favorite";
// Import the createButtons and mapButtons functions from the gallery module
import { createButtons, mapButtons } from "./gallery";
// Import the getProviders function from the gallery module
import { getProviders } from "./gallery";


// Intersection Observer callback function
// This function is called whenever the observed elements intersect with the viewport
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
const callback = (entries, observer) => {
    entries.forEach(async entry => {
        // Check if the element is intersecting and its .watchButtons container is empty
        if (entry.isIntersecting && entry.target.querySelector(`.watchButtons`).innerHTML.trim() == ``) {

            // Create watch buttons for the current element using its ID and provider data
            createButtons(entry.target.id, await getProviders(entry.target.id));
            // Map the created buttons to the element
            mapButtons(entry.target);
            // Map the favorite button to the element
            mapFavorite(entry.target, entry.target.id);
        }
    });
}

// Create an IntersectionObserver instance with the callback
// Observes elements within the #movieList container
export const observer = new IntersectionObserver(callback, {
    root: document.querySelector(`#movieList`),
    rootMargin: `0px`,
    threshold: 0,
})