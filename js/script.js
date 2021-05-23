'use strict';

const contentList = document.querySelector('#content-list'),
  contentTitle = document.querySelector('#content-title'),
  popularBtn = document.querySelector('#popular-btn'),
  top250Btn = document.querySelector('#top-250');


const fetch250Movies = async () => {
  const movies = await fetch('js/top250.json');
  const resp = await movies.json();
  const top250 = await resp.items;

  await fetchMovieInfo(top250);
};


const fetchPopularMovies = async () => {
  const movies = await fetch('js/popular.json');
  const resp = await movies.json();
  const popularMovies = await resp.items;

  fetchMovieInfo(popularMovies);
};



const fetchMovieInfo = async (moviesList) => {
  for await (const id of moviesList) {
    const fetchMoviesInfo = await fetch(`http://www.omdbapi.com/?i=${id.id}&apikey=4ec0b2b9`);
    const respInfo = await fetchMoviesInfo.json();

    const name = respInfo.Title,
      genre = respInfo.Genre,
      rating = respInfo.imdbRating,
      poster = respInfo.Poster,
      director = respInfo.Director,
      crew = respInfo.Actors,
      year = respInfo.Year,
      runtime = respInfo.Runtime;

    createMoviePrev(name, genre, rating, poster, director, crew, year, runtime);
  }
};

const createMoviePrev = (name, genre, rating, poster, director, crew, year, runtime) => {
  const newMovie = document.createElement('div');
  newMovie.className = 'movie__prev';

  if (poster.toLowerCase() == 'n/a') {
    poster = 'img/empty-poster.jpg';
  };

  newMovie.innerHTML = `
  <div class="movie__prev">
    <div class="movie__rating">${rating}</div>
    <div class="movie__poster">
      <img src=${poster} alt="movie-poster" class="movie__poster-img">
      <div class="movie__descr">
        <p class="movie__director">${director}</p>
        <p class="movie__crew">${crew}</p>
        <div class="movie__year">${year}</div>
        <p class="movie__runtime">${runtime}</p>
      </div>
    </div>
    <p class="movie__name">${name}</p>
    <p class="movie__genre">${genre}</p>
  </div>
  `;

  contentList.append(newMovie)
};


top250Btn.addEventListener('click', () => {
  contentList.innerHTML = '';
  contentTitle.textContent = 'Топ 250 IMDb'
  fetch250Movies();
});

popularBtn.addEventListener('click', () => {
  contentList.innerHTML = '';
  contentTitle.textContent = 'Популярные';
  fetchPopularMovies();
});