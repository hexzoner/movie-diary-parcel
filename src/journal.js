// Retrieve the array of favorite movies from local storage

const localStorageData = JSON.parse(localStorage.getItem("search-favorites")) || [];

const favoriteMoviesContainer = document.querySelector("#favorite-movies-container");

// Function to convert genre ids to genre name
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];
function getGenreByIds(genres, ids) {
  return genres
    .filter((genre) => ids.includes(genre.id))
    .map((genre) => genre.name)
    .join(", ");
}

//No cards Markup
const noCardsParagraph = `<p class="text-gray-700 text-lg font-[lato] px-14 py-40 mx-auto text-center">
  You don't have any favorite movies yet. Start adding some to see them here!
</p>`;

// Function to generate a card
function generateCard(i) {
  const favoriteMoviesCardMarkup = `<div data-index="${i}" class="movie-card flex flex-col rounded-[18px] bg-[#21242D] text-white">
            <img
              src="https://media.themoviedb.org/t/p/w300_and_h450_bestv2/${localStorageData[i].poster_path}
              "
              alt="movie name"
              class="rounded-t-[18px] w-full"
            />

            <div class="py-4 px-2">
              <p class="font-bold text-xl line-clamp-1 mb-2">
              ${localStorageData[i].title}
              </p>
              <!-- Year + Rating -->
              <div class="flex items-center justify-between mb-4">
                <span class="text-md">${localStorageData[i].release_date.length > 0 ? localStorageData[i].release_date.slice(0, -6) : "Unknown"}</span>
                <span
                  class="flex items-center font-semibold text-sm text-center"
                >
                  <img
                    src="src/assets/star-icon.svg"
                    alt="star"
                    width="16px"
                    class="flex mr-2"
                  />
                  ${localStorageData[i].vote_average.toFixed(1)}
                </span>
              </div>
              <!-- Add to List Button + Genre -->
              <div class="flex justify-between items-center min-h-10">
                <button
                id="${i}"
                class="heart-button-filled group bg-[#00B9AE] rounded-full font-bold p-2 mr-1 hover:animate-bounce"
              >
                <!-- Default Icon -->
                <img
                  src="./src/assets/heart-icon-selected.svg"
                  alt="Default Icon"
                  class="block group-hover:hidden"
                />

                <!-- Hover Icon -->
                <img
                  src="./src/assets/heart-icon.svg"
                  alt="Hover Icon"
                  class="hidden group-hover:block"
                />
              </button>

                <span class="font-semibold text-sm text-right  text-[#00b9ae] max-w-44">${getGenreByIds(genres, localStorageData[i].genre_ids)}</span>
              </div>
            </div>
            <!-- Add A Note Section -->
            <div
              class="flex flex-col flex-1 gap-2 items-center justify-center w-full px-2 mb-4"
            >
              <div class="flex justify-center items-center gap-2 w-full mb-1">
                <form class="flex justify-center items-center w-full">
                  <input
                    type="text"
                    class="note-input  appearance-none w-full bg-gray-900 text-[#00b9ae] border-gray-600 border-2 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-gray-800  focus:border-2 focus:border-[#00b9ae]"
                    placeholder="Add a Note..."
                  />
                </form>
                <button
                  class="add-note-btn flex items-center justify-center rounded-xl bg-gray-100 bg-opacity-20 backdrop-blur-l p-3 hover:animate-bounce"
                >
                  <img src="src/assets/add-icon.svg" alt="Add icon" />
                </button>
              </div>
              <div
                class="par line-clamp-1 text-center text-xl w-full bg-gray-900 rounded-lg p-1 text-gray-500"
              >
                
              </div>
            </div>
          </div>`;

  favoriteMoviesContainer.insertAdjacentHTML("beforeend", favoriteMoviesCardMarkup);
}

function displayNoCards() {
  favoriteMoviesContainer.insertAdjacentHTML("beforeend", noCardsParagraph);
  favoriteMoviesContainer.className = "";
  favoriteMoviesContainer.classList.add("flex", "items-center", "justify-center");
}

if (localStorageData.length === 0) {
  displayNoCards();
} else if (localStorageData.length > 0) {
  // Loop over the localStorage array
  for (let i = 0; i < localStorageData.length; i++) {
    generateCard(i);
  }
}

// Function to handle heart button click
function handleHeartButtonClick(event) {
  const button = event.currentTarget;
  const movieCard = button.closest(".movie-card");
  const index = parseInt(movieCard.getAttribute("data-index"), 10);

  // Remove the movie from local storage data
  localStorageData.splice(index, 1);

  // Update local storage
  localStorage.setItem("search-favorites", JSON.stringify(localStorageData));

  // Remove the movie card from the DOM
  favoriteMoviesContainer.removeChild(movieCard);

  // Update the indices of the remaining movie cards
  document.querySelectorAll(".movie-card").forEach((card, i) => {
    card.setAttribute("data-index", i);
  });
  // Reload the page if the localStorage is empty
  if (localStorageData.length === 0) {
    window.location.reload();
  }
}

// Attach event listeners to heart buttons
const heartButtons = document.querySelectorAll(".heart-button-filled");
heartButtons.forEach((button) => {
  button.addEventListener("click", handleHeartButtonClick);
});

// Add Note
document.addEventListener("DOMContentLoaded", (event) => {
  const addNoteButtons = document.querySelectorAll(".add-note-btn");

  addNoteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const movieCard = this.closest(".movie-card");
      const noteInput = movieCard.querySelector(".note-input");
      const noteText = noteInput.value;
      const parDiv = movieCard.querySelector(".par");
      const imgElement = this.querySelector("img");

      if (noteText.trim()) {
        // Create a new <p> element
        const noteElement = document.createElement("p");
        noteElement.textContent = noteText;
        parDiv.appendChild(noteElement);

        // Save to local storage
        saveNoteToLocalStorage(movieCard, noteText);

        // Change button image to remove icon
        imgElement.src = "src/assets/delete-icon.svg";

        // Add remove functionality
        this.addEventListener(
          "click",
          function () {
            removeNoteFromLocalStorage(movieCard, noteText);
            parDiv.removeChild(noteElement);
            imgElement.src = "src/assets/add-icon.svg"; // Revert to add icon
            noteInput.value = "";
          },
          { once: false }
        );

        // Clear the input
        noteInput.value = "";
      }
    });
  });

  // Load notes from local storage on page load
  loadNotesFromLocalStorage();
});

function saveNoteToLocalStorage(movieCard, noteText) {
  const cardIndex = Array.from(document.querySelectorAll(".movie-card")).indexOf(movieCard);
  let allNotes = JSON.parse(localStorage.getItem("movieNotes")) || [];
  allNotes.push({ cardIndex, noteText });
  localStorage.setItem("movieNotes", JSON.stringify(allNotes));
}

function removeNoteFromLocalStorage(movieCard, noteText) {
  const cardIndex = Array.from(document.querySelectorAll(".movie-card")).indexOf(movieCard);
  let allNotes = JSON.parse(localStorage.getItem("movieNotes")) || [];
  allNotes = allNotes.filter((note) => !(note.cardIndex === cardIndex && note.noteText === noteText));
  localStorage.setItem("movieNotes", JSON.stringify(allNotes));
}

function loadNotesFromLocalStorage() {
  const allNotes = JSON.parse(localStorage.getItem("movieNotes")) || [];
  allNotes.forEach((note) => {
    const movieCard = document.querySelectorAll(".movie-card")[note.cardIndex];
    if (movieCard) {
      const parDiv = movieCard.querySelector(".par");
      const noteElement = document.createElement("p");
      noteElement.textContent = note.noteText;
      parDiv.appendChild(noteElement);

      // Set the button image to remove icon
      const addButton = movieCard.querySelector(".add-note-btn");
      const imgElement = addButton.querySelector("img");
      imgElement.src = "src/assets/delete-icon.svg";

      // Add remove functionality
      addButton.addEventListener(
        "click",
        function () {
          removeNoteFromLocalStorage(movieCard, note.noteText);
          parDiv.removeChild(noteElement);
          imgElement.src = "src/assets/add-icon.svg"; // Revert to add icon
        },
        { once: true }
      );
    }
  });
}
