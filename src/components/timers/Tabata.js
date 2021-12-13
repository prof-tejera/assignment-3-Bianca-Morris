import React, { useContext, useEffect } from "react";
import styled from "styled-components";

import { AppContext } from "../../context/AppProvider";
import { useInterval } from "../../utils/customReactHooks";

import { H1 } from "../../utils/tokensAndTheme";
import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import TimerControls from "../generic/TimerControls";

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
    timerIdx,
    hours,
    minutes,
    seconds,
    isTimerRunning,
    isWorkTime,
    handleSetWorkTime,
    handleSetRestTime,
    tickDown,
    setIsIncrementing,
    currRound,
    tabataRoundComplete
  } = useContext(AppContext);

  const { workTime, restTime, numRounds } = routineState[timerIdx];
  const { 0: workHours, 1: workMinutes, 2: workSeconds } = workTime || [];
  const { 0: restHours, 1: restMinutes, 2: restSeconds } = restTime || [];

  useInterval(() => {
    tickDown(tabataRoundComplete);
  }, isTimerRunning ? 1000 : null);

  // On mount, ensure timer is set to decrement/tick down from startTime
  useEffect(() => { setIsIncrementing(false); }, [setIsIncrementing]);

  const noWorkTimeInputted = !workHours && !workMinutes && !workSeconds;
  const noRestTimeInputted = !restHours && !restMinutes && !restSeconds;
  const invalidRounds = currRound > numRounds;
  const startDisabled = (noWorkTimeInputted && noRestTimeInputted) || invalidRounds; // allow to start as long as work or rest is present
  const disableResume = numRounds === currRound && (!hours && !minutes && !seconds);

  return (
    <>
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
      <TimerControls {...{ startDisabled }}  resumeDisabled={disableResume}/>
    </>
  );
}

export default Tabata;
