import { SortType } from '../constants.js';
import dayjs from 'dayjs';


const sorter = {
  [SortType.PRICE]: (pointA, pointB) => pointB.price - pointA.price,
  [SortType.DAY]: (pointA, pointB) => dayjs(pointA.start).diff(dayjs(pointB.start)),
};

export { sorter };
