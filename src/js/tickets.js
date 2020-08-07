import moment from 'moment'

import Service from './service';
import { createNode, append } from './nodeOperations'
import User from './user'
import Theater from './theater'

const service = Service
const user = User
let theater = Theater
export function pushticketDataToServer() {
  let data = {};

  //setting user selected data into data object
  data.seatNumbers = [];
  $.each($("input[name='seat']:checked"), function () {
    data.seatNumbers.push($(this).val());
  });
  data.ticketId = Date.now();
  data.theaterName = document.getElementById('theaterDropdown').value;
  data.movieName = document.getElementById('movieDropdown').value;
  data.timing = document.getElementById('timingsDropdown').value;
  data.location = document.getElementById('cityDropdown').value;
  data.date = document.getElementById('date').value;

  if (user.id) {
    let userId = user.id;

    //push the user selected data into the userObject
    user.setNewBooking(data)

    try {
      //timestamp calculations
      let date_time = data.date + " " + data.timing
      let timestamp = moment(date_time, 'YYYY-MM-DD hh:mm A').format('x')
      theater.setBookedSeats(data.movieName, timestamp, userId, data.seatNumbers) //get

      let theaterId = theater.theater.id;
      const theaterUrl = `http://localhost:3000/theater/${theaterId}`;

      //send the theater data toe server
      service.sendRequest(theaterUrl, 'PATCH', theater.theater, handleRequest);

      // send the user data to the server
      const userUrl = `http://localhost:3000/users/${userId}`;
      service.sendRequest(userUrl, 'PATCH', user, handleRequest);

    } catch (exception) {
      console.log(exception)
    }

    function handleRequest(status, data) {
      if (status == 200) {
        console.log('patched data sucess' + data)
      } else {
        console.log('patch failed' + status)
      }
    }

    sessionStorage.setItem('userData', JSON.stringify(user));//set new booking into session storage
  }
  //reset the form fields after data is posted into server
  document.getElementById("pickShowForm").reset();
  document.getElementById('submit').setAttribute('disabled', '');
}

//function for display tickets in tickets page
export function showTickets() {
  //indicator color change in nav bar
  document.getElementById('pickShowNav').style.opacity = "50%";
  document.getElementById('selectSeatNav').style.opacity = "50%";

  document.getElementById('tickets').innerHTML = "";  //making empty ticket page for every click

  //rendering the tickets page
  document.getElementById('pickShowForm').hidden = true;
  document.getElementById('selectSeat').hidden = true;
  document.getElementById('ticketsContainer').hidden = false;

  let ticketsDiv = document.getElementById('tickets'); //get tickets element byusing id

  let bookingHistory = user.getBookingHistory()

  //display the all tickets which are booked by user
  bookingHistory.map((bookingData) => {

    let ticketDiv = createNode('div');
    ticketDiv.classList.add('card');
    ticketDiv.id = `${bookingData.ticketId}`
    ticketDiv.innerHTML = `theater Name : ${bookingData.theaterName}<br/>movie Name : ${bookingData.movieName}<br />movie  time : ${bookingData.timing} <br/>seat Numbers : ${bookingData.seatNumbers} <br/>location : ${bookingData.location}`;
    ticketDiv.innerHTML = `<h1>${bookingData.theaterName}</h1>
        <div class="title">
          <h2>${bookingData.movieName}</h2>
          <span>movie</span>
        </div>
        <div class="name">
          <h2>${bookingData.location}</h2>
          <span>location</span>
        </div>
        <div class="seatNumbers">
          <h2>${bookingData.seatNumbers}</h2>
          <span>seats</span>
        </div>
        <div class="time">
          <h2>${bookingData.timing}</h2>
          <span>time</span>
        </div>
        <div class="date">
          <h2>${bookingData.date ? bookingData.date : ''}</h2>
          <span>date</span>
        </div>`

    append(ticketsDiv, ticketDiv);
  });
}