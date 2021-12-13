import React, { useReducer } from 'react';
import useSound from 'use-sound';
import { v4 as uuidv4 } from 'uuid';

import timerEndSound from '../sfx/alarm.wav';
import restStartSound from '../sfx/restStart.wav';
import roundEndSound from '../sfx/roundEnd.wav';
import { usePersistedState } from '../utils/customReactHooks';
import { convertSecondsToHours, convertSecondsToMinutes } from '../utils/helpers';

export const AppContext = React.createContext({});

const emptyTimer = ["", "", ""]; // [Hours, Minutes, Seconds]

const getKeysToAddOnChangeType = (timerType) => {
  switch(timerType) {
    case 'Stopwatch':
      return { endTime: emptyTimer };
    case 'Countdown':
      return { startTime: emptyTimer};
    case 'Tabata':
      return { workTime: emptyTimer, restTime: emptyTimer, numRounds: 1 };
    case 'XY':
      return { startTime: emptyTimer, numRounds: 1 };
    default:
      throw new Error("Unexpected timerType");
  }
}

const reducer = (state, action) => {
    const { indexToChange, propName, newValue } = action;
    const newState = [];

    switch(action.type) {
        case 'addTimer':
            const initialState = { type: "Stopwatch", status: "not started", endTime: emptyTimer };
            const stateWithId = {...initialState, uuid: uuidv4()};
            return [...state, stateWithId ];
        case 'removeTimer':
            return state.filter((timer, i) => i !== action.indexToRemove);
        case 'clearAll':
            return [];
        case 'changePropVal':
            for (let i=0; i < state.length; i++) {
                if (i !== indexToChange) {
                    newState.push(state[i]);
                } else {
                    let updated;
                    if (propName === "type") {
                      // add timer-specific props to state for new timer type (startTime, numRounds, etc.)
                      const keysForNewType = getKeysToAddOnChangeType(newValue);
                      updated = {...state[i], ...keysForNewType };
                    } else {
                      updated = {...state[i]};
                    }
                    updated[propName] = newValue;
                    newState.push(updated);
                }
            }
            return newState;
        default:
            throw new Error("Unexpected action passed into reducer.");
    }
}

const AppProvider = ({ children }) => {
  const [ routineState, dispatch ] = useReducer(reducer, []);
  const [ timerIdx, setTimerIdx ] = usePersistedState("timer-idx", 0); // Timer from routineSatate to display

  const currRoutineStep = routineState[timerIdx];
  const { startTime, endTime, restTime, workTime, numRounds } = currRoutineStep || {};

  // State shared across all timers
  const [ timer, setTimer ] = usePersistedState("timer", emptyTimer);
  const [ isTimerRunning, setTimerRunning ] = usePersistedState("is-timer-running", false);
  const [ isIncrementing, setIsIncrementing ] = usePersistedState("is-incrementing", true); // if False, is decrementing

  // States specific to certain timers
  const [ currRound, setCurrRound ] = usePersistedState("curr-round", 1); // Used in Tabata and XY
  const [ isWorkTime, setIsWorkTime ] = usePersistedState("is-work-time", true); // if False, is rest time

  // Sound Hooks
  const [playTimerEnd] = useSound(timerEndSound);
  const [playRoundEnd] = useSound(roundEndSound);
  const [playRestStart] = useSound(restStartSound);

  const { 0: hours, 1: minutes, 2: seconds } = timer || [];

  const timerHasBeenStarted = (!!hours || !!minutes || !!seconds) || (currRound !== 1) || !isWorkTime;

  /* Counting up the seconds from 00:00:00 to endTime */
  const tickUp = () => {
    const { 0: endHours, 1: endMinutes, 2: endSeconds } = endTime || [];
    if (
      (seconds || 0) === (endSeconds || 0) && 
      (minutes || 0) === (endMinutes || 0) &&
      (hours || 0) === (endHours || 0)
    ) {
      timerComplete();
    } else {
      const endOfMinute = seconds === 59;
      const endOfHour = minutes === 59;
      
      if (endOfMinute && endOfHour) { // update hour
        setTimer([(hours || 0) + 1, 0, 0]);
      } else if (endOfMinute) { // update minute
        setTimer([hours, (minutes || 0) + 1, 0]);
      } else { // update second
        setTimer([hours, minutes, (seconds || 0) + 1]);
      }
    }
  }

  /* Counting down the seconds from start time to 00:00:00 */
  const tickDown = (onCompleteCallback) => {
    if (!hours && !minutes && !seconds) {
      onCompleteCallback();
    } else if (!minutes && !seconds) {
      setTimer([(hours - 1), 59, 59]);
    } else if (!seconds) {
      setTimer([hours, (minutes - 1), 59]);
    } else {
      setTimer([hours, minutes, (seconds - 1)]);
    }
  }

  const timerComplete = () => {
    handleStop();
    playTimerEnd();

    if (timerIdx !== routineState.length - 1) {
      const nextTimerIdx = timerIdx + 1;
      setTimerIdx(nextTimerIdx);

      // reset everything
      setCurrRound(1);
      setIsWorkTime(true);
      resetTimer(nextTimerIdx);

      // then, auto start
      handleStart();
    } else {
      alert('Routine complete!');
    }
  }

  const roundComplete = () => {
    if (currRound !== numRounds) {
      playRoundEnd();
      // start a new round
      setTimer(startTime);
      setCurrRound(currRound + 1);
    } else {
      timerComplete();
    }
  }

  const tabataRoundComplete = () => {
    if (!isWorkTime && (currRound === numRounds)) {
      timerComplete();
    } else {
      if (isWorkTime) {
        playRestStart();
        setTimer(restTime); // update counter with rest time
        setIsWorkTime(false); // convert to rest period
      } else {
        playRoundEnd();
        setTimer(workTime); // update counter with work times
        setIsWorkTime(true); // convert to work period
        setCurrRound(currRound + 1); // start a new round
      }
    }
  }

  // Event Handlers
  const handleSetStartTime = (e, idxToChange, startTime) => {
    handleSetTimeInput(e, idxToChange, startTime, "startTime");
  }

  const handleSetWorkTime = (e, idxToChange, workTime) => {
    handleSetTimeInput(e, idxToChange, workTime, "workTime");
  }

  const handleSetRestTime = (e, idxToChange, restTime) => {
    handleSetTimeInput(e, idxToChange, restTime, "restTime");
  }

  const handleSetEndTime = (e, idxToChange, endTime) => {
    handleSetTimeInput(e, idxToChange, endTime, "endTime");
  }

  const handleSetTimeInput = (e, indexToChange, time, timeType) => {
    const { target: { value, name } = {} } = e || {};
    const { 0: inputHours, 1: inputMinutes, 2: inputSeconds } = time || [];
    const valInt = parseInt(value || 0);
    const action = {
      type: "changePropVal",
      propName: timeType,
      indexToChange,
    };
    switch(name) {
      case "hourInput":
        action.newValue = [valInt, inputMinutes, inputSeconds]
        break;
      case "minuteInput":
        action.newValue = [inputHours, valInt, inputSeconds];
        break;
      case "secondInput":
        action.newValue = [inputHours, inputMinutes, valInt];
        break;
      default:
        throw new Error("Attempting to handle time change for unrecognized input.");
    };
    dispatch(action);
  }

  const handleChangeNumRounds = (indexToChange, num) => {
    const numInt = parseInt(num || 0);
    if (!isNaN(numInt)) {
      dispatch({
        type: "changePropVal",
        propName: "numRounds",
        newValue: numInt,
        indexToChange
      });
    }
  }

  const handleStop = (e) => {
    setTimerRunning(false);
  }

  const handleStart = (e) => {
    if (!isIncrementing) {
      if (timerIdx !== 3) { // XY or Countdown
        // start at start time
        setTimer(startTime);
      } else { // Tabata
        if (isWorkTime) {
          setTimer(workTime);
        } else {
          setTimer(restTime);
        }
      }
    }
    setTimerRunning(true);
  }

  const handleResume = (e) => {
    if (!isIncrementing) {
      setTimerRunning(true);
    } else {
      handleStart(e);
    }
  }

  const handleReset = (e) => {
    handleStop();
    setTimer(emptyTimer);
    setCurrRound(1);
    setIsWorkTime(true);
  }

  const handleSkipToEnd = (e) => {
    if (!isIncrementing) { // XY, Tabata, Countdown
      setTimer([0, 0, 0]);
      setCurrRound(numRounds);
      setIsWorkTime(false);
    } else { // Stopwatch
      setTimer(endTime);
    }
    timerComplete();
  }

  const restartRoutine = () => {
    console.log("resettingRoutine");
    setTimerRunning(false);
    if (timerIdx) { setTimerIdx(0); }
    if (routineState.length > 0) { resetTimer(0); }
    setCurrRound(1);
    setIsWorkTime(true);
  }

  const resetTimer = (idx) => {
    const thisTimer = routineState[idx];
    const { type } = thisTimer;
    if (type !== "Stopwatch") {
      const mapTimerTypeToReset = {
        "Countdown": "startTime",
        "XY": "startTime",
        "Tabata": "workTime"
      };
      const timeToResetTo = thisTimer[mapTimerTypeToReset[type]];
      console.log("resetting to", timeToResetTo, type)
      setTimer(timeToResetTo);
    } else {
      setTimer(emptyTimer);
    }
  }

  // TODO: more handling for previous states interfering with current run (HH:MM:SS leftover values)
  if (!currRoutineStep && routineState.length > 0) { 
    // Leftover state from previous run interfering with current run; adjust start index and restart routine
    // setTimerIdx(0);
    restartRoutine();
  };

  const multiplyTimerByValue = (timerA, value) => {
    const arr = Array(value).fill(timerA);
    return arr.reduce((a, i) => addTimers(a, i));
  }

  /** TODO: Needs to be updated with handling for empty string case */
  const addTimers = (timerA, timerB) => {
    const { 0: hoursA, 1: minutesA, 2: secondsA } = timerA;
    const { 0: hoursB, 1: minutesB, 2: secondsB } = timerB;
    
    // convert everything to seconds
    const totalHoursInSec = (hoursA + hoursB) * 3600;
    const totalMinutesInSec = (minutesA + minutesB) * 60;
    const totalSec = totalHoursInSec + totalMinutesInSec + secondsA + secondsB;

    // convert back
    const { 0: totalSecInHours = 0, 1: remainderFromHours = 0 } = convertSecondsToHours(totalSec);
    const { 0: totalSecInMinutes = 0, 1: remainderFromMinutes = 0 } = convertSecondsToMinutes(remainderFromHours);
    return [totalSecInHours, totalSecInMinutes, remainderFromMinutes];
  }

  const computeRoutineStepTime = (idx) => {
    const { type, numRounds, startTime, workTime, restTime, endTime } = routineState[idx];
    let stepTime;
    switch(type) {
      case "Stopwatch":
        stepTime = endTime;
        break;
      case "XY":
        stepTime = multiplyTimerByValue(startTime, numRounds);
        break;
      case "Tabata":
        const totalRestTime = multiplyTimerByValue(restTime, numRounds);
        const totalWorkTime = multiplyTimerByValue(workTime, numRounds);
        stepTime = addTimers(totalRestTime, totalWorkTime);
        break;
      case "Countdown":
        stepTime = startTime;
        break;
      default: 
        throw new Error("Unexpected timer type in computeRoutineStepTime");
    }
    return stepTime;
  }

  const computeTotalRoutineTime = () => {
    let totalTime;
    for (let i = 0; i < routineState.length; i++) {
      const thisStepTime = computeRoutineStepTime(i);
      if (i === 0) { 
       totalTime = thisStepTime;
      } else {
        totalTime = addTimers(thisStepTime, totalTime);
      }
    }
    return totalTime;
  }

  const displayTimeString = (time) => {
    const { 0: hours, 1: minutes, 2: seconds } = time;
    return `Hours: ${hours || "0"}, Minutes: ${minutes || "0"}, Seconds: ${seconds || "0"}`;
  }

  return (
    <AppContext.Provider
      value={{
        currRound,
        endTime,
        handleChangeNumRounds,
        handleReset,
        handleResume,
        handleSetEndTime,
        handleSetRestTime,
        handleSetStartTime,
        handleSetWorkTime,
        handleSkipToEnd,
        handleStart,
        handleStop,
        hours,
        isIncrementing,
        isTimerRunning,
        isWorkTime,
        minutes,
        numRounds,
        restTime,
        roundComplete,
        seconds,
        setIsIncrementing,
        setTimerIdx,
        startTime,
        tabataRoundComplete,
        tickDown,
        tickUp,
        timerComplete,
        timerHasBeenStarted,
        timerIdx,
        workTime,
        routineState,
        dispatch,
        restartRoutine,
        computeRoutineStepTime,
        computeTotalRoutineTime,
        displayTimeString,
        currRoutineStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;