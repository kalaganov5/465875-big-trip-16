import {FilterType} from '../const.js';
import dayjs from 'dayjs';

export const filter = {
  [FilterType.EVERYTHING]: (tripPoints) => (tripPoints),
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter(
    (tripPoint) => (dayjs().isBefore(tripPoint.timeStart) || dayjs().isSame(tripPoint.timeStart, 'day'))),
  [FilterType.PAST]: (tripPoints) => tripPoints.filter(
    (tripPoint) => (dayjs().isAfter(tripPoint.timeStart, 'day'))
  ),
};
