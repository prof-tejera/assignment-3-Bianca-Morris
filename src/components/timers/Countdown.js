import React, { useContext, useEffect } from "react";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";
import { isTimeABeforeTimeB } from "../../utils/helpers";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";

/**
 * A timer that counts up to startTime amount of time (e.g. count up to 2 minutes and 30 seconds, starting at 0).
 */
const Countdown = (props) => {
  const {
    setTimer,
    hasStarted,
    timerIdx,
    routineState,
    currRoutineStep,
    hours,
    minutes,
    seconds,
    isTimerRunning,
    handleSetStartTime,
    tickDown,
    timerComplete,
  } = useContext(AppContext);

  const { startTime, uuid } = currRoutineStep;
  const { 0: startHours, 1: startMinutes, 2: startSeconds } = startTime || [];

  // Set some constraints to avoid strange state combos
  const noTimeOnClock = !hours && !minutes && !seconds;
  const lastTimerInList = timerIdx === routineState.length - 1;
  const noStartTimeInputted = !startHours && !startMinutes && !startSeconds;
  const startTimeEarlierThanCurrTime = isTimeABeforeTimeB(startTime, [hours, minutes, seconds], false);

  const disableResume = startTimeEarlierThanCurrTime || (noTimeOnClock && lastTimerInList);

  useInterval(() => {
    tickDown(timerComplete);
  }, isTimerRunning ? 1000 : null);

  useEffect(() => { // Should only run once... when setting up timer, before starting
    if (!hasStarted && timerIdx === 0 && noTimeOnClock) {
      setTimer(startTime);
    }
  }, [hasStarted, timerIdx, noTimeOnClock, startTime, setTimer]);

  return (
    <div id={"countdown-" + uuid}>
      <H1>Countdown</H1>
      <DisplayTime {...{ hours, minutes, seconds }} />
      <TimeInputLabel>
        Start Time:
        <TimeInput disabled hoursVal={startHours} minutesVal={startMinutes} secondsVal={startSeconds} onChange={handleSetStartTime} />
      </TimeInputLabel>
      <TimerControls startDisabled={noStartTimeInputted} hideResume={disableResume} />
    </div>
  );
}

export default Countdown;
