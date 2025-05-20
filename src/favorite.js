
export const mapFavorite = (div) => {
    const button = div.querySelector(`.favorite`);
    const favorites = localStorage.getItem(`Favorites`) == null ? [] : JSON.parse(localStorage.getItem(`Favorites`));

    if (favorites.includes(button.value)) {
        button.classList.add(`favorited`);
    }

    button.addEventListener(`click`, () => {
        favoriteMovie(button, button.value);
    })
}

const favoriteMovie = (button, id) => {
    const favorites = localStorage.getItem(`Favorites`) == null ? [] : JSON.parse(localStorage.getItem(`Favorites`));

    if (button.classList.toggle(`favorited`) /* Returns True when adding class */) {
        favorites.push(id);
    } else {
        favorites.splice(favorites.indexOf(id), 1);
    }

    localStorage.setItem(`Favorites`, JSON.stringify(favorites));
}