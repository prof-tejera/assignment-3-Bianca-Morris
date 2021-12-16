import React, { useCallback } from 'react';
import useSound from 'use-sound';

import timerEndSound from '../sfx/alarm.wav';
import restStartSound from '../sfx/restStart.wav';
import roundEndSound from '../sfx/roundEnd.wav';
import { usePersistedState, usePersistedReducer } from '../utils/customReactHooks';
import { addTimers, multiplyTimerByValue } from '../utils/helpers';
import { reducer } from '../components/reducers/routine';
import { emptyTimer } from '../utils/constants';

export const AppContext = React.createContext({});

const AppProvider = ({ children }) => {
  const [ routineState, dispatch ] = usePersistedReducer(reducer, []);
  const [ timerIdx, setTimerIdx ] = usePersistedState("timer-idx", 0); // Timer from routineState to display

  const currRoutineStep = routineState[timerIdx];
  const { type, startTime, endTime, restTime, workTime, numRounds, isIncrementing } = currRoutineStep || {};

  // State shared across all timers
  const [ hasStarted, setTimerHasStarted ] = usePersistedState('has-started', false); 
  const [ timer, setTimer ] = usePersistedState("timer", emptyTimer);
  const [ isTimerRunning, setTimerRunning ] = usePersistedState("is-timer-running", false);

  // States specific to certain timers
  const [ currRound, setCurrRound ] = usePersistedState("curr-round", 1); // Used in Tabata and XY
  const [ isWorkTime, setIsWorkTime ] = usePersistedState("is-work-time", true); // if False, is rest time

  // Sound Hooks
  const [playTimerEnd] = useSound(timerEndSound);
  const [playRoundEnd] = useSound(roundEndSound);
  const [playRestStart] = useSound(restStartSound);

  const { 0: hours, 1: minutes, 2: seconds } = timer || [];

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
    playTimerEnd();

    // Not finished with routine
    if (timerIdx !== routineState.length - 1) {
      switchToNextTimer();
    } else {
      handleStop();
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

  const handleChangeNumRounds = useCallback((indexToChange, num) => {
    const numInt = parseInt(num || 0);
    if (!isNaN(numInt)) {
      dispatch({
        type: "changePropVal",
        propName: "numRounds",
        newValue: numInt,
        indexToChange
      });
    }
  }, [dispatch]);

  const handleStop = (e) => {
    setTimerRunning(false);
  }

  const handleStart = (e, idx) => {
    const { startTime, workTime, restTime } = routineState[idx || timerIdx] || {};
    if (!hasStarted){
      setTimerHasStarted(true);
    }
    if (!isIncrementing) {
      if (type === "XY" || type === "Countdown") {
        setTimer(startTime);
      } else { // Tabata
        if (isWorkTime) {
          setTimer(workTime);
        } else {
          setTimer(restTime);
        }
      }
    } else {
        setTimer(emptyTimer); // start over from beginning for stopwatch
    }
    setTimerRunning(true);
  }

  const handleResume = (e) => {
    // if (!isIncrementing) {
      console.log("not incrementing");
      setTimerRunning(true);
    // } else {
      // console.log("incrementing");
      // handleStart(e);
    // }
  }

  const handleReset = (e) => {
    handleStop();
    resetTimer(timerIdx);
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
      setTimer(timeToResetTo);
    } else {
      setTimer(emptyTimer);
    }
    if (idx === 0) { setTimerHasStarted(false); }
  }

  /** Starts the routine over, and clears state from previous runs */
  const restartRoutine = () => {
    setTimerRunning(false);
    if (timerIdx) {setTimerIdx(0); }
    if (routineState.length > 0) { resetTimer(0); }
    setCurrRound(1);
    setIsWorkTime(true);
    setTimerHasStarted(false);
  }

  const switchToNextTimer = () => {
    const newTimerIdx = timerIdx + 1;
    setTimerIdx(newTimerIdx);

    if (isTimerRunning && routineState.length > 0) {
      // Update states and trigger next timer
      setCurrRound(1);
      setIsWorkTime(true);
      resetTimer(newTimerIdx);
    }      
  }

  const deleteTimerFromRoutine = (idx) => {
    if (!isTimerRunning) {
      dispatch({ type: "removeTimer", indexToRemove: idx })
    }
  };

 /**
  * Computes the total time for any individual step in the routine 
  * @param {Number} idx - index of step in routine to calculate time for
  * @returns {Array} representing a single timer
  */
  const computeRoutineStepTime = (idx) => {
    if (!routineState[idx]) { return emptyTimer };
    const {
      type,
      numRounds = 1,
      startTime = emptyTimer,
      workTime = emptyTimer,
      restTime = emptyTimer,
      endTime = emptyTimer
    } = routineState[idx];

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

  const checkForInvalidRoundTimes = useCallback(() => {
    const { type } = routineState[timerIdx] || {};
    if (type === "Tabata" || type === "XY") {
      if (numRounds <= 0) {
        alert(`Invalid numRounds for Timer @${timerIdx} (must be >=1). Setting to 1 and re-loading.`)
        handleChangeNumRounds(timerIdx, 1);
        
      } else if (currRound > numRounds) {
        alert(`Invalid numRounds for Timer @ index (must be <= numRounds). Setting currRound ${currRound} equal to numRounds ${numRounds}.`)
        // Invalid numRounds for Timer @ index (must be <= totalRounds). Setting to be equal to currentRound.
        setCurrRound(numRounds);
        // console.log(`invalid currRound ${currRound} > numRounds ${numRounds}`);
      }
    }
    // valid
  }, [handleChangeNumRounds, setCurrRound, currRound, numRounds, timerIdx, routineState]);

   // Restart routine if end up in a situation where state is invalid (should only happen after editing routine)
   if (
    (!currRoutineStep && routineState.length > 0)  // invalid timerIdx
    // (currRound > numRounds) // invalid round
  ) { 
    // Leftover state from previous run interfering with current run; adjust start index and restart routine
    restartRoutine();
  };

  return (
    <AppContext.Provider
      value={{
        currRound,
        setCurrRound,
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
        setTimer,
        hours,
        isIncrementing,
        isTimerRunning,
        isWorkTime,
        minutes,
        numRounds,
        restTime,
        roundComplete,
        seconds,
        setTimerIdx,
        startTime,
        tabataRoundComplete,
        tickDown,
        tickUp,
        timerComplete,
        hasStarted,
        timerIdx,
        workTime,
        routineState,
        dispatch,
        restartRoutine,
        computeRoutineStepTime,
        computeTotalRoutineTime,
        currRoutineStep,
        deleteTimerFromRoutine,
        checkForInvalidRoundTimes
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;