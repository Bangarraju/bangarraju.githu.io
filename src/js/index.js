import moment from 'moment';

import Service from './service';

import {addTheaters, getTheaters,initTheaterDb,initCitiesDb, addCities, getCities, getUserData, deleteUser} from './indexedDb'
import { setDataToDropdown } from './nodeOperations';
import Theater from './theater';
import { pushticketDataToServer, showTickets } from './tickets';
import User from './user';


import '../styles/index.scss';

const service = Service;
const user = User

const theaterObj = Theater;

initTheaterDb();
initCitiesDb();

//set userobject with a value
function setUserDataObj() {
    getUserData((userData)=>{
        if (userData) {
            user.setData(userData.id, userData.name, userData.bookingHistory);
            document.getElementById('userName').innerText = user.name;
            document.getElementById('userElement').hidden = false
            document.getElementById('loginElement').hidden = true
        }
    });
}

//return unique elements function
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

//fetch theaters data
(function () {
    service.get('/theater', handleTheaterRequest)
    function handleTheaterRequest(status, data) {
        if (status == 200) {
            if (data.length) {
                //cities
                let cities = data.map((theater) => {
                    return theater.location;
                })
                addCities(cities.filter(onlyUnique))
                addTheaters(data)
            } else {
                console.log("not get any data from server")
            }
        } else {
            console.log("error" + status + data)
        }
    }
})();
//set the city vlues to city dropdown
function setCityDropdown() {
    let select = document.getElementById('cityDropdown');
    getCities((cities)=>{
        setDataToDropdown(select, cities);
    })
}

//set theater names to corresponding dropdown
async function setTheaterDropdown(location, theaterDropdown) {
    theaterDropdown.disabled = false;
    getTheaters((theaters)=>{
        let theatersdata = theaters.filter((theater) => theater.location == location)
        let theaterNames = theatersdata.map((theater) => { return theater.name });
        setDataToDropdown(theaterDropdown, theaterNames);
    })

}

//set movie names to corresponding dropdown
function setMovieDropdown(movieDropdown) {
    movieDropdown.disabled = false;
    let movieData = theaterObj.moviesAtTheater();
    let movies = movieData.map((movie) => { return movie.name });
    setDataToDropdown(movieDropdown, movies);
}

//set times of a movie to the corresponding dropdown
function setTimeDropdown(movie, timeDropdown, selectedDate) {
    timeDropdown.disabled = false; //enable time dropdown
    let timings = theaterObj.getTimingsForShow(movie) // get timeings of the particular show

    let today = new Date();
    //compare toaday date and selected date
    if (today.toDateString() == selectedDate.toDateString()) {
        //logic to return timings of show above the present time
        let presentTime = moment(today).format('hh:mm A');
        timings = timings.filter((time) => moment(presentTime, "hh:mm A").isBefore(moment(time, "hh:mm A")))
    }
    setDataToDropdown(timeDropdown, timings)
}

function setTicketsDropdown(movie,ticketsDropdown){
    let tickets = []
    let noOfSeats = theaterObj.getNoOfSeatsAvailable(movie);
    document.getElementById("availableSeats").innerText = `Available seats: ${noOfSeats}`
    switch(noOfSeats){
        case 6:
            tickets.push(6)
        case 5:
            tickets.push(5)
        case 4:
            tickets.push(4)
        case 3:
            tickets.push(3)
        case 2:
            tickets.push(2)
        case 1:
            tickets.push(1)
            break;
        default:
            tickets = [1,2,3,4,5,6]
    }
    tickets.sort();
    setDataToDropdown(ticketsDropdown,tickets)
}

//render form fields function
function showForm() {

    //rendering elements and hide other elements
    document.getElementById('pickShowForm').hidden = false;
    document.getElementById('selectSeat').hidden = true;
    document.getElementById('ticketsContainer').hidden = true;

    //change the indicator color in navbar
    document.getElementById('pickShowNav').style.opacity = "100%";
    document.getElementById('selectSeatNav').style.opacity = "50%";

}

// function for logout 
function logout() {
    deleteUser(user.id)
    document.getElementById('userElement').hidden = true
    document.getElementById('loginElement').hidden = false
}


window.onload = function () {

    setUserDataObj();//set user object to logged in user


    //change indication of the page i.e., pick show and seat selection headings
    document.getElementById('pickShowNav').style.opacity = "100%";
    document.getElementById('selectSeatNav').style.opacity = "50%";

    setCityDropdown(); //funciton call for city dropdown

    //changes for previous dates disabled in datepicker
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    let month = (todayDate.getMonth() + 1)
    let date = todayDate.getDate()
    let mindate = year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((date < 10) ? ('0' + date) : date)
    $("#date").attr('min', mindate)


    //get dropdown elements from ids 
    var citySelect = document.getElementById('cityDropdown');
    var theaterSelect = document.getElementById('theaterDropdown');
    var movieSelect = document.getElementById('movieDropdown');
    var ticketSelect = document.getElementById('ticketsDropdown');
    var timeSelect = document.getElementById('timingsDropdown');
    var dateSelect = document.getElementById('date');

    //when movie dropdown changedt their value
    citySelect.onchange = (event) => {
        //reset the all dropdown values
        theaterSelect.length = 1;
        movieSelect.length = 1;
        ticketSelect.length = 1;
        dateSelect.value="";
        timeSelect.length = 1;
        document.getElementById("availableSeats").innerText ="";

        if (event.target.selectedIndex < 1) return;

        setTheaterDropdown(event.target.value, theaterSelect);
    }
    //when theater dropdown changed their value
    theaterSelect.onchange = (event) => {
        //reset the dropdown below the theater select dropdown
        movieSelect.length = 1;
        ticketSelect.length = 1;
        dateSelect.value="";
        timeSelect.length = 1;
        document.getElementById("availableSeats").innerText="";
        if (event.target.selectedIndex < 1) return;
        theaterObj.setTheater(event.target.value);
        setMovieDropdown(movieSelect);
    }
    //when movie dropdown changed their value
    movieSelect.onchange = (event) => {
        //reset the movie select below dropdowns
        timeSelect.length = 1;
        ticketSelect.length = 1;
        dateSelect.value="";
        document.getElementById("availableSeats").innerText =""
        if (event.target.selectedIndex < 1) return;
        dateSelect.disabled = false
    }

    //when date is selected corresponding canges
    dateSelect.onchange = (event) => {


        timeSelect.length = 1; //changes for time select dropdown
        ticketSelect.length = 1;
        document.getElementById("availableSeats").innerText =""
        todayDate.setHours(0, 0, 0, 0) //set today date with 00:00:00 hrs 
        let selectedDate = new Date(dateSelect.value)
        selectedDate.setHours(0, 0, 0, 0) //set selected date to 00:00:00 hrs
        //compare whther selected date is today or not
        if (selectedDate.getTime() >= todayDate.getTime()) {
            setTimeDropdown(movieSelect.value, timeSelect, selectedDate);
            document.getElementById('dateError').innerText = "";
        } else {
            document.getElementById('dateError').innerText = "* Enter present or future date"
        }

    }

    //when ticket dropdown changed their value
    timeSelect.addEventListener('change', function () {
        ticketSelect.length = 1;
        if (event.target.selectedIndex < 1) return;
        ticketSelect.disabled = false;
        setTicketsDropdown(movieSelect.value, ticketSelect)
    })

    //enable and disable next button in form  depends on dropdown selection 
    $(".pickShowDropdowns").on("change", function () {
        if (citySelect.value !== '' && theaterSelect.value !== '' && movieSelect.value !== '' && ticketSelect.value !== '' && timeSelect.value !== '') {
            document.getElementById('submit').removeAttribute('disabled');
        } else {
            document.getElementById('submit').setAttribute('disabled', '');
        }
    })

    //after submitting the details of pick a show, call to show seating arrangement
    document.getElementById('submit').onclick = () => { theaterObj.createseating(event) }

    document.getElementById('confirmBooking').onclick = () => {

        pushticketDataToServer() //function call to push new ticket data to server

        showTickets(); //function call for show tickets in ticket page
    }

    //when click on tickets button to show the all the past and present tickets of the user
    document.getElementById('showTickets').onclick = () => { 
        showTickets();
    }

    //logout function call when logout button is clicked
    document.getElementById('logout').onclick = () => { 
        logout();
    }

    //user dropdown
    document.getElementById('dropdownToggle').onclick = () => {
        document.getElementById("dropdown").classList.toggle("show");
    }

    //when click on pick a show in a nav bar
    document.getElementById('pickShowNav').onclick = () => { showForm() }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }