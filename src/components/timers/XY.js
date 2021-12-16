import React, { useContext, useEffect } from "react";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";
import { isTimeABeforeTimeB } from "../../utils/helpers";

/**
 * A timer that counts down from starTime per round, for numRounds number of rounds
 * (e.g. 1 minute for 10 minutes would count down from 1 minute to 0, then start another countdown, etc, 10 times)
 */
const XY = (props) => {
  const {
    hasStarted,
    setTimer,
    routineState,
    timerIdx,
    currRoutineStep,
    hours,
    minutes,
    seconds,
    isTimerRunning,
    handleSetStartTime,
    tickDown,
    currRound,
    roundComplete,
  } = useContext(AppContext);

  const { startTime, numRounds, uuid } = currRoutineStep;
  const { 0: startHours, 1: startMinutes, 2: startSeconds } = startTime || [];
  
  // Set some constraints to avoid strange state combos
  const noStartTimeInputted = !startHours && !startMinutes && !startSeconds;
  const noTimeOnClock = !hours && !minutes && !seconds;
  const lastTimerInList = timerIdx === routineState.length - 1;
  const atEndOfRound = (numRounds === currRound) && noTimeOnClock;
  const startTimeEarlierThanCurrTime = isTimeABeforeTimeB(startTime, [hours, minutes, seconds], false);

  const disableResume = startTimeEarlierThanCurrTime || (noTimeOnClock && lastTimerInList && atEndOfRound);

  useInterval(() => {
    tickDown(roundComplete);
  }, isTimerRunning ? 1000 : null);

  useEffect(() => { // Should only run once... when setting up timer, before starting
    if (!hasStarted && timerIdx === 0 && noTimeOnClock && currRound === 1) {
      setTimer(startTime);
    }
  }, [hasStarted, timerIdx, noTimeOnClock, startTime, setTimer, currRound]);

  return (
    <div id={"xy-" + uuid}>
      <H1>XY</H1>
      <DisplayRounds {...{ currRound }} totalRounds={numRounds}/>
      <DisplayTime {...{ hours, minutes, seconds }} />
      <TimeInputLabel>
        Start Time:
        <TimeInput disabled hoursVal={startHours} minutesVal={startMinutes} secondsVal={startSeconds} onChange={handleSetStartTime}/>
      </TimeInputLabel>
      <TimerControls startDisabled={noStartTimeInputted} hideResume={disableResume} />
    </div>
  );
}

export default XY;
