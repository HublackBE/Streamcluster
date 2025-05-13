import * as gallery from './gallery.js';

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
  };

export const loadPopular = page => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&region=BE`;

    fetch(url, options)
        .then(res => res.json())
        .then(async json => {
            await gallery.createGallery(json.results);

            await gallery.mapButtons();

            document.querySelector("#loadingAnimationList").classList.add("hidden");
            document.querySelector('#movieList').classList.remove("hidden");
        })
        .catch(err => console.error(err));
}

export const loadSearch = (page, query) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page <= 0 ? 1 : page}`;

    fetch(url, options)
        .then(res => res.json())
        .then(async json => {
            console.log(json);
            await gallery.createGallery(json.results);

            await gallery.mapButtons();

            document.querySelector("#loadingAnimationList").classList.add("hidden");
            document.querySelector('#movieList').classList.remove("hidden");
        })
        .catch(err => console.error(err));
}