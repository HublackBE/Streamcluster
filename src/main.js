import './style.css'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};

const getProviders = (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers`

  return fetch(url, options)
    .then(res => res.json())
    .then(json => {
      try {
        return json.results.BE.flatrate;
      } catch (error) {
        return [];
      }
    })
    .catch(err => { console.error(err); return [] });
}

const createButtons = (id, providersList = []) => {
  const watchbuttonsDiv = document.getElementById(id).querySelector('.watchButtons');

  if (providersList.length == 0) {
    watchbuttonsDiv.innerHTML += `<h3>Unavailable</h3>`
    return;
  } else {
    for (let provider of providersList) {
      switch (provider.provider_id) {
        // Disney+
        case 337:
          watchbuttonsDiv.innerHTML += `<button class='watchButtonDisney' type='Button' value='${id}'><img src='/Disney.png' alt='Disney+'></img></button>`;
          break;
        // Netflix
        case 8:
          watchbuttonsDiv.innerHTML += `<button class='watchButtonNetflix' type='Button' value='${id}'><img src="/Netflix.svg" alt="Netflix"></img></button>`;
          break;
        // Amazon Prime Video
        case 119:
          watchbuttonsDiv.innerHTML += `<button class='watchButtonPrimeVideo' type='Button' value='${id}'><img src='/PrimeVideo.svg' alt='Prime Video'></img></button>`;
          break;
      }
    }
  }
}

const createGallery = async (movies) => {
  const movieList = document.querySelector("#movieList");
  for (const movie of movies) {
    movieList.innerHTML += `
        <div class='movie' id="${movie.id}">
        <div class="watchButtons">
        <h2>Available on</h2>
        <hr>
        </div>
        <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}'>
        </div>
        `;
    createButtons(movie.id, await getProviders(movie.id));
  }
}

const loadPopular = page => {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&region=BE';

  fetch(url, options)
    .then(res => res.json())
    .then(async json => {
      document.querySelector('#app').innerHTML = `
      <div class='movieDescription hidden'><div class='exitX'>X</div><p class="description"></p></div>
      <div id="movieList"></div>
      `;
      document.querySelector('.exitX').addEventListener('click', closeDetails)

      await createGallery(json.results, createButtons);

      await mapButtons();
    })
    .catch(err => console.error(err));
}

const mapButtons = () => {
  const buttonsMap = new Map([
    [".watchButtonNetflix", "netflix"],
    [".watchButtonPrimeVideo", "prime"],
    [".watchButtonDisney", "disney"]
  ])

  for (const [buttonRef, streamingID] of buttonsMap) {
    for (const streamingButton of document.querySelectorAll(buttonRef)) {
      streamingButton.addEventListener('click', () => {
        goToStreaming(streamingButton.value, streamingID);
      })
    }
  }
}

const goToStreaming = async (id, streamingPlatform) => {
  const RapidAPIURL = `https://streaming-availability.p.rapidapi.com/shows/movie/${id}`

  fetch(RapidAPIURL, { method: 'GET', headers: { 'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY, 'x-rapidapi-host': 'streaming-availability.p.rapidapi.com' } })
    .then((res) => res.json())
    .then((returnJSON => { return returnJSON.streamingOptions.be }))
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