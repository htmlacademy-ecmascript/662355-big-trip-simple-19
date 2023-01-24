import { FilterType } from '../const.js';

const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => {
    const now = new Date();
    return points.filter((point) => point.end >= now);
  }
};

export {filter};
