
function createseating(event) {
  event.preventDefault();

  document.getElementById('confirmBooking').setAttribute('disabled','')

  changeIndicatorcolor('formIndicator','white');
  changeIndicatorcolor('seatIndicator','blue');
  changeIndicatorcolor('ticketIndicator','white');

  document.getElementById('pickShowForm').hidden = true;
  document.getElementById('selectSeat').hidden = false;
  document.getElementById('showTickets').hidden = true;

  let numberOfSeats = document.getElementById('ticketsDropdown').value; //get the no of seats user wanted
  let theaterName = document.getElementById('theaterDropdown').value; //get hte thater name user selected
  //filter out the theater data with user selected
  let theaters = JSON.parse(localStorage.getItem('theaters'));
  let theater = theaters.filter((theater) => theater.name == theaterName);
  
  let rows = theater[0].rows; //rows of theater hall
  let columns = theater[0].columns  //columns of theater hall
  var booked_seats = ['A12', 'C7'] //already booked seats

  //html creation for seating
  var seatingValue = [];
  for (var i = 1; i <= rows; i++) {
    seatingValue.push("<tr>");
    for (var j = 1; j <= columns; j++) {
      let seatNumber = String.fromCharCode(64 + i) + j;
      let seatingStyle;
      if (booked_seats.includes(seatNumber)) {
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
      alert(`allowed only ${numberOfSeats} tickets`);
    }
    
    //enable and disable the continue buttino in ticket selection screen
    if($("input[name='seat']:checked").length == numberOfSeats){
        document.getElementById('confirmBooking').removeAttribute('disabled');
    }else {
        document.getElementById('confirmBooking').setAttribute('disabled','')
    }
  });
}
