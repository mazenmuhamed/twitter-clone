import moment from 'moment';

const formatDate = (date: any) => {
  const currentDate = moment(date.toDate()).fromNow();
  let formattedDate = currentDate.split(' ')[0] + currentDate.split(' ')[1][0];
  switch (formattedDate) {
    case 'ina':
      formattedDate = 'Now';
      break;
    case 'af':
      formattedDate = 'Just now';
      break;
    case 'am':
      formattedDate = '1m';
      break;
    case 'anh':
      formattedDate = '1h';
      break;
    case 'ad':
      formattedDate = '1d';
      break;
    case 'aw':
      formattedDate = '1w';
      break;
    case 'am':
      formattedDate = '1mo';
      break;
  }
  return formattedDate;
};
export default formatDate;
