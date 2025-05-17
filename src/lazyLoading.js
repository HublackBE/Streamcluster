import { createButtons, mapButtons } from "./gallery";
import { getProviders } from "./gallery";

const callback = (entries, observer) => {
    entries.forEach(async entry => {
        if (entry.isIntersecting && entry.target.querySelector(`.watchButtons`).innerHTML == `
          <h2>Available on</h2>
          <hr>
          `) {

            createButtons(entry.target.id, await getProviders(entry.target.id));
            mapButtons(entry.target);
        }
    });
}

export const observer = new IntersectionObserver(callback, {
    root: document.querySelector(`#movieList`),
    rootMargin: `0px`,
    threshold: 0,
})
