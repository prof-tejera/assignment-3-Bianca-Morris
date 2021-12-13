import React, { useContext } from "react";
import styled from "styled-components";

import Panel from "../components/generic/Panel";
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { AppContext } from "../context/AppProvider";

import { H1, themeColors } from "../utils/tokensAndTheme";
import { Link } from "react-router-dom";
import Button from "../components/generic/Button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Timers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BottomPanel = styled.div`
  margin-top: 10px;
`;

const RoutinePane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  height: 350px;
  justify-content: flex-start;
  background: linear-gradient(143deg, ${themeColors.timerSelectorGradient1} 0%, ${themeColors.timerSelectorGradient2} 100%);
  overflow-y: scroll;
  border-radius: 20px 0 0 20px;
  padding: 30px;
`;

const TimerTitle = styled.div`
  background-color: ${themeColors.timerSwitchTitle};
  color: ${themeColors.textMedium};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: SourceCodePro;
`;

const ActiveTimerTitle = styled(TimerTitle)`
  background-color: ${themeColors.timerSwitchTitleActive};
  color: ${themeColors.textLight};
`;

const TimerSubtitle = styled.div`
  font-size: 10px;
`;

function App() {
  const {
    timerIdx,
    routineState = [],
    currRoutineStep,
    restartRoutine,
    computeRoutineStepTime,
    computeTotalRoutineTime,
    displayTimeString
  } = useContext(AppContext);

  const timers = {
    "Stopwatch": { C: <Stopwatch /> },
    "Countdown": { C: <Countdown /> },
    "XY": { C: <XY /> },
    "Tabata": { C: <Tabata /> },
  };

  const routineDefined = routineState.length !== 0;
  if (!routineDefined) {
    return (
      <Timers>
        <div>
          <H1>Ready to work out?</H1>
          <Link to="/add">Create a Routine</Link>
        </div>
      </Timers>
    );
  }

  if (!currRoutineStep) { throw new Error("Routine defined, but no current step. TimerIdx might be out of bounds.")};
  const { type } = currRoutineStep;

  return (
    <Wrapper>
      <Timers>
        <RoutinePane >
        { routineState.map((timer, idx) => {
          if (timerIdx === idx) {
            return (
              <ActiveTimerTitle key={timer.uuid} {...{idx}}>
                {timer.type}
                <TimerSubtitle>({displayTimeString(computeRoutineStepTime(idx))})</TimerSubtitle>
              </ActiveTimerTitle>
            );
          }
          return (
            <TimerTitle key={timer.uuid} {...{idx}}>
              {timer.type}
              <TimerSubtitle>({displayTimeString(computeRoutineStepTime(idx))})</TimerSubtitle>
            </TimerTitle>
          );
        })}
        </RoutinePane>
        <Panel>
          { timers[type].C }
        </Panel>
      </Timers>
      <BottomPanel>
        { timerIdx !== 0 ? 
          <Button onClick={() => restartRoutine()}>Restart Routine</Button>
          : null }
        <TimerSubtitle>Total Time: {displayTimeString(computeTotalRoutineTime())}</TimerSubtitle>
      </BottomPanel> 
    </Wrapper>
  );
}

export default App;
