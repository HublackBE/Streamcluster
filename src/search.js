// This file is responsible for handling the search functionality of the website.


// Define the options for the fetch request, including method, headers, and authorization
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY
    }
};

// Function to perform a search using the input value and fetch movie data from the API
const search = () => {
    // Get the search input element
    const searchInput = document.querySelector('#search');
    // Encode the input value for use in a URL
    const searchQuery = encodeURI(searchInput.value);

    // Fetch movie data from the API using the search query and options
    fetch(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1&region=be`, options)
        .then(res => res.json()) // Parse the response as JSON
        .then(json => console.log(json)) // Log the JSON data to the console
        .catch(err => console.error(err)); // Log any errors to the console
}

// Get the search button element
const searchButton = document.querySelector('#searchButton');

// Add a click event listener to the search button to trigger the search function
searchButton.addEventListener('click', search);