import moment from 'moment';

class Order {

    constructor(id, items, total, date) {
        this.id = id;
        this.items = items;
        this.total = total;
        this.date = date;
    }

    get textDate() {
        return moment(this.date).format('MMMM Do YYYY, HH:mm');
    }
}

export default Order;