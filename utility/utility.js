import crypto from "crypto-js";
import moment from 'moment';

//hash password text to SHA256
export const hashPassword = (string) => {
    return crypto.SHA256(string).toString();
};

// return a string date in a short format
export const shortDatetext = (date) => {
    return moment(date).format('DD MMM YYYY');
};

// return a string date in a long format
export const longDateTimeText = (date) => {
    return moment(date).format('MMMM Do YYYY, HH:mm');
};

// return a string time in a short format
export const timeText = (date) => {
    return moment(date).format('HH:mm');
};