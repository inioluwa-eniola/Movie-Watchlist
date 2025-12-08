/*
When enter button is clicked, the search btn should be clicked


When you click on the title of the movie, it takes you to a different page, where you list out all the details of the movie
*/

let moviesArr = []

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const movieContainer = document.querySelector(".movie-container");

async function fetchMovieTitle () {
    const response = await fetch (`http://www.omdbapi.com/?i=tt3896198&apikey=49a043a8&s=${searchInput.value}`);
    const data = await response.json();

    for (let i=0; i<data.Search.length; i++) {
        fetchMovieData(data.Search[i].Title)
    }
}


searchBtn.addEventListener("click", () => {
    console.log(searchInput.value)
    fetchMovieTitle();
    searchInput.value = ""
});


window.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        fetchMovieTitle()
        searchInput.value = ""
    }
});

async function fetchMovieData(title) {
    const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=49a043a8&t=${title}`) 
    const data = await response.json()
    displayMovies(data)
}



function displayMovies(dataObject) {
    movieContainer.innerHTML += 
    `   
        <div class="movie-poster-wrapper">
            <img class="poster-img" src="${dataObject.Poster}" alt="${dataObject.Poster} poster">
            <div class="text">
                <div class="top-section">
                    <h1 class="title"><a class="title-link" href="to some link">${dataObject.Title}</a></h1>
                    <div class="rating">
                        <i class="fa-solid fa-star" style="color: #fec654;"></i>
                        <p>${dataObject.imdbRating}</p>
                    </div>
                    <div class="watchlist">
                        <i class="fa-solid fa-circle-plus circle-plus"></i>
                        <p>Watchlist</p>
                    </div>
                </div>
        
                <div class="bottom-section">
                    <p>${dataObject.Runtime}</p>
                    <p>${dataObject.Genre}</p>
                    <p>${dataObject.Year3}</p>
                </div>
                <div class="plot">
                    <p>${dataObject.Plot}</p>
                </div>
            </div>
        </div>
        <hr>
    `
}




