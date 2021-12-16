/**
 * Various functions for dealing with time that don't require state.
 * Note: hooks are in customReactHooks.js instead.
 */

/**
 * Does some validation and transforms to 2 digit display string; throws error on invalid
 * @param {Number} number
 * @param {String} timeUnit
 * @returns {String} 2-digit representation of the number
 */
export const transformTimeUnitToDisplayString = (number, timeUnit) =>  {
    if ( // quick validity check
        (number < 0) ||
        (timeUnit === "minutes" && number > 60) ||
        (timeUnit === "seconds" && number > 60)
    ) {
        throw new Error ("invalid value for time segment");
    }
    
    let numString = number.toString();

    if (numString.length < 2) {
      numString = "0" + numString;
    }
    return numString;
  }

const prepareTimeForJSDateConvert = (time) => {
  const newTime = [];
  for (let i = 0; i < time.length; i++) {
    switch(i) {
      case 0: 
        newTime.push(transformTimeUnitToDisplayString(time[i], "hours"));
        break;
      case 1:
        newTime.push(transformTimeUnitToDisplayString(time[i], "minutes"));
        break;
      case 2:
        newTime.push(transformTimeUnitToDisplayString(time[i], "seconds"));
        break
      default:
        throw new Error("Cannot prepare date for convert; time may have greater length than expected.");
    }
  }
  return newTime;
}

export const isTimeABeforeTimeB = (timeA, timeB, includeEquals) => {
  // Convert the array times into a JS string that can be used in JS DateTime
  const dateA = new Date("01/01/2021 " + prepareTimeForJSDateConvert(timeA).join(":") + " PM");
  const dateB = new Date("01/01/2021 " + prepareTimeForJSDateConvert(timeB).join(":") + " PM");
  
  // Lower time since epoch (in milliseconds) = earlier time
  if (includeEquals) {
    return dateA <= dateB;
  }
  return dateA < dateB;
}

export const convertSecondsToHours = (sec) => {
  const hours = Math.floor(sec / (60 * 60));
  const leftovers = sec - (hours * 60 * 60);
  return [hours, leftovers];
}

export const convertSecondsToMinutes = (sec) => {
  const mins = Math.floor(sec / 60);
  const leftovers = sec - (mins * 60);
  return [mins, leftovers];
}

export const multiplyTimerByValue = (thisTimer, value) => {
  let total;
  for (let i = 1; i <= value; i++) {
    if (i === 1) {
      total = [...thisTimer];
    } else {
      total = addTimers(total, [...thisTimer]);
    }
  }
  return total;
}

export const addTimers = (timerA, timerB) => {
  const { 0: hoursA, 1: minutesA, 2: secondsA } = timerA || [];
  const { 0: hoursB, 1: minutesB, 2: secondsB } = timerB || [];
  
  // convert everything to seconds
  const totalHoursInSec = ((hoursA || 0) + (hoursB || 0)) * 3600;
  const totalMinutesInSec = ((minutesA || 0) + (minutesB || 0)) * 60;
  const totalSec = totalHoursInSec + totalMinutesInSec + (secondsA || 0) + (secondsB || 0);

  // convert back
  const { 0: totalSecInHours = 0, 1: remainderFromHours = 0 } = convertSecondsToHours(totalSec);
  const { 0: totalSecInMinutes = 0, 1: remainderFromMinutes = 0 } = convertSecondsToMinutes(remainderFromHours);
  return [totalSecInHours, totalSecInMinutes, remainderFromMinutes];
}

export const displayTimeString = (time) => {
  const { 0: hours, 1: minutes, 2: seconds } = time || [];
  return `Hours: ${hours || 0}, Minutes: ${minutes || 0}, Seconds: ${seconds || 0}`;
}

/** 
 * DEPRECATED/UNUSED: These helpers are leftover from a previous attempt to use Javascript
 * DateTime for the timers (apparently more accurate to do it this way than simple interval)
 * -- due to complexity, this has been tabled. Keeping these here in case they become useful.
*/
export const convertMillisecToSec = (ms) => {
  return ms / 1000;
}

export const convertHoursToSeconds = (hours) => {
  const seconds = hours * (60 * 60);
  return seconds;
}

export const convertMinutesToSeconds = (minutes) => {
  const seconds = minutes * 60;
  return seconds;
}