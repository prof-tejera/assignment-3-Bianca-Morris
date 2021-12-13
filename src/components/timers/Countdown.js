import React, { useContext, useEffect } from "react";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";
// import { isTimeABeforeTimeB } from "../../utils/helpers";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";

/**
 * A timer that counts up to startTime amount of time (e.g. count up to 2 minutes and 30 seconds, starting at 0).
 */
const Countdown = (props) => {
  const {
    routineState,
    timerIdx,
    hours,
    minutes,
    seconds,
    isTimerRunning,
    handleSetStartTime,
    tickDown,
    setIsIncrementing,
    timerComplete,
  } = useContext(AppContext);

  const { startTime } = routineState[timerIdx];
  const { 0: startHours, 1: startMinutes, 2: startSeconds } = startTime || [];

  useInterval(() => {
    tickDown(timerComplete);
  }, isTimerRunning ? 1000 : null);

  // On mount, ensure timer is set to decrement/tick down from startTime
  useEffect(() => { setIsIncrementing(false); }, [setIsIncrementing]);

  const noStartTimeInputted = !startHours && !startMinutes && !startSeconds;
  // const endTimeEarlierThanStartTime = isTimeABeforeTimeB(startTime, [hours, minutes, seconds], true);
  // const disableStart = noStartTimeInputted || endTimeEarlierThanStartTime;

  return (
    <>
      <H1>Countdown</H1>
      <DisplayTime {...{ hours, minutes, seconds }} />
      <TimeInputLabel>
        Start Time:
        <TimeInput disabled hoursVal={startHours} minutesVal={startMinutes} secondsVal={startSeconds} onChange={handleSetStartTime} />
      </TimeInputLabel>
      <TimerControls startDisabled={noStartTimeInputted}/>
    </>
  );
}

export default Countdown;
