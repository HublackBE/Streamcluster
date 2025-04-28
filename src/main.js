import './style.css'

const url = 'https://api.themoviedb.org/3/authentication';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
  }
};

const checkSuccess = json => {
    if (!json.success) {
        document.querySelector('#app').innerHTML += `<h1>Auth Error</h1><p>${JSON.stringify(json)}</p>`;
    } else {
        document.querySelector('#app').innerHTML += `<h1>Auth Success</h1>`;
    }
}

fetch(url, options)
  .then(res => res.json())
  .then(json => checkSuccess(json))
  .catch(err => console.error(err));

document.querySelector('#app').innerHTML = `
`
