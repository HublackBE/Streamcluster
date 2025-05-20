import { mapFavorite } from "./favorite";
import { createButtons, mapButtons } from "./gallery";
import { getProviders } from "./gallery";


// Source: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
const callback = (entries, observer) => {
    entries.forEach(async entry => {
        if (entry.isIntersecting && entry.target.querySelector(`.watchButtons`).innerHTML.trim() == ``) {

            createButtons(entry.target.id, await getProviders(entry.target.id));
            mapButtons(entry.target);
            mapFavorite(entry.target, entry.target.id);
        }
    });
}

export const observer = new IntersectionObserver(callback, {
    root: document.querySelector(`#movieList`),
    rootMargin: `0px`,
    threshold: 0,
})
