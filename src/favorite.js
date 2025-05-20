import { preferences } from "./preferences";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};


export const mapFavorite = (div) => {
    const button = div.querySelector(`.favorite`);
    const favorites = localStorage.getItem(`Favorites`) == null ? { favorites: [], cache: [] } : JSON.parse(localStorage.getItem(`Favorites`));

    console.log(favorites);

    if (favorites.favorites.includes(button.value)) {
        button.classList.add(`favorited`);
    }

    button.addEventListener(`click`, () => {
        favoriteMovie(button, button.value);
    })
}

const favoriteMovie = async (button, id) => {
    const favorites = localStorage.getItem(`Favorites`) == null ? { favorites: [], cache: [] } : JSON.parse(localStorage.getItem(`Favorites`));

    const movie = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=${preferences.language}`, options).then(res => res.json());

    if (button.classList.toggle(`favorited`) /* Returns True when adding class */) {
        console.log(favorites);
        favorites.favorites.push(id);
        favorites.cache.push(movie);
    } else {
        favorites.favorites.splice(favorites.favorites.indexOf(id), 1);
        favorites.cache.splice(favorites.cache.indexOf(movie), 1);
    }

    localStorage.setItem(`Favorites`, JSON.stringify(favorites));
}