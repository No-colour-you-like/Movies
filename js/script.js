'use strict';

const contentList = document.querySelector('#content-list'),
  contentTitle = document.querySelector('#content-title'),
  cinemaBtn = document.querySelector('#cinema-btn'),
  soonBtn = document.querySelector('#soon-btn'),
  popularBtn = document.querySelector('#popular-btn'),
  top250MoviesBtn = document.querySelector('#top-250-movies'),
  top250TvBtn = document.querySelector('#top-250-tv'),
  loadingModal = document.querySelector('#loading-modal'),
  movieFIlterBtn = document.querySelector('#movie-filter-btn'),
  contentSort = document.querySelector('#content-sort'),
  allNavigationBtns = document.querySelectorAll('.menu__name'),
  searchInput = document.querySelector('#search-input'),
  searchInfoBlock = document.querySelector('#search-info-block'),
  searchResetBtn = document.querySelector('#search-reset-btn');

let moviesPrevs = [];
let movieSingleInfo;
let singleMovieCloseBtn;

const updateMoviePreviews = () => {
  moviesPrevs = document.querySelectorAll('.movie__prev');
};

const updateMovieSingle = () => {
  movieSingleInfo = document.querySelector('#movie-single-info');
  singleMovieCloseBtn = movieSingleInfo.querySelector('#movie-single-close-btn');
};

//Fetch movies name from files
const fetchSoonMovies = async () => {
  const movies = await fetch('../js/soon.json');
  const resp = await movies.json();
  const soonMovies = await resp.items;

  await fetchMovieInfo(soonMovies);
};

const fetch250Movies = async () => {
  const movies = await fetch('../js/top250movies.json');
  const resp = await movies.json();
  const top250 = await resp.items;

  await fetchMovieInfo(top250);
};

const fetch250Tv = async () => {
  const movies = await fetch('../js/top250tv.json');
  const resp = await movies.json();
  const top250tv = await resp.items;

  await fetchMovieInfo(top250tv);
};

const fetchPopularMovies = async () => {
  const movies = await fetch('../js/popular.json');
  const resp = await movies.json();
  const popularMovies = await resp.items;

  await fetchMovieInfo(popularMovies);
};

const fetchCinemaMovies = async () => {
  const movies = await fetch('../js/cinema.json');
  const resp = await movies.json();
  const cinemaMovies = await resp.items;

  await fetchMovieInfo(cinemaMovies);
};


// ================== Movie previews ===========================

//Make movie pages and set max view movies (16)
let page = 0;
const prevsAmount = 16;

//Cut movielist to 16 movies and change page
const paginate = (items, pageNum) => {
  let start = pageNum * prevsAmount;
  const shortList = items.slice(start, start + prevsAmount);
  page++;
  return shortList;
};

//Fetch movie info, create preview in HTML, update load btn
const fetchMovieInfo = (moviesList) => {
  const fetchMovies = async (shortList) => {
    for await (const movie of shortList) {
      const fetchMoviesInfo = await fetch(`http://www.omdbapi.com/?i=${movie.id}&apikey=4ec0b2b9`);
      const respInfo = await fetchMoviesInfo.json();

      const id = movie.id,
        name = respInfo.Title,
        genre = respInfo.Genre,
        rating = respInfo.imdbRating,
        poster = respInfo.Poster,
        director = respInfo.Director,
        crew = respInfo.Actors,
        year = respInfo.Year,
        runtime = respInfo.Runtime;

      //Loading icon show when movies load
      await loadingModal.classList.add('loading-show');

      //Menu buttons disablet when moves load
      allNavigationBtns.forEach(btn =>
        btn.classList.add('disable-btn')
      );

      createMoviePrev(id, name, genre, rating, poster, director, crew, year, runtime);
    }

    await loadingModal.classList.remove('loading-show');

    for await (const btn of allNavigationBtns) {
      btn.classList.remove('disable-btn');
    }

    await updateMoviePreviews();

    moviesPrevs.forEach(movie => {
      const moviePoster = movie.querySelector('.movie__poster');
      const movieId = movie.dataset.id;

      moviePoster.addEventListener('click', () => {
        fetchSingleMovie(movieId);
      });
    });

    //Update load-movies button
    const loadPageBtn = document.querySelector('#load-page-btn');

    //Show or hide load-movies button
    if (shortList.length == prevsAmount) {
      loadPageBtn.classList.add('visibile-btn');
    } else {
      loadPageBtn.classList.remove('visibile-btn');
    }

    //Add click-event on load-button for load more movies
    loadPageBtn.onclick = () => fetchMovies(paginate(moviesList, page));
  };

  fetchMovies(paginate(moviesList, page));
};

//Create movie preview div
const createMoviePrev = (id, name, genre, rating, poster, director, crew, year, runtime) => {
  const newMovie = document.createElement('div');
  newMovie.className = 'movie__prev';
  newMovie.setAttribute('data-id', `${id}`);

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


//========================== Load movies lists =====================

//Clear movie list, change list title, and reset page
const clearListAndTilte = (titleText) => {
  page = 0;
  contentList.innerHTML = '';
  contentTitle.textContent = titleText;
};

//Load all movies on click
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


// ====================== Filter movies ======================

//Year filter slider 
$(".js-range-slider").ionRangeSlider({
  type: "double",
  min: 1900,
  max: 2021,
  from: 2000,
  to: 2021,
  grid: false
});

const movieYearFilterData = $(".js-range-slider").data("ionRangeSlider");

//Filter movies with settings
const filterMovies = () => {
  moviesPrevs = document.querySelectorAll('.movie__prev');

  moviesPrevs.forEach(movie => {
    const movieYear = +movie.querySelector('.movie__year').textContent.slice(0, 4);
    const movieGenre = movie.querySelector('.movie__genre').textContent.toLowerCase();
    const genreCheckbox = document.querySelectorAll('.genre-checkbox');
    let checkedCheckbox = [];

    const checkGenres = (checkedGenres, allGenres) => checkedGenres.every(genre => allGenres.includes(genre));

    const genresArr = movieGenre.split(", ");

    genreCheckbox.forEach(checkbox => {
      if (checkbox.checked) {
        checkedCheckbox.push(checkbox.value);
      }
    });

    movie.classList.remove('display-none');

    if (!(movieYear > movieYearFilterData.old_from && movieYear < movieYearFilterData.old_to && checkGenres(checkedCheckbox, genresArr))) {
      movie.classList.add('display-none');
    }
  });
};

movieFIlterBtn.addEventListener('click', () => filterMovies());


//===================== Make single movie in modal ============================

//Create single movie div
const createSingleMovie = (poster, title, release, dir, act, genre, plot, runtime, imdb, metacr, rt) => {
  const singleMovie = document.createElement('div');
  singleMovie.className = 'movie-single__all-info';
  singleMovie.setAttribute('id', 'movie-single-info');
  singleMovie.innerHTML = `
  <div class="movie-single-block">
    <div id="movie-single-close-btn" class="movie-single__close">
      <img src="img/close-btn.svg" alt="close-movie" class="movie-single__close-btn">
    </div>
    <div class="movie-single__poster">
      <img src=${poster} alt="poster" class="movie-single__poster-img">
    </div>
    <div class="movie-single__info">
      <h2 class="movie-single__title">${title}</h2>
      <div class="movie-single__main-info">
        <div class="single-info">
          <p class="single-info__title">Релиз</p>
          <p class="single-info__descr">${release}</p>
        </div>
        <div class="single-info">
          <p class="single-info__title">Режиссер</p>
          <p class="single-info__descr">${dir}</p>
        </div>
        <div class="single-info">
          <p class="single-info__title">Актеры</p>
          <p class="single-info__descr">${act}</p>
        </div>
        <div class="single-info">
          <p class="single-info__title">Жанр</p>
          <p class="single-info__descr">${genre}</p>
        </div>
        <div class="single-info">
          <p class="single-info__title">Сюжет</p>
          <p class="single-info__descr">${plot}</p>
        </div>
        <div class="single-info">
          <p class="single-info__title">Время</p>
          <p class="single-info__descr">${runtime}</p>
        </div>
      </div>
      <div class="movie-single__ratings">
        <div class="movie-single__rating">
          <div class="movie-single__rating-number">${imdb}</div>
          <div class="movie-single__rating-name">IMDb</div>
        </div>
        <div class="movie-single__rating">
          <div class="movie-single__rating-number">${metacr}</div>
          <div class="movie-single__rating-name">MetaCritic</div>
        </div>
        <div class="movie-single__rating">
          <div class="movie-single__rating-number">${rt}</div>
          <div class="movie-single__rating-name">Rotten Tomatoes</div>
        </div>
      </div>
    </div>
  </div>
  `;

  contentList.parentElement.append(singleMovie);
};

//Fetch single movie all info
const fetchSingleMovie = async (id) => {
  const fetchMoviesInfo = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=4ec0b2b9`);
  const respInfo = await fetchMoviesInfo.json();

  const name = respInfo.Title,
    release = respInfo.Released,
    dir = respInfo.Director,
    act = respInfo.Actors,
    genre = respInfo.Genre,
    plot = respInfo.Plot,
    runtime = respInfo.Runtime;

  let poster = respInfo.Poster,
    imdb = 'N/A',
    metacr = 'N/A',
    rt = 'N/A';

  respInfo.Ratings.forEach(rating => {
    switch (rating.Source) {
      case "Internet Movie Database":
        imdb = rating.Value;
        break;
      case "Metacritic":
        metacr = rating.Value;
        break;
      case "Rotten Tomatoes":
        rt = rating.Value;
        break;
    }
  });

  if (poster.toLowerCase() === 'n/a') {
    poster = 'img/empty-poster.jpg';
  }

  createSingleMovie(poster, name, release, dir, act, genre, plot, runtime, imdb, metacr, rt);
  updateMovieSingle();

  singleMovieCloseBtn.onclick = () => movieSingleInfo.remove();
};

//================== Sort movies ======================

//Sort movies by click select
contentSort.addEventListener('change', () => {
  updateMoviePreviews();

  const moviesPrevsArr = [...moviesPrevs];

  const sortMovies = (wayOne, wayTwo, type) => {
    moviesPrevsArr.sort((a, b) => {
      const returnSort = (itemA, itemB) => {
        if (itemA < itemB) {
          return wayOne;
        }

        if (itemA > itemB) {
          return wayTwo;
        }
      };

      switch (type) {
        case 'name':
          const nameA = a.querySelector('.movie__name').textContent.toLowerCase(),
            nameB = b.querySelector('.movie__name').textContent.toLowerCase();
          return returnSort(nameA, nameB);
        case 'year':
          const yearA = +a.querySelector('.movie__year').textContent,
            yearB = +b.querySelector('.movie__year').textContent;
          return returnSort(yearA, yearB);
        case 'imdb':
          const ratingA = a.querySelector('.movie__rating').textContent,
            ratingB = b.querySelector('.movie__rating').textContent;
          return returnSort(ratingA, ratingB);
        case 'runtime':
          const runtimeA = +a.querySelector('.movie__runtime').textContent.slice(0, -3),
            runtimeB = +b.querySelector('.movie__runtime').textContent.slice(0, -3);
          return returnSort(runtimeA, runtimeB);
      }
    });
  };

  switch (contentSort.value.toLowerCase()) {
    case 'a-z':
      sortMovies(-1, 1, 'name');
      break;
    case 'z-а':
      sortMovies(1, -1, 'name');
      break;
    case 'year-up':
      sortMovies(1, -1, 'year');
      break;
    case 'year-down':
      sortMovies(-1, 1, 'year');
      break;
    case 'imdb-up':
      sortMovies(1, -1, 'imdb');
      break;
    case 'imdb-down':
      sortMovies(-1, 1, 'imdb');
      break;
    case 'runtime-up':
      sortMovies(1, -1, 'runtime');
      break;
    case 'runtime-down':
      sortMovies(-1, 1, 'runtime');
      break;
  }

  contentList.innerHTML = '';

  moviesPrevsArr.forEach((prev, i) => {
    contentList.append(moviesPrevsArr[i]);
  });
});


//===================== Search ====================

//Search movie by input
searchInput.addEventListener('input', () => {
  const inputValue = searchInput.value;

  searchInfoBlock.innerHTML = '';
  fetchMovieSearch(inputValue);
});

//Reset search data from input
searchResetBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchInfoBlock.innerHTML = '';
});

//Fetch movie for search
const fetchMovieSearch = async (movieName) => {
  const fetchMoviesInfo = await fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=4ec0b2b9`);
  const respInfo = await fetchMoviesInfo.json();

  const id = respInfo.imdbID,
    name = respInfo.Title,
    year = respInfo.Year,
    dir = respInfo.Director,
    genre = respInfo.Genre;

  let poster = respInfo.Poster;

  if (poster === 'N/A') {
    poster = 'img/empty-poster.jpg';
  }

  if (name !== undefined) {
    createFoundMovie(id, poster, name, dir, genre, year);
  }

  const foundMovie = document.querySelectorAll('.found-movie');

  foundMovie.forEach(movie => {
    movie.onclick = () => {
      fetchSingleMovie(movie.dataset.id);
    };
  });
};

//Create found movie html
const createFoundMovie = (id, poster, name, dir, genre, year) => {
  const foundMovie = document.createElement('div');
  foundMovie.className = 'found-movie';
  foundMovie.setAttribute('id', 'found-movie');
  foundMovie.setAttribute('data-id', `${id}`);
  foundMovie.innerHTML = `
    <div class="found-movie__poster">
      <img src=${poster} alt="found-poster" class="found-movie__poster-img">
    </div>
    <div class="found-movie__info">
      <p class="found-movie__name">${name}</p>
      <p class="found-movie__dir">Режиссер: ${dir}</p>
      <p class="found-movie__genre">Жанр: ${genre}</p>
      <p class="found-movie__genre">Год: ${year}</p>
    </div>
  `;

  searchInfoBlock.append(foundMovie);
};