[![Streamcluster](assets/Streamcluster-logo.png)](https://github.com/HublackBE/Streamcluster)
- [Overview](#overview)
- [Prerequisites](#prerequisites)
  - [Node.js](#nodejs)
  - [TMDb API key](#tmdb-api-key)
  - [Streaming Availability API key](#streaming-availability-api-key)
- [Installation](#installation)
  - [1. Clone the repo](#1-clone-the-repo)
  - [2. Install the dependencies](#2-install-the-dependencies)
  - [3. Put your API keys in the .env](#3-put-your-api-keys-in-the-env)
  - [4. Build the project](#4-build-the-project)
  - [5. Run the project](#5-run-the-project)
- [Technical Requirements](#technical-requirements)
  - [1. DOM Manipulation](#1-dom-manipulation-dom-manipulatie)
  - [2. Modern JavaScript](#2-modern-javascript)
  - [3. Data & API](#3-data--api)
  - [4. Storage & Validation](#4-storage--validation)
  - [5. Styling & Layout](#5-styling--layout)
  - [6. Tooling & Structure](#6-tooling--structure)


# Overview
Streamcluster is a modern web application developed for my 'Web Advanced' course. It enables users to discover movies available on their selected streaming platforms, manage personal preferences, and curate a list of favorites. The project leverages the TMDb and Streaming Availability APIs, features dynamic filtering and pagination, and is built with modular JavaScript using Vite for fast development and optimized builds.


# Prerequisites

### [Node.js](https://nodejs.org/)
The latest version of [Node.js](https://nodejs.org/).

### [TMDb API key](https://www.themoviedb.org/settings/api)
A valid [TMDb API key](https://www.themoviedb.org/settings/api).

### [Streaming Availability API key](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability)
A valid [Streaming Availability API key](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability) from [RapidAPI](https://rapidapi.com/).


# Installation

### 1. Clone the repo
Clone the repo using your preferred method.

### 2. Install the dependencies
Use `npm install` to install all the required dependencies

### 3. Put your API keys in the .env
```js
VITE_API_KEY=your-tmdb-api-key-here
VITE_RAPID_API_KEY=your-streaming-availability-api-key-here
```

### 4. Build the project
Use `npm run build` to build the project.

### 5. Run the project
Use `npm run preview` to host a local server running the build.

--- 

# Technical Requirements

## 1. DOM Manipulation (DOM manipulatie)

1. **Selecting Elements:** 
    - Used throughout, e.g.: `document.querySelector('#app')` [[main.js:18]](/src/main.js#L18)
2. **Manipulating Elements:**
    - Setting innerHTML, e.g.: `pageNumbers.innerHTML += ...` [[pagination.js:11]](/src/pagination.js#L11)
    - Adding/Removing classes, e.g.: `button.classList.add('favorited')` [[favorite.js:17]](/src/favorite.js#L17)
    - Enabling/Disabling buttons, e.g.: `currentPageButton.disabled = true` [[pagination.js:41]](/src/pagination.js#L41)
3. **Attaching events to Elements:**
    - adddEventListener used throughout the code e.g.: `document.querySelector('#preferencesButton').addEventListener('click', () => {...})` [[preferences.js:31]](/src/preferences.js#L31)

## 2. Modern JavaScript

1. **Use of constants**  
   - `const` is used throughout the code, e.g.: `const options = ...` [[main.js:6]](/src/main.js#L6)
2. **Template literals:**  
   - Backtick strings for dynamic HTML, e.g.: `pageNumbers.innerHTML += '<li><button ...>${i}</button></li>'` [[pagination.js:11]](/src/pagination.js#L11)
3. **Iterating over arrays:**  
   - Use of `for...of`, e.g.: `for (const movie of movies) {...}` [[gallery.js:14]](/src/gallery.js#L14)
   - Use of `forEach`, e.g.: `entries.forEach(async entry => {...})` [[lazyLoading.js:8]](/src/lazyLoading.js#L8)
4. **Array methods:**
   - Use of `.includes`, e.g.: `preferences.streamingPlatforms.includes(input.name)` [[preferences.js:25]](/src/preferences.js#L25)
   - Use of `.push`, e.g.: `favorites.favorites.push(id)` [[favorite.js:31]](/src/favorite.js#L31)
   - Use of `.splice`, e.g.: `favorites.favorites.splice(favorites.favorites.indexOf(id), 1)` [[favorite.js:34]](/src/favorite.js#L34)
5. **Arrow functions:**  
   - Used throughout, e.g.: `const search = () => { ... }` [[search.js:9]](/src/search.js#L9)
6. **Conditional (ternary) operator:**  
   - Used for concise if/else, e.g.: `const total_pages = json.total_pages > 500 ? 500 : json.total_pages;` [[pagination.js:7]](/src/pagination.js#L7)
7. **Callback functions:**  
   - Used in `.then()` and event listeners, e.g.: `.then(json => checkSuccess(json))` [[main.js:41]](/src/main.js#L41)
   - Used in Intersection Observer `IntersectionObserver(callback, { ... })` [[lazyLoading.js:18]](/src/lazyLoading.js#L18)
8. **Promises:**  
   - Fetch API returns promises, e.g.: `return fetch(url, options)` [[gallery.js:92]](/src/gallery.js#L92)
   - Use of `Promise.resolve()`, e.g.: `Promise.resolve(cache.results[region].flatrate)` [[gallery.js:85]](/src/gallery.js#l85)
9. **Async & Await:**  
   - Async used for asynchronous functions, e.g.: `const loadCreate = async (json) => { ... }` [[load.js:24]](/src/load.js#L24)
   - Await, e.g.: `await getProviders(entry.target.id)` [[lazyLoading.js:11]](/src/lazyLoading.js#L11)
10. **Observer API:**  
    - Intersection Observer for lazy loading (of watch providers), e.g.: `export const observer = new IntersectionObserver(callback, { ... })` [[lazyLoading.js:18-22]](/src/lazyLoading.js#L18-L22)

## 3. Data & API

1. **Fetch to retrieve data:**  
   - Used throughout, e.g.: `fetch(url, options)` [[load.js:16]](/src/load.js#L16)
2. **Manipulate and display JSON:**
   - Parsing and using JSON data, e.g.: `await gallery.createGallery(json.results)` [[load.js:27]](/src/load.js#L27)
   - Displayed using the function `createGallery(movies)` [[gallery.js:12-35]](/src/gallery.js#L12-L35)

## 4. Storage & Validation

1. **Form validation:**  
    - Validate correct API key before loading rest of website: `checkSuccess(json)` [[main.js:16-36]](/src/main.js#L16-L36)
    - Search Query encoded to valid format for URL-parameter: `encodeURI(searchInput.value)` [[search.js:11]](/src/search.js#L11)
    - Validate presence of Preferences in localStorage, if none found returns default preferences [[preferences.js:1]](/src/preferences.js#L1)
2. **Use of LocalStorage:**
   - Used for storing preferences and favorites, e.g.: Storing preferences `localStorage.setItem('preferences', ...)` [[preferences.js:54]](/src/preferences.js#L54)
   - Used for retrieving preferences and favorites, e.g.: Retrieving favorites `localStorage.getItem(`Favorites`) == null ? { favorites: [], cache: [] } : JSON.parse(localStorage.getItem('Favorites'))` [[load.js:69]](/src/load.js#L69)

## 5. Styling & Layout

1. **Basic HTML layout (flexbox or CSS grid):**
   - Layout is handled in HTML/CSS, referenced via `import './style.css';` [[main.js:1]](/src/main.js#L1)
   - Most of the layout is made using flexbox, e.g.: Movie Gallery [[style.css:623]](/src/style.css#L623)
2. **Basic CSS:**  
   - Styles are imported in all main files, e.g.: `import './style.css';` [[main.js:1]](/src/main.js#L1)
3. **User-friendly elements (delete buttons, icons, ...):**  
   - E.g.: Favorite button `<button class='favorite' ...></button>` [[gallery.js:18]](/src/gallery.js#L18)
   - E.g.: Icon for preferences button `<img src="/gear-wide-connected.svg" alt="Gear">` [[index.html:26]](/index.html#L26)

## 6. Tooling & Structure

1. **Project is set up with Vite:**
    - Steps to build Vite project included in [#Installation](#installation)
   - Use of `import.meta.env.VITE_API_KEY` for API keys in .env throughout code, e.g.: `Authorization: 'Bearer ' + import.meta.env.VITE_API_KEY` [[main.js:10]](/src/main.js#L10)
2. **Correct folder structure:**  
   - Files are organized in [`src/`](/src/)
   - images and SVGs are organized in [`public/`](/public/)
   - CSS is imported
   - multiple pages are correctly setup in [[vite.config.js:16-20]](/vite.config.js#L16-L20)
   - Vite conventions are followed.

---

# Sources
- GitHub Copilot was used to assist with code comments and to help write and structure the ["Overview"](#overview) and ["Technical Requirements"](#technical-requirements) sections of this README.

- Source: https://www.w3schools.com/jsref/met_loc_reload.asp (used in `location.reload()` [[preferences.js:57]](/src/preferences.js#L57))

- Source: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (used in `callback function` [[lazyLoading.js:7]](/src/lazyLoading.js#L7))

- Source: https://www.slingacademy.com/article/implement-caching-strategies-with-javascript-fetch/ (used in `const cache = localStorage.getItem(id) ...` [[gallery.js:54]](/src/gallery.js#L54))

- Source: https://copy-paste-css.com/ (used in
   - `header .navTab` [[style.css:84]](/src/style.css#L84)
   - `footer button` [[style.css:285]](/src/style.css#L285)
   - `#filterButton` [[style.css:482]](/src/style.css#L482)
   - `#searchButton` [[style.css:156]](/src/style.css#L156)
   - `header #search` [[style.css:132]](/src/style.css#L132)
   - `.details` [[style.css:700]](/src/style.css#L700))
   - Watch Buttons (e.g.: `.watchButtonNetflix`) [[style.css:758-962]](/src/style.css#L758-L962)

- Source: https://www.sitelint.com/blog/how-to-implement-multiple-selection-with-check-boxes-in-an-html-without-external-libraries (used in `#app dialog form details` [[style.css:414]](/src/style.css#L414))

- Source: https://css-loaders.com/spinner/ (used in `.loader` [[style.css:837]](/src/style.css#L837))

- Source: https://css-loaders.com/classic/ (used in `.loaderText` [[style.css:868]](/src/style.css#L868))