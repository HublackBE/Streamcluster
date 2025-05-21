# Streamcluster
[Overview](#overview)
<br>
[Prerequisites](#prerequisites)
<br>
[Installation](#installation)
## Overview
Streamcluster is a project for my course 'Web Advanced' that allows you to see movies available on your streaming platforms and favorite them.
## Prerequisites
### [Node.js](https://nodejs.org/)
The latest version of [Node.js](https://nodejs.org/).
### [TMDb API key](https://www.themoviedb.org/settings/api)
A valid [TMDb API key](https://www.themoviedb.org/settings/api).
### [Streaming Availability API key](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability)
A valid [Streaming Availability API key](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability) from [RapidAPI](https://rapidapi.com/).
## Installation
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
<br>
Use `npm run preview` to host a local server running the build.