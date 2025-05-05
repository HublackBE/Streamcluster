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
        movieList.innerHTML += `
        <div class='movie' id='${movie.id}'>
        <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
        <div class="watchButtons">
        <button class='watchButtonNetflix' type='Button' value='${movie.id}'><img src="/Netflix.svg" alt="Netflix"></img></button>
        <button class='watchButtonPrimeVideo' type='Button' value='${movie.id}'><img src='/PrimeVideo.svg' alt='Prime Video'></img></button>
        <button class='watchButtonDisney' type='Button' value='${movie.id}'><img src='/Disney.png' alt='Disney+'></img></button>
        </div></div>`
        // TODO: make buttons only appear when available on said streaming platform
      }

      for (const movie of document.querySelectorAll(".movie")) {
        movie.addEventListener('click', () => {
          showDetails(movie.id);
        })
      }

      for (const NetflixButton of document.querySelectorAll(".watchButtonNetflix")) {
        NetflixButton.addEventListener('click', () => {
          goToStreaming(NetflixButton.value, 'netflix');
          console.log('Clicked!');
        })
      }

      for (const PrimeVideoButton of document.querySelectorAll(".watchButtonPrimeVideo")) {
        PrimeVideoButton.addEventListener('click', () => {
          goToStreaming(PrimeVideoButton.value, 'prime');
          console.log('Clicked!');
        })
      }

      for (const DisneyButton of document.querySelectorAll(".watchButtonDisney")) {
        DisneyButton.addEventListener('click', () => {
          goToStreaming(DisneyButton.value, 'disney');
          console.log('Clicked!');
        })
      }
    })
    .catch(err => console.error(err));
}

const goToStreaming = async (id, streamingPlatform) => {
  const RapidAPIURL = `https://streaming-availability.p.rapidapi.com/shows/movie/${id}`

  fetch(RapidAPIURL, {method: 'GET', headers: { 'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'}})
    .then((res) => res.json())
    .then((returnJSON => {console.log(returnJSON); return returnJSON.streamingOptions.be}))
    .then((platformsBE => {
      console.log(platformsBE)
      for (let platform of platformsBE) {
        if (platform.service.id == streamingPlatform && platform.type == "subscription") {
          window.open(platform.videoLink);
        }
      }
    }))
    .catch(err => console.error(err))
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