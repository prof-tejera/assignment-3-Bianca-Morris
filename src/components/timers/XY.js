import React, { useContext } from "react";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";

/**
 * A timer that counts down from starTime per round, for numRounds number of rounds
 * (e.g. 1 minute for 10 minutes would count down from 1 minute to 0, then start another countdown, etc, 10 times)
 */
const XY = (props) => {
  const {
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

  useInterval(() => {
    tickDown(roundComplete);
  }, isTimerRunning ? 1000 : null);

  const noStartTimeInputted = !startHours && !startMinutes && !startSeconds;
  // const invalidRounds = currRound > numRounds;
  // const disableStart = noStartTimeInputted || invalidRounds;
  const disableResume = numRounds === currRound && (!hours && !minutes && !seconds);

  return (
    <div id={"xy-" + uuid}>
      <H1>XY</H1>
      <DisplayRounds {...{ currRound }} totalRounds={numRounds}/>
      <DisplayTime {...{ hours, minutes, seconds }} />
      <TimeInputLabel>
        Start Time:
        <TimeInput disabled hoursVal={startHours} minutesVal={startMinutes} secondsVal={startSeconds} onChange={handleSetStartTime}/>
      </TimeInputLabel>
      <TimerControls startDisabled={noStartTimeInputted} resumeDisabled={disableResume} />
    </div>
  );
}

export default XY;
