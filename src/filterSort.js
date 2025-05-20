import { preferences } from "./preferences";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};


const url = new URL(window.location.href);
export const sortBy = url.searchParams.get(`sort_by`) == null ? `popularity.desc` : url.searchParams.get(`sort_by`);
export const genres = [];

const getGenres = () => {
    url.searchParams.forEach((value, param) => {
        if (value == `on`) {
            genres.push(param);
        }
    })

    console.log(genres);
}

export const mapFilterSort = () => {
    mapSort();

    getGenres();

    mapFilterGenres();
}

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

const mapFilterGenres = async () => {
    const allGenres = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${preferences.language}`, options).then(res => res.json()).then(json => json.genres).catch(err => console.error(err));
    console.log(allGenres);

    const genresDiv = document.getElementById(`genres`);

    for (const genre of allGenres) {
        genresDiv.innerHTML += `<div class="genre"><input type="checkbox" id="${genre.id}G" name="${genre.id}"><label for="${genre.id}G">${genre.name}</label></div>`;
    }

    for (const checkbox of document.querySelectorAll(`.genre input`)) {
        checkbox.checked = genres.includes(checkbox.name);
    }

}