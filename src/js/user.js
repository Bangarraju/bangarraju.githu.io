
class User{
    constructor(){
        this.name = '';
        this.id = '';
        this.bookingHistory = [];
    }

    setData(id, name, bookingHistory){
        this.id = id;
        this.name = name;
        this.bookingHistory = bookingHistory;
    }

    setNewBooking(booking){
        this.bookingHistory.push(booking);
    }

    getBookingHistory(){
        return this.bookingHistory;
    }
}

export default new User