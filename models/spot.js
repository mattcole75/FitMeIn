import moment from 'moment';

class Spot {

    constructor(id, ownerUserId, title, description, appointmentDateTime, duration, price, imageUrl) {
        this.id = id;
        this.ownerUserId = ownerUserId;
        this.title = title;
        this.description = description;
        this.appointmentDateTime = appointmentDateTime;
        this.duration = duration;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    get textDate() {
        return moment(this.appointmentDateTime).format('MMMM Do YYYY, HH:mm');
    }
}

export default Spot;