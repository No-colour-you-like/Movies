'use strict';

const contentList = document.querySelector('#content-list'),
  contentTitle = document.querySelector('#content-title'),
  cinemaBtn = document.querySelector('#cinema-btn'),
  soonBtn = document.querySelector('#soon-btn'),
  popularBtn = document.querySelector('#popular-btn'),
  top250MoviesBtn = document.querySelector('#top-250-movies'),
  top250TvBtn = document.querySelector('#top-250-tv'),
  loadingModal = document.querySelector('#loading-modal'),
  movieFIlterBtn = document.querySelector('#movie-filter-btn');

const allNavigationBtns = document.querySelectorAll('.menu__name');


const fetchSoonMovies = async () => {
  const movies = await fetch('js/soon.json');
  const resp = await movies.json();
  const soonMovies = await resp.items;

  await fetchMovieInfo(soonMovies);
};

const fetch250Movies = async () => {
  const movies = await fetch('js/top250movies.json');
  const resp = await movies.json();
  const top250 = await resp.items;

  await fetchMovieInfo(top250);
};

const fetch250Tv = async () => {
  const movies = await fetch('js/top250tv.json');
  const resp = await movies.json();
  const top250tv = await resp.items;

  await fetchMovieInfo(top250tv);
};


const fetchPopularMovies = async () => {
  const movies = await fetch('js/popular.json');
  const resp = await movies.json();
  const popularMovies = await resp.items;

  await fetchMovieInfo(popularMovies);
};

const fetchCinemaMovies = async () => {
  const movies = await fetch('js/cinema.json');
  const resp = await movies.json();
  const cinemaMovies = await resp.items;

  await fetchMovieInfo(cinemaMovies);
};

const controller = new AbortController();
const signal = controller.signal;

const fetchMovieInfo = async (moviesList) => {
  for await (const movie of moviesList) {
    const fetchMoviesInfo = await fetch(`http://www.omdbapi.com/?i=${movie.id}&apikey=4ec0b2b9`);
    const respInfo = await fetchMoviesInfo.json();

    const name = respInfo.Title,
      genre = respInfo.Genre,
      rating = respInfo.imdbRating,
      poster = respInfo.Poster,
      director = respInfo.Director,
      crew = respInfo.Actors,
      year = respInfo.Year,
      runtime = respInfo.Runtime;

    await loadingModal.classList.add('loading-show');

    allNavigationBtns.forEach(btn =>
      btn.classList.add('disable-btn')
    );

    createMoviePrev(name, genre, rating, poster, director, crew, year, runtime);
  }

  await loadingModal.classList.remove('loading-show');
  for await (const btn of allNavigationBtns) {
    btn.classList.remove('disable-btn');
  }


};

const createMoviePrev = (name, genre, rating, poster, director, crew, year, runtime) => {
  const newMovie = document.createElement('div');
  newMovie.className = 'movie__prev';

  if (poster.toLowerCase() == 'n/a') {
    poster = 'img/empty-poster.jpg';
  }

  if (director.toLowerCase() == 'n/a') {
    director = '';
  }

  newMovie.innerHTML = `
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
  `;

  contentList.append(newMovie);
};


const clearListAndTilte = (titleText) => {
  contentList.innerHTML = '';
  contentTitle.textContent = titleText;
};

top250MoviesBtn.addEventListener('click', () => {
  clearListAndTilte('Топ 250 IMDb');
  fetch250Movies();
});

popularBtn.addEventListener('click', () => {
  clearListAndTilte('Популярные');
  fetchPopularMovies();
});

top250TvBtn.addEventListener('click', () => {
  clearListAndTilte('Топ 250 TV IMDb');
  fetch250Tv();
});

cinemaBtn.addEventListener('click', () => {
  clearListAndTilte('В прокате');
  fetchCinemaMovies();
});

soonBtn.addEventListener('click', () => {
  clearListAndTilte('Скоро в прокате');
  fetchSoonMovies();
});

//Year filter slider 
$(".js-range-slider").ionRangeSlider({
  type: "double",
  min: 1900,
  max: 2021,
  from: 1950,
  to: 1960,
  grid: false
});

const movieYearFilterData = $(".js-range-slider").data("ionRangeSlider");


const filterMovies = () => {
  const movies = document.querySelectorAll('.movie__prev');

  movies.forEach(movie => {
    const movieYear = +movie.querySelector('.movie__year').textContent.slice(0, 4);
    movie.classList.remove('display-none');
    
    if (!(movieYear > movieYearFilterData.old_from && movieYear < movieYearFilterData.old_to)) {
      movie.classList.add('display-none');
    }
  });

};


movieFIlterBtn.addEventListener('click', () => {
  filterMovies();
});