const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

const search = () => {
    const searchInput = document.querySelector('#search');
    const searchQuery = encodeURI(searchInput.value)

    fetch(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1&region=be`, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
}

const searchButton = document.querySelector('#searchButton');

searchButton.addEventListener('click', search);