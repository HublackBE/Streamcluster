import './style.css'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};

const loadPopular = page => {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&region=BE';

  fetch(url, options)
    .then(res => res.json())
    .then(json => {
      document.querySelector('#app').innerHTML = `
      <div class='movieDescription hidden'><div class='exitX'>X</div><p class="description"></p></div>
      <div id="movieList"></div>
      `;
      document.querySelector('.exitX').addEventListener('click', closeDetails)

      const movieList = document.querySelector("#movieList");
      for (const movie of json.results) {
        console.log(movie);
        movieList.innerHTML += `<div class='movie' id='${movie.id}'><img src='https://image.tmdb.org/t/p/w500${movie.poster_path}'><button class='watchButtonNetflix' type='Button'>Netflix</button></div>`
      }
      for (const movie of document.querySelectorAll(".movie")) {
        movie.addEventListener('click', () => {
          showDetails(movie.id);
        })
      }
    })
    .catch(err => console.error(err));

}

const showDetails = async (id) => {
  const movieDescriptionDiv = document.querySelector(".movieDescription");
  document.querySelector(".description").innerHTML = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options).then(res => res.json()).then(json => json.overview);
  movieDescriptionDiv.classList.remove("hidden");
}

const closeDetails = () => {
  document.querySelector(".movieDescription").classList.add("hidden");
}

const checkSuccess = json => {
  if (!json.success) {
    document.querySelector('#app').innerHTML += `<h1>Auth Error</h1><p>${JSON.stringify(json)}</p>`;
  } else {
    document.querySelector('#app').innerHTML += `<h1>Auth Success</h1>`;
    loadPopular(1);
  }
}

const url = 'https://api.themoviedb.org/3/authentication';
fetch(url, options)
  .then(res => res.json())
  .then(json => checkSuccess(json))
  .catch(err => console.error(err));