import * as gallery from './gallery.js';
import { observer } from './lazyLoading.js';
import { createPagination } from './pagination.js';
import { preferences } from './preferences.js';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

const load = url => {
    fetch(url, options)
        .then(res => res.json())
        .then(async json => {
            createPagination(json);

            await gallery.createGallery(json.results);

            for (const movie of document.querySelectorAll(`.movie`)) {
                observer.observe(movie);
            }

            document.querySelector("#loadingAnimationList").classList.add("hidden");
            document.querySelector('#movieList').classList.remove("hidden");
        })
        .catch(err => console.error(err));
}

export const loadDiscover = page => {
    let with_watch_providers = `with_watch_providers=`;
    for (const streamingPlatform of preferences.streamingPlatforms) {
        with_watch_providers += streamingPlatform + `|`;
    }
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=${preferences.language}&page=${page}&sort_by=popularity.desc&watch_region=${preferences.region}&${with_watch_providers}`;

    load(url);
}

export const loadPopular = page => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=${preferences.language}&page=${page}&region=${preferences.region}`;

    load(url);
}

export const loadSearch = (page, query) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=${preferences.language}&page=${page <= 0 ? 1 : page}&region=${preferences.region}`;

    load(url);
}