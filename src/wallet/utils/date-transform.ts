import * as moment from 'moment';

export const toISOString = (date: string): string => moment(date, 'DD/MM/YYYY').toISOString();

export const toDate = (date: string): Date => moment(date, 'DD/MM/YYYY').toDate();

export const toMomentDate = (date: string): moment.Moment => moment(date, 'DD/MM/YYYY');

export const toDifYears = (date: moment.Moment) => moment().diff(date, 'years', false);
