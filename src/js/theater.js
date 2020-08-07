import moment from 'moment';
import {getTheaters, updateTheater} from './indexedDb'

let theaters = []
getTheaters((data)=>{
  theaters = data;
})

class Theater {

  constructor() {
    this.theater = {}
  }

  setTheater(theaterName) {
    this.theater = theaters.filter((theater) => theater.name == theaterName)[0]
  }

  //set the seats which are booked by user to object
  setBookedSeats(movie, timestamp, userId, seats) {
    let alreadyBookedSeats = this.getBookedSeats(timestamp, movie,'dataObj')
    if (alreadyBookedSeats && alreadyBookedSeats.length) {
      let alreadyBookedSeatsForUser = alreadyBookedSeats.filter((user)=>user.userId == userId)
      if(alreadyBookedSeatsForUser && alreadyBookedSeatsForUser.length){
        seats.map((seat) => { alreadyBookedSeats[0].seats.push(seat); })
      }
      else{
        let data ={}
        data.userId = userId;
        data.seats = seats;
        alreadyBookedSeats.push(data)
      }
    } else {
      let bookedSeats = {
        timestamp,
        data: [{
          userId,
          seats
        }]
      }
      let showDetails = this.getShowDetails(movie)
      showDetails.bookedSeats.push(bookedSeats)
    }

    
    updateTheater(this.theater)
  }

  //get the movie name for the particular theater
  moviesAtTheater() {
    return this.theater.shows;
  };
  //get available timings of the particular movie
  getTimingsForShow(movie) {
    let show = this.getShowDetails(movie)
    return show.timings
  }
  //function to retur all show details of particular movie
  getShowDetails(movie) {
    return this.theater.shows.filter((show) => show.name == movie)[0]
  }
  //function to return already booked seats in a particular show
  getBookedSeats(timestamp, movie, object) {
    let seats = []
    let showDetails = this.getShowDetails(movie)
    let bookedSeatsObject = showDetails.bookedSeats.filter((data) => data.timestamp == timestamp)
    let seatsData = bookedSeatsObject.map((data) => { return data.data })[0]
    if(object == 'dataObj'){return seatsData}
    if (seatsData) {
      seatsData.map((data) => {
        data.seats.map((seat) => {
          seats.push(seat)
        })
      })
    }
    return seats
  }
  //get the number of avialbel seats
  getNoOfSeatsAvailable(movie) {
    let dateSelected = document.getElementById('date').value;
    let timeSelected = document.getElementById('timingsDropdown').value;
    let date_time = (dateSelected + ' ' + timeSelected)
    let timestamp = moment(date_time, 'YYYY-MM-DD hh:mm A').format('x') 
    let seats = this.getBookedSeats(timestamp, movie)
    let totalSeats = this.theater.rows * this.theater.columns
    return totalSeats - seats.length
  }

  //function to create seating arrangement
  createseating(event) {
    event.preventDefault();
    document.getElementById('confirmBooking').setAttribute('disabled', '')

    document.getElementById('pickShowNav').style.opacity = "50%";
    document.getElementById('selectSeatNav').style.opacity = "100%";

    document.getElementById('pickShowForm').hidden = true;
    document.getElementById('selectSeat').hidden = false;
    document.getElementById('ticketsContainer').hidden = true;

    let numberOfSeats = document.getElementById('ticketsDropdown').value; //get the no of seats user wanted
    let movieSelected = document.getElementById('movieDropdown').value;
    let dateSelected = document.getElementById('date').value;
    let timeSelected = document.getElementById('timingsDropdown').value;
    let date_time = (dateSelected + ' ' + timeSelected)
    let timestamp = moment(date_time, 'YYYY-MM-DD hh:mm A').format('x') //timestamp for getting booked seats for a particular selection of date and time

    let rows = this.theater.rows; //rows of theater hall
    let columns = this.theater.columns  //columns of theater hall
    var booked_seats = this.getBookedSeats(timestamp, movieSelected) //already booked seats

    //html creation for seating
    let seatingValue = [];
    for (let i = 1; i <= rows; i++) {
      seatingValue.push("<tr>");
      for (let j = 1; j <= columns; j++) {
        let seatNumber = String.fromCharCode(64 + i) + j;
        let seatingStyle;
        if (booked_seats && booked_seats.includes(seatNumber)) {
          seatingStyle = `<td><input type='checkbox' class='seat blocked'  value='${seatNumber}'></div></td>`
        } else {
          seatingStyle = `<td><input class='seat available' name='seat' type='checkbox'  value='${seatNumber}'/></td>`
        }
        seatingValue.push(seatingStyle);
      }
      seatingValue.push("</tr>")
    }

    $('#messagePanel').html(seatingValue); //display seating arrangement

    //while seat selecting prevent the selection 
    $("input[name='seat']").on('change', function (e) {
      //restriting the no fo seats selection when it reaches the limit
      if ($("input[name='seat']:checked").length > numberOfSeats) {
        $(this).prop('checked', false);
      }

      //enable and disable the continue buttino in ticket selection screen
      if ($("input[name='seat']:checked").length == numberOfSeats) {
        document.getElementById('confirmBooking').removeAttribute('disabled');
      } else {
        document.getElementById('confirmBooking').setAttribute('disabled', '')
      }
    });
  }
}

export default new Theater