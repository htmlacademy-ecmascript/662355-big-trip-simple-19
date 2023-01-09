import dayjs from 'dayjs';

const TIME_FORMAT = 'HH:mm';
const MACHINE_FORMAT = 'YYYY-MM-DDTHH:mm';
const DATE_FORMAT = 'MMM DD';
const MACHINE_DATA_FORMAT = 'YYYY-MM-DD';
const FORM_DATE = 'YY/MM/DD HH:mm';

function humanizePointTime(datetime) {
  return dayjs(datetime).format(TIME_FORMAT);
}

function machinePointDateTime(dateTime) {
  return dayjs(dateTime).format(MACHINE_FORMAT);
}

function humanizePointDate(date) {
  return dayjs(date).format(DATE_FORMAT);
}

function machinePointDate(date) {
  return dayjs(date).format(MACHINE_DATA_FORMAT);
}

function humanizeFormDate(dateTime) {
  return dayjs(dateTime).format(FORM_DATE);
}

function ucFirst(str) {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.start).diff(dayjs(pointB.start));
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}

export {
  sortPointsByDay,
  sortPointsByPrice,
  humanizePointTime,
  machinePointDateTime,
  humanizePointDate,
  machinePointDate,
  humanizeFormDate,
  ucFirst
};
