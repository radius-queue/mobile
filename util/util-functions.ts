/**
 * Parser for displaying phone numbers
 * @param {string} phoneNum
 * @return {string} parsed phone number
 */
export function parsePhoneNum(phoneNum : string) : string {
  if (phoneNum.length < 3) {
    return phoneNum;
  } else {
    phoneNum = '(' + phoneNum.substring(0, 3) + ')' + phoneNum.substring(3);
  }

  if (phoneNum.length > 8) {
    phoneNum = phoneNum.substring(0, 8) + '-' + phoneNum.substring(8);
  }
  return phoneNum;
}

/**
 * Parses Name for customer side display
 * @param {string} firstName first name of customer
 * @param {string} lastName last name of customer
 * @return {string} display name
 */
export function parseShortName(firstName: string, lastName: String) : string {
  if (lastName.length < 1) {
    return firstName.substring(0, 1).toUpperCase();
  }
  return firstName.substring(0, 1).toUpperCase() + ' ' +
      lastName.substring(0, 1).toUpperCase();
}

/**
 * Parses a date object to get just the hours and minutes
 * portion.
 * @param {Date} date date object to be parsed
 * @return {string} the final parsed string
 */
export function parseTimeString(date: Date) {
  return date.toTimeString().slice(0, 8);
};

/**
 * Converts a military time string to a normal time string.
 * 
 * @param militaryTime string in the form HH:mm:ss
 * @return string in from of h:mm:ss
 */
export function toStandardTime(militaryTime) {
  militaryTime = militaryTime.split(':');
  if (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) {
    return (militaryTime[0] - 12) + ':' + militaryTime[1] + ':' + militaryTime[2] + ' pm ';
  } else {
    return militaryTime.join(':') + ' am ';
  }
}
