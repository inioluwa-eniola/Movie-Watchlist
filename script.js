/*
When enter button is clicked, the search btn should be clicked


When you click on the title of the movie, it takes you to a different page, where you list out all the details of the movie
*/


const page = document.body.id


if (page === "home") {
    // Run code pertaining to the home screen
    let movieTitlesArray = [];
    let movieDetailsArray = [];
    let currentSearchResults = [];
    let watchlistArr = [];
    
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-button");
    const movieContainer = document.querySelector(".movie-container");
    
    async function fetchMovieTitle () {
        try {
            const response = await fetch (`https://www.omdbapi.com/?apikey=49a043a8&s=${searchInput.value.toLowerCase()}`);
            if(!response.ok) {
                throw new Error("Search failed");
            }
            const data = await response.json();
            await fetchMovieData(data, movieTitlesArray, movieDetailsArray)
        }

        catch (error) {
            console.error("Error:", error);
            movieContainer.innerHTML = `<p class="error-text">Unable to find what you're looking for. Please try another search.</p>`;
        }
    }
    
    async function fetchMovieData(dataObject, titlesArray, detailsArray) {
        titlesArray.length = 0;
        for (let i=0; i<dataObject.Search.length; i++) {
            titlesArray.push(dataObject.Search[i].Title)
        }
    
        for (let i=0; i<titlesArray.length; i++) {
            const response = await fetch(`https://www.omdbapi.com/?apikey=49a043a8&t=${titlesArray[i].toLowerCase()}&plot=full`) 
            const data = await response.json()
            detailsArray.push(data)
        }
        displayMovies(detailsArray)
    }
    
    
    
    searchBtn.addEventListener("click", () => {
        fetchMovieTitle();
        searchInput.value = ""
    });
    
    
    window.addEventListener("keydown", (e) => {
        if(e.key === "Enter") {
            fetchMovieTitle()
            searchInput.value = ""
        }
    });
    
    
    
    function displayMovies(array) {
     
        const seen = new Set();
        const uniqueMovies = array.filter(movie => {
            if(seen.has(movie.imdbID)) return false;
            seen.add(movie.imdbID);
            return true;
        })
        console.log(uniqueMovies)
        console.log(seen)
    
        let movieList = "";
        movieContainer.innerHTML = ""
        for (let i=0; i<uniqueMovies.length; i++) {
    
            movieList += 
            `   
                <div class="movie-poster-wrapper">
                    <img class="poster-img" src="${uniqueMovies[i].Poster}" alt="${uniqueMovies[i].Poster} poster">
                    <div class="text">
                        <div class="top-section">
                            <h1 class="title"><a class="title-link" href="#">${uniqueMovies[i].Title}</a></h1>
                            <div class="rating">
                                <i class="fa-solid fa-star" style="color: #fec654;"></i>
                                <p>${uniqueMovies[i].imdbRating}</p>
                            </div>
                            <div class="watchlist">
                                <a><i class="fa-solid fa-circle-plus circle-plus-icon"></i></a>
                                <p>Watchlist</p>
                            </div>
                        </div>
                
                        <div class="bottom-section">
                            <p>${uniqueMovies[i].Runtime}</p>
                            <p>${uniqueMovies[i].Genre}</p>
                            <p>${uniqueMovies[i].Year}</p>
                        </div>
                        <div class="plot">
                            <p>${uniqueMovies[i].Plot}</p>
                        </div>
                    </div>
                </div>
            `
            if (i !== uniqueMovies.length - 1) {
                movieList += "<hr>";
            }
            
        }
        movieContainer.innerHTML = movieList;
        
        addToWatchlist(uniqueMovies);
        array.length = 0
    }

    function addToWatchlist (uniqueMoviesArr) {
        currentSearchResults = uniqueMoviesArr;
        const addIcon = document.querySelectorAll(".circle-plus-icon");
    
    
        addIcon.forEach(icon => {
            icon.addEventListener ("click", () => {
    
                const card = icon.closest(".movie-poster-wrapper");
                const title = card.querySelector(".title").innerText;
    
                // Match the movie object 
                const movieObj = currentSearchResults.find(movie => movie.Title === title)
    
                // Load existing watchlist 
                let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
    
                // Avoid duplicates using imdbID
                if (!watchlist.some(movie => movie.imdbID === movieObj.imdbID)) {
                    watchlist.unshift(movieObj);
                }
    
                // Save back to local storage 
                localStorage.setItem("watchlist", JSON.stringify(watchlist));
            })     
        })
    }
    
}


if (page === "watchlist") {
    // Run the code pertaining to the watchlst page 
    
    function displayWatchlistMovies() {
        const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        const container = document.querySelector(".movie-container");

        if (watchlist.length === 0) {
            container.innerHTML =  `
                <div class="empty-watchlist-section"> 
                    <p>Your watchlist is looking a little empty ... </p>
                    <div class="empty-watchlist-bottom-section">
                        <a href="index.html" class="big-circle-plus-icon"><i class="fa-solid fa-circle-plus"></i></a>
                        <p>Let's add some movies!</p>
                    </div>
                </div>
            `;
            return
        }

        let html = "";
        for (let i=0; i<watchlist.length; i++) {
            html += `   
                <div class="movie-poster-wrapper">
                    <img class="poster-img" src="${watchlist[i].Poster}" alt="${watchlist[i].Poster} poster">
                    <div class="text">
                        <div class="top-section">
                            <h1 class="title"><a class="title-link" href="#">${watchlist[i].Title}</a></h1>
                            <div class="rating">
                                <i class="fa-solid fa-star" style="color: #fec654;"></i>
                                <p>${watchlist[i].imdbRating}</p>
                            </div>
                            <div class="watchlist">
                                <a><i class="fa-solid fa-xmark remove-icon" data-id="${watchlist[i].imdbID}"></i></i></a>
                                <p>Remove</p>
                            </div>
                        </div>
                
                        <div class="bottom-section">
                            <p>${watchlist[i].Runtime}</p>
                            <p>${watchlist[i].Genre}</p>
                            <p>${watchlist[i].Year}</p>
                        </div>
                        <div class="plot">
                            <p>${watchlist[i].Plot}</p>
                        </div>
                    </div>
                </div>
            `
            if (i !== watchlist.length-1){
                html += `<hr>`
            }
        }
        container.innerHTML = html
    }


    function removeFromWatchlist () {
        const container = document.querySelector(".movie-container");
        let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

        container.addEventListener("click", (e) => {
           
            if(e.target.classList.contains("remove-icon")){
                watchlist = watchlist.filter(movie => movie.imdbID !== e.target.dataset.id)
                localStorage.setItem("watchlist", JSON.stringify(watchlist));
                displayWatchlistMovies()
            }
        })
    }

    displayWatchlistMovies()
    removeFromWatchlist()
    
}



