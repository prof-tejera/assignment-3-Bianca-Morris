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

const Timers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TimerSelector = styled.div`
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
  justify-content: center;
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

function App() {
  const { timerIdx, routineState = [] } = useContext(AppContext);

  const timers = {
    "Stopwatch": { C: (props) => <Stopwatch {...props} /> },
    "Countdown": { C: (props) => <Countdown {...props} /> },
    "XY": { C: (props) => <XY {...props} /> },
    "Tabata": { C: (props) => <Tabata {...props} /> },
};

  // const onTimerSwitch = (e, idx) => {
  //   handleReset(); // ensure any timers currently running are stopped & timer is reset
  //   setTimerIdx(idx);
  // };

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

  const currentTimer = routineState[timerIdx];
  const { type, ...passProps } = currentTimer || {}

  return (
    <Timers>
      <TimerSelector >
      { routineState.map((timer, idx) => {
        if (timerIdx === idx) {
          return <ActiveTimerTitle key={timer.uuid} {...{idx}}>{timer.type}</ActiveTimerTitle>;
        }
        return <TimerTitle key={timer.uuid} {...{idx}}>{timer.type}</TimerTitle>
      })}
      </TimerSelector>
      <Panel>
        { timers[type].C({ ...passProps}) }
      </Panel>
    </Timers>
  );
}

export default App;
