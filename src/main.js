// let img = document.createElement("img");
// img.src = new URL("assets/star-icon.svg", import.meta.url);
// document.body.appendChild(img);

//------- Serge part -------
let searchInput = "";
let movieGenres = [];
const searchURL = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&`;
const genreURL = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
const detailsURL = `https://www.themoviedb.org/movie/`;
("page=1&query=");

const searchInputEl = document.getElementById("search");
const searchFormEl = document.getElementById("search-form");
const cardsContainerEl = document.getElementById("search-results");
const popularMoviesEl = document.getElementById("cards-container");
const dialogEl = document.getElementById("search-dialog");

searchInputEl.addEventListener("input", ProcessSearch);
searchFormEl.addEventListener("submit", SubmitSearch);

document.onclick = (e) => {
  //Closing search results dialog if clicked outside of it

  if (!FindParentElement(dialogEl, e.target) && dialogEl.open) {
    dialogEl.close();
    if (
      location.pathname.substring(location.pathname.lastIndexOf("/") + 1) ==
      "journal.html"
    )
      location.reload();
  }
};

GetGenres(); //API call to get the genres from the server

// ----Adding and Removing from Favorites using LocalStorage
let favorites = [];
const favKey = "search-favorites";
window.addEventListener(
  "load",
  () => (favorites = JSON.parse(localStorage.getItem(favKey)) || [])
);

function AddToFavoritesStorage(movie) {
  if (favorites.includes(movie)) return;
  favorites.push(movie);
  localStorage.setItem(favKey, JSON.stringify(favorites));
}
function RemoveFromFavoritesStorage(movie) {
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].id == movie.id) {
      favorites.splice(i, 1);
      localStorage.setItem(favKey, JSON.stringify(favorites));
    }
  }
}
function IsFavorite(movie) {
  if (favorites.find((x) => x.id === movie.id)) return true;
  return false;
}
//--------------------------------------------------
function GetSearchResults(keyword, page) {
  const url = `${searchURL}query=${keyword}&page=${page}`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  })
    .then((res) => ProcessResponse(res))
    .then((json) => ProcessSearchResults(json))
    .catch((error) => console.error(error.message));
}

function GetGenres() {
  fetch(genreURL, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  })
    .then((res) => ProcessResponse(res))
    .then((json) => (movieGenres = json.genres))
    .catch((error) => console.error(error.message));
}

function ProcessResponse(res) {
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

//Find a parent element from child element
function FindParentElement(elementToFind, startingElement) {
  let currentElement = startingElement;
  if (currentElement == elementToFind) return true;
  while (currentElement.parentElement) {
    currentElement = currentElement.parentElement;
    if (currentElement == elementToFind) return true;
  }
  return false;
}

function ProcessSearch(event) {
  const highlighted = [
    "bg-[#3ae4de50]",
    "hover:cursor-pointer",
    "hover:bg-[#238a83]",
  ];
  const searchImg = document.getElementById("search-img-wrapper");

  searchInput = event.target.value;
  if (searchInput.length > 0) {
    searchImg.classList.add(...highlighted);
    searchImg.classList.remove("opacity-50");
    searchImg.onclick = () => GetSearchResults(searchInputEl.value, 1);
  } else {
    searchImg.classList.remove(...highlighted);
    searchImg.classList.add("opacity-50");
    searchImg.onclick = () => null;
  }
}

function SubmitSearch(event) {
  event.preventDefault();
  GetSearchResults(searchInputEl.value, 1);
}

function ProcessSearchResults(data) {
  const resultsPage = data.results;
  clearChildren(cardsContainerEl);

  dialogEl.show();
  const searchKeyEl = document.getElementById("search-keyword");
  const searchFoundEl = document.getElementById("search-found");
  const searchTotalPageEl = document.getElementById("search-total-pages");
  const prevBtn = document.getElementById("search-prev");
  const nextBtn = document.getElementById("search-next");
  const pagesEl = document.getElementById("search-pages");
  clearChildren(pagesEl);

  if (data.total_results > 0) {
    searchKeyEl.innerText = `Search results for: "${searchInput}"`;
    searchFoundEl.innerText = "Total results: " + data.total_results;
    const pageMax = 3;

    if (data.total_pages > 1) {
      //pagination buttons logic
      let pageStart = data.page;
      if (data.page > 1) {
        pageStart = data.page - pageMax;
        if (pageStart <= 1) pageStart = 1;
      }
      let pageEnd = data.page + pageMax;
      if (pageEnd >= data.total_pages) pageEnd = data.total_pages;

      for (let i = pageStart; i <= pageEnd; i++) {
        processPages(i);
      }
      searchTotalPageEl.innerText = "Pages: " + data.total_pages;
    } else searchTotalPageEl.innerText = "";

    if (data.total_pages > 1 && data.page < data.total_pages) {
      nextBtn.classList.remove("hidden");
      nextBtn.onclick = () =>
        GetSearchResults(searchInputEl.value, data.page + 1);
    } else nextBtn.classList.add("hidden");

    if (data.page === 1) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
      prevBtn.onclick = () =>
        GetSearchResults(searchInputEl.value, data.page - 1);
    }

    for (let i = 0; i < resultsPage.length; i++) {
      ShowSearchResultCardUI(resultsPage[i]);
    }
  } else {
    //Nothing found
    searchKeyEl.innerText = `Search results for: "${searchInput}"`;
    searchFoundEl.innerText = "Nothing found";
    searchTotalPageEl.innerText = "";
    nextBtn.classList.add("hidden");
    prevBtn.classList.add("hidden");
  }

  function processPages(pageNum) {
    const pageBtn = document.createElement("Button");
    pageBtn.className =
      "bg-[#00b9ae] hover:bg-[#8ffdf6] mx-1 h-full px-2 py-1h-fit font-extrabold text-1xl text-[#21242d] rounded";
    pageBtn.onclick = () => GetSearchResults(searchInputEl.value, pageNum);
    pageBtn.textContent = pageNum;
    if (data.page === pageNum) {
      pageBtn.classList.remove("bg-[#00b9ae]");
      pageBtn.classList.add("bg-amber-300");
    }
    pagesEl.appendChild(pageBtn);
  }
}

function clearChildren(element) {
  while (element.lastElementChild)
    element.removeChild(element.lastElementChild);
}

function ShowSearchResultCardUI(movie) {
  const favIconSelected = new URL(
    "assets/heart-icon-selected.svg",
    import.meta.url
  );
  const favIcon = new URL("assets/heart-icon.svg", import.meta.url);
  const starIcon = new URL("assets/star-icon.svg", import.meta.url);
  const noImage = new URL("assets/search-no-image.png", import.meta.url);

  const imageURL = `https://image.tmdb.org/t/p/w300/${movie.poster_path}`;
  let genre = "";
  for (let genreId of movie.genre_ids)
    genre += movieGenres.find((x) => x.id === genreId).name + ", ";
  if (genre.length > 0) genre = genre.slice(0, -2); //remove last ", "

  const searchCardMarkup = `
  <div class="flex items-stretch bg-[#21242D] text-white relative">
    <img id="search-image" class="h-[180px] w-[120px] object-cover hover:cursor-pointer"
     src="${imageURL}" 
     alt="${movie.title}" />
    <div class="px-4 w-full flex flex-col max-h-[160px] m-1 justify-evenly">
      <p id="search-movie-title" class="font-bold text-l sm:max-w-fit text-[#00b9ae] hover:cursor-pointer">
       ${movie.title}</p>
      <div class="flex justify-start gap-6 items-center">
        <p class="text-md">
         ${
           movie.release_date.length > 0 ? movie.release_date.slice(0, -6) : ""
         }</p>
        <span class="flex font-semibold text-sm text-center">
        <img src=${starIcon} alt="star" width="16px" class="flex mr-2"/>
         ${movie.vote_average.toFixed(1)}</span>
        <span class="font-semibold text-sm text-right italic text-[#00b9ae]">
         ${genre}</span>
      </div>
      <p id="movie-description" class="text-ellipsis overflow-hidden text-sm mt-2">
       ${movie.overview}
      </p>
      <div id="search-fav" class="hover:cursor-pointer">
        <div class="bg-[#16181e] opacity-40 self-start p-2 absolute rounded-md right-1 top-1 h-[33px] w-[36px]"></div>
        <img class="self-start p-2 absolute rounded-md right-1 top-1" src="src/assets/heart-icon.svg" alt="" />
      </div>
  </div>`;

  const movieEl = document.createElement("div");
  movieEl.innerHTML = searchCardMarkup;
  movieEl.querySelector("#search-movie-title").onclick = () => openDetails();
  const img = movieEl.querySelector("img");
  img.onclick = () => openDetails();
  img.onerror = () => (img.src = noImage);
  cardsContainerEl.appendChild(movieEl);

  //add to favorites
  const favBtn = movieEl.querySelector("#search-fav");

  if (IsFavorite(movie)) addToFavoritesUI();
  else removeFromFavoritesUI();

  favBtn.onclick = () => {
    if (favBtn.children[1].id == "fav") {
      removeFromFavoritesUI();
      RemoveFromFavoritesStorage(movie);
    } else {
      addToFavoritesUI();
      AddToFavoritesStorage(movie);
    }
  };

  function removeFromFavoritesUI() {
    favBtn.children[1].src = favIcon;
    favBtn.children[1].id = "";
  }

  function addToFavoritesUI() {
    favBtn.children[1].src = favIconSelected;
    favBtn.children[1].id = "fav";
  }

  function openDetails() {
    window.open(detailsURL + movie.id, "_blank");
  }
}

//------- Erika part -------

const popUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;

async function fetchItems(popUrl) {
  const options = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(`${popUrl}`, options);
    const movies = await response.json();
    // console.log(movies);

    return movies;
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", async () => {
  const movies = await fetchItems(popUrl);
  const popularMovies = movies.results;
  // console.log(popularMovies);
  popularMovies.forEach((movie) => {
    cardUI(movie);
  });
});

function cardUI(movie) {
  const favIconSelected = new URL(
    "assets/heart-icon-selected.svg",
    import.meta.url
  );
  const favIcon = new URL("assets/heart-icon.svg", import.meta.url);
  const starIcon = new URL("assets/star-icon.svg", import.meta.url);
  const imageURL = `https://image.tmdb.org/t/p//w300_and_h450_bestv2/`;
  const detailsURL = `https://www.themoviedb.org/movie/`;

  // console.log(movie);

  let genre = "";
  for (let genreId of movie.genre_ids)
    genre += movieGenres.find((x) => x.id === genreId).name + ", ";
  // console.log(genre);
  if (genre.length > 0) genre = genre.slice(0, -2); //remove last ", "

  const card = `
      <a href="${detailsURL}${movie.id}" target="_blank">
        <img class="rounded-t-[18px] w-full"
        src="${imageURL}${movie.poster_path}"
        alt="${movie.title}"
        />
      </a>
      <div class="py-4 px-2">
        <p id="movie-title" class="font-bold text-xl line-clamp-1 mb-2">${
          movie.title
        }</p>
        <div class="flex justify-between mb-4">
          <span class="text-md">
            ${
              movie.release_date.length > 0
                ? movie.release_date.slice(0, -6)
                : ""
            }
          </span>
          <span class="flex font-semibold text-sm text-center">
          
            <img src=${starIcon} alt="star" width="16px" class="flex mr-2"/>
            ${movie.vote_average.toFixed(1)}
          </span>
        </div>
        <div class="flex justify-between items-center">
        <button id="add-toList" class="bg-[#00B9AE] rounded-full font-bold p-2 mr-1 hover:cursor-pointer hover:animate-bounce">
          <img src=${favIcon} alt=""  />
        </button>
        <span class="font-semibold text-sm text-right text-[#00b9ae]">
        ${genre}
        </span>
      </div>
      </div>
  `;

  // Add Movie to faorites
  const cardDiv = document.createElement("div");

  cardDiv.classList.add(
    "flex",
    "flex-col",
    "rounded-[18px]",
    "bg-[#21242D]",
    "text-white"
  );

  cardDiv.innerHTML = card;
  popularMoviesEl.appendChild(cardDiv); // to insert inside carDiv the variable card from the top

  const toList = cardDiv.querySelector("#add-toList");
  // console.log(toList);

  // actions

  if (IsFavorite(movie)) addToFavoritesUI();
  else removeFromFavoritesUI();

  toList.onclick = () => {
    if (toList.children[0].id == "fav") {
      removeFromFavoritesUI();
      RemoveFromFavoritesStorage(movie);
    } else {
      addToFavoritesUI();
      AddToFavoritesStorage(movie);
    }
  };

  function removeFromFavoritesUI() {
    toList.classList.add = "bg-[#00B9AE]";
    toList.children[0].src = favIcon;
    toList.children[0].id = "";
  }

  function addToFavoritesUI() {
    // toList.classList.toggle("bg-amber-400");
    toList.classList.remove = "bg-[#00B9AE]";
    toList.classList.add = "bg-amber-400";
    toList.children[0].src = favIconSelected;
    toList.children[0].id = "fav";
  }

  // toList.onclick = () => {
  //   // const favKey = "popular-favorites"; // the value for kew to show in local storage can be added as a "String" or save in a variable and use his name favKey
  //   toList.classList.toggle("bg-amber-400"); // Add newone class
  //   const movies = JSON.parse(localStorage.getItem(favKey)) || [];

  //   movies.push(movie);
  //   localStorage.setItem(favKey, JSON.stringify(movies));
  // };
} // end of function cardUI
