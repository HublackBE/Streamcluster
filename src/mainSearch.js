import './style.css';
import { loadSearch } from './load';
import { closeDetails } from './gallery';
import { createPagination } from './pagination.js';

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
  };

const urlParameters = new URLSearchParams(window.location.search);
const searchQuery = urlParameters.get('query');

const checkSuccess = async json => {
  if (!json.success) {
    document.querySelector('#app').innerHTML += `<h1>Auth Error</h1><p>${JSON.stringify(json)}</p>`;
  } else {
    document.querySelector('#app').innerHTML += `<div class='movieDescription hidden'><div class='exitX'>X</div><div id="loadingAnimationDescription" class="loadingAnimation"><div class="loader"></div><div class="loaderText"></div></div><p class="description"></p></div>
        <div id="loadingAnimationList" class="loadingAnimation">
        <div class="loader"></div>
        <div class="loaderText"></div>
        </div>
        <div id="movieList" class='hidden'></div>`;
    document.querySelector('.exitX').addEventListener('click', closeDetails)

    loadSearch(urlParameters.get(`page`), searchQuery);

    createPagination(json);
  }
}

const url = 'https://api.themoviedb.org/3/authentication';
fetch(url, options)
  .then(res => res.json())
  .then(json => checkSuccess(json))
  .catch(err => console.error(err));