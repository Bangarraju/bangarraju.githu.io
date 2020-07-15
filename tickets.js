async function pushticketDataToServer() {
    var data = {};

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

    //push the user selected data into the userObject
    userObject.bookingHistory.push(data)

    // send the data into the server
    var url = "http://localhost:3000/user/1"
    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success');
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    //function call for show tickets in ticket page
    showTickets();

    //reset the form fields after data is posted into server
    document.getElementById("pickShowForm").reset();
    document.getElementById('submit').setAttribute('disabled','');
}

//function for display tickets in tickets page
function showTickets() {
    //indicator color change in nav bar
    changeIndicatorcolor('formIndicator','white');
    changeIndicatorcolor('seatIndicator','white');
    changeIndicatorcolor('ticketIndicator','blue');

    document.getElementById('tickets').innerHTML = "";  //making empty ticket page for every click
    
    //rendering the tickets page
    document.getElementById('pickShowForm').hidden = true;
    document.getElementById('selectSeat').hidden = true;
    document.getElementById('showTickets').hidden = false;

    var ticketsDiv = document.getElementById('tickets'); //get tickets element byusing id
    //display the all tickets which are booked by user
    userObject.bookingHistory.map((bookingData) => {
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
        </div>`

        append(ticketsDiv, ticketDiv);
    });
    
}