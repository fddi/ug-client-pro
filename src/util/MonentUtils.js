import moment from 'moment';

/*
* 计算两日期相隔几天
*/
export const countDays = (startDay, endDay) => {
     const sd = moment(startDay, 'YYYY-MM-DD').toDate();
     const ed = moment(endDay, 'YYYY-MM-DD').toDate();
     const days = (ed - sd) / (1000 * 60 * 60 * 24);
     return days;
}

/*
* 计算日期相隔当前几天
*/
export const countDaysWithNow = (startDay) => {
     const now = moment().format('YYYY-MM-DD');
     return countDays(startDay, now);
}