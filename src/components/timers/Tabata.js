import React, { useContext, useEffect } from "react";
import styled from "styled-components";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";
import { isTimeABeforeTimeB } from "../../utils/helpers";

const LessMarginH1 = styled(H1)`
  margin: 5px;
`;

/**
 * An interval timer with work/rest periods. 
 * Eg: 20s/10s, 8 rounds, would count down from 20 seconds to 0, then count down from 10 seconds to 0, then from 20, then from 10, etc, for 8 rounds.
 * A full round includes both the work and rest. In this case, 20+10=30 seconds per round.
 */
const Tabata = (props) => {
  const {
    routineState,
    hasStarted,
    timerIdx,
    setTimer,
    currRoutineStep,
    hours,
    minutes,
    seconds,
    isTimerRunning,
    isWorkTime,
    handleSetWorkTime,
    handleSetRestTime,
    tickDown,
    currRound,
    tabataRoundComplete
  } = useContext(AppContext);

  const { workTime, restTime, numRounds, uuid } = currRoutineStep;
  const { 0: workHours, 1: workMinutes, 2: workSeconds } = workTime || [];
  const { 0: restHours, 1: restMinutes, 2: restSeconds } = restTime || [];

  // Set some constraints to avoid strange state combos
  const noTimeOnClock = (!hours && !minutes && !seconds);
  const noWorkTimeInputted = !workHours && !workMinutes && !workSeconds;
  const noRestTimeInputted = !restHours && !restMinutes && !restSeconds;
  const lastTimerInList = timerIdx === routineState.length - 1;
  const atEndOfRound = (numRounds === currRound) && noTimeOnClock && !isWorkTime;
  const startTimeEarlierThanCurrTime = isTimeABeforeTimeB(isWorkTime ? workTime: restTime, [hours, minutes, seconds]);

  const startDisabled = (noWorkTimeInputted && noRestTimeInputted); // allow to start as long as work or rest is present
  const disableResume = startTimeEarlierThanCurrTime || (noTimeOnClock && lastTimerInList && atEndOfRound);

  useInterval(() => {
    tickDown(tabataRoundComplete);
  }, isTimerRunning ? 1000 : null);

  useEffect(() => { // Should only run once... when setting up timer, before starting
    if (!hasStarted && timerIdx === 0 && noTimeOnClock && currRound === 1 && isWorkTime) {
      setTimer(workTime);
    }
  }, [hasStarted, timerIdx, noTimeOnClock, workTime, setTimer, currRound, isWorkTime]);

  return (
    <div id={"tabata-" + uuid}>
      <LessMarginH1>Tabata</LessMarginH1>
      <DisplayRounds {...{ currRound }} totalRounds={numRounds} isRest={!isWorkTime}/>
      <DisplayTime {...{ hours, minutes, seconds }}/>
      <TimeInputLabel>
        Work Time:
        <TimeInput disabled onChange={handleSetWorkTime} hoursVal={workHours} minutesVal={workMinutes} secondsVal={workSeconds} />
      </TimeInputLabel>
      <TimeInputLabel>
        Rest Time:
        <TimeInput disabled onChange={handleSetRestTime} hoursVal={restHours} minutesVal={restMinutes} secondsVal={restSeconds}/>
      </TimeInputLabel>
      <TimerControls {...{ startDisabled }}  hideResume={disableResume}/>
    </div>
  );
}

export default Tabata;
