import {FilterType} from '../const.js';
import dayjs from 'dayjs';

export const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => (tripPoints),
  [FilterType.FUTURE]: (tripPoints) => (tripPoints.filter((tripPoint) => tripPoint.timeEnd > dayjs())),
  [FilterType.PAST]: (tripPoints) => (tripPoints.filter((tripPoint) => tripPoint.timeStart < dayjs())),
};
