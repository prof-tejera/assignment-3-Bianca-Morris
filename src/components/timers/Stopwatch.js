import React, { useContext } from "react";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";
import { isTimeABeforeTimeB } from "../../utils/helpers";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";

/**
 * A timer that counts up to endTime amount of time (e.g. count up to 2 minutes and 30 seconds, starting at 0)
 */
const Stopwatch = (props) =>  {
  const {
    timerIdx,
    routineState,
    currRoutineStep,
    minutes,
    seconds,
    hours,
    isTimerRunning,
    tickUp,
    handleSetEndTime,
  } = useContext(AppContext);

  const { endTime, uuid } = currRoutineStep;
  const { 0: endHours, 1: endMinutes, 2: endSeconds } = endTime || [];

  // Set some constraints to avoid strange state combos
  const noEndTimeInputted = !endHours && !endMinutes && !endSeconds;
  const noTimeOnClock = !hours && !minutes && !seconds;
  const timerAtEnd = ((hours || 0) === (endHours || 0)) && ((minutes || 0) === (endMinutes || 0)) && ((seconds || 0) === (endSeconds || 0));
  const endTimeEarlierThanStartTime = isTimeABeforeTimeB(endTime, [hours, minutes, seconds], true);
  const lastTimerInList = timerIdx === routineState.length - 1;

  const disableResume = timerAtEnd && lastTimerInList;
  const disableReset = noEndTimeInputted && noTimeOnClock;
  const disableStart = noEndTimeInputted || endTimeEarlierThanStartTime;
  
  useInterval(() => {
    tickUp();
  }, isTimerRunning ? 1000 : null);

  return (
    <div id={"stopwatch-" + uuid}>
      <H1>Stopwatch</H1>
      <DisplayTime {...{ hours, minutes, seconds }} />
      <TimeInputLabel>
        End Time: 
        <TimeInput disabled hoursVal={endHours} minutesVal={endMinutes} secondsVal={endSeconds} onChange={handleSetEndTime} />
      </TimeInputLabel>
      <TimerControls startDisabled={disableStart} hideResume={disableResume} hideReset={disableReset} resumeDisabled={disableStart} />
    </div>
  );
}

export default Stopwatch;
