var localStorage = window.localStorage;

var userObject = {
    name: "raju",
    bookingHistory: [
        {
            "ticketId":0,
            "theaterName": "",
            "movieName": "",
            "timing": "",
            "seatNumbers": [],
            "location" : ""
        }
    ]
}

//change indicator color in nav bar
function changeIndicatorcolor(id, color){
    document.getElementById(id).style.background = color;
}


function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
}

//return unique elements function
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
//fetch user data
(async function () {
    const url = "http://localhost:3000/user";
    let response = await fetch(url);
    let data = await response.json();
    localStorage.setItem('userData', JSON.stringify(data));
    userObject = data[0]
})();

//fetch theaters data
(async function () {
    const url = "http://localhost:3000/theater";
    let response = await fetch(url);
    let data = await response.json();
    //cities
    let cities = data.map((theater) => {
        return theater.location;
    })
    //set data into local storage
    localStorage.setItem('cities', JSON.stringify(cities.filter(onlyUnique)));
    localStorage.setItem('theaters', JSON.stringify(data));
})();

//set the city vlues to city dropdown
function setCityDropdown() {
    const select = document.getElementById('cityDropdown');
    let cities = JSON.parse(localStorage.getItem('cities'));
    setDataToDropdown(select, cities);
}



//get the movie name for the particular theater
function getMoviesAtTheater(theaterName) {
    let theaters = JSON.parse(localStorage.getItem('theaters'))
    let theater = theaters.filter((theater) => theater.name == theaterName)
    return theater[0].shows;
}


//set corresponding dropdown options to select dropdown
function setDataToDropdown(select, data) {
    data.map(function (item) {
        let option = createNode('option');
        option.text = `${item}`;
        option.id = `${item}`;
        select.add(option);
    })
}

//set theater names to corresponding dropdown
function setTheaterDropdown(location, theaterDropdown) {
    theaterDropdown.disabled = false;
    //get the theater names for a particular location
    function getTheatersAtLocation(location) {
        let theaters = JSON.parse(localStorage.getItem('theaters'))
        return theaters.filter((theater) => theater.location == location)
    }
    let theatersdata = getTheatersAtLocation(location);
    let theaters = theatersdata.map((theater) => { return theater.name });
    setDataToDropdown(theaterDropdown, theaters);
}

//set movie names to corresponding dropdown
function setMovieDropdown(theater, movieDropdown) {
    movieDropdown.disabled = false;
    let movieData = getMoviesAtTheater(theater);
    let movies = movieData.map((movie) => { return movie.name });
    setDataToDropdown(movieDropdown, movies);
}

//set times of a movie to the corresponding dropdown
function setTimeDropdown(theater, movie, timeDropdown) {
    timeDropdown.disabled = false;
    //get available timings of the particular movie
    function getTimingsForShow(theater, movie) {
        let shows = getMoviesAtTheater(theater);
        let show = shows.filter((show) => show.name == movie)
        return show[0].timings
    }
    let timings = getTimingsForShow(theater, movie)
    setDataToDropdown(timeDropdown, timings)
}

//render form fields function
function showForm(){

    //rendering elements and hide other elements
    document.getElementById('pickShowForm').hidden = false;
    document.getElementById('selectSeat').hidden = true;
    document.getElementById('showTickets').hidden = true;

    //change the indicator color in navbar
    changeIndicatorcolor('formIndicator','blue');
    changeIndicatorcolor('seatIndicator','white');
    changeIndicatorcolor('ticketIndicator','white');
}


window.onload = function () {

    changeIndicatorcolor('formIndicator','blue'); //change indicator of the page

    setCityDropdown(); //funciton call for city dropdown

    //get dropdown elements from ids 
    var citySelect = document.getElementById('cityDropdown');
    var theaterSelect = document.getElementById('theaterDropdown');
    var movieSelect = document.getElementById('movieDropdown');
    var ticketSelect = document.getElementById('ticketsDropdown');
    var timeSelect = document.getElementById('timingsDropdown');
    
    //when movie dropdown changedt their value
    citySelect.onchange = (event) => {
        //reset the all dropdown values
        theaterSelect.length = 1;
        movieSelect.length = 1;
        ticketSelect.value = "";
        timeSelect.length = 1;

        if (event.target.selectedIndex < 1) return;
        
        setTheaterDropdown(event.target.value, theaterSelect);
    }
    //when theater dropdown changed their value
    theaterSelect.onchange = (event) => {
        movieSelect.length = 1;
        ticketSelect.value = "";
        timeSelect.length = 1;
        if (event.target.selectedIndex < 1) return;
        setMovieDropdown(event.target.value, movieSelect);
    }
    //when movie dropdown changed their value
    movieSelect.onchange = (event) => {
        timeSelect.length = 1;
        ticketSelect.value = "";
        if (event.target.selectedIndex < 1) return;
        ticketSelect.disabled = false;
    }
    //when ticket dropdown changed their value
    ticketSelect.onchange = (event) => {
        timeSelect.length = 1;
        if (event.target.selectedIndex < 1) return;
        setTimeDropdown(theaterSelect.value, movieSelect.value, timeSelect);
    }

    //enable and disable next button in form  =depends on dropdown selection 
    $("select").on("change",function(){
        if(citySelect.value !== '' && theaterSelect.value !== '' && movieSelect.value !== '' && ticketSelect.value !== '' && timeSelect.value !== '' ){
            document.getElementById('submit').removeAttribute('disabled');
        }else {
            document.getElementById('submit').setAttribute('disabled','');
        }
    })

    localStorage.clear();
}