'use strict';

const contentList = document.querySelector('#content-list'),
  top250 = document.querySelector('#top-250');


const movies1 = async (id) => {
  const movies = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=4ec0b2b9`);
  const resp = await movies.json();
};

const fetchMovies = async () => {
  const movies = await fetch('js/top250.json');
  const resp = await movies.json();
  const top250 = await resp.items;


  for await (const id of top250) {
    const fetchMoviesInfo = await fetch(`http://www.omdbapi.com/?i=${id.id}&apikey=4ec0b2b9`);
    const respInfo = await fetchMoviesInfo.json();
    
    const name = respInfo.Title,
      genre = respInfo.Genre,
      rating = respInfo.imdbRating,
      poster = respInfo.Poster,
      year = respInfo.Year;

      createMoviePrev(name, genre, rating, poster, year);

  }



};


fetchMovies();


const createMoviePrev = (name, genre, rating, poster, year) => {
  const newMovie = document.createElement('div');
  newMovie.className = 'movie__prev';
  newMovie.innerHTML = `
  <div class="movie__prev">
    <div class="movie__rating">${rating}</div>
    <div class="movie__poster">
      <img src=${poster} alt="movie-poster" class="movie__poster-img">
      <div class="movie__descr">
        <p class="movie__director">Tada</p>
        <p class="movie__crew">Tada</p>
        <div class="movie__year">${year}</div>
      </div>
    </div>
    <p class="movie__name">${name}</p>
    <p class="movie__genre">${genre}</p>
  </div>
  `;

  contentList.append(newMovie)
};

// {
//   "Title": "The Shawshank Redemption",
//   "Year": "1994",
//   "Rated": "R",
//   "Released": "14 Oct 1994",
//   "Runtime": "142 min",
//   "Genre": "Drama",
//   "Director": "Frank Darabont",
//   "Writer": "Stephen King (short story \"Rita Hayworth and Shawshank Redemption\"), Frank Darabont (screenplay)",
//   "Actors": "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler",
//   "Plot": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
//   "Language": "English",
//   "Country": "USA",
//   "Awards": "Nominated for 7 Oscars. Another 21 wins & 36 nominations.",
//   "Poster": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
//   "Ratings": [
//       {
//           "Source": "Internet Movie Database",
//           "Value": "9.3/10"
//       },
//       {
//           "Source": "Rotten Tomatoes",
//           "Value": "91%"
//       },
//       {
//           "Source": "Metacritic",
//           "Value": "80/100"
//       }
//   ],
//   "Metascore": "80",
//   "imdbRating": "9.3",
//   "imdbVotes": "2,381,013",
//   "imdbID": "tt0111161",
//   "Type": "movie",
//   "DVD": "15 Aug 2008",
//   "BoxOffice": "$28,699,976",
//   "Production": "Columbia Pictures, Castle Rock Entertainment",
//   "Website": "N/A",
//   "Response": "True"
// }