import React, { useContext } from "react";
import styled from "styled-components";

import Panel from "../components/generic/Panel";
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { AppContext } from "../context/AppProvider";

import { themeColors } from "../utils/tokensAndTheme";

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
  justify-content: center;
  background: linear-gradient(143deg, ${themeColors.timerSelectorGradient1} 0%, ${themeColors.timerSelectorGradient2} 100%);
  overflow: visible;
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
  cursor: pointer;
  font-family: SourceCodePro;
`;

const ActiveTimerTitle = styled(TimerTitle)`
  background-color: ${themeColors.timerSwitchTitleActive};
  color: ${themeColors.textLight};
`;

function App() {
  const { timerIdx, setTimerIdx, handleReset } = useContext(AppContext);

  const timers = [
    { title: "Stopwatch", C: <Stopwatch /> },
    { title: "Countdown", C: <Countdown /> },
    { title: "XY", C: <XY /> },
    { title: "Tabata", C: <Tabata /> },
  ];

  const onTimerSwitch = (e, idx) => {
    handleReset(); // ensure any timers currently running are stopped & timer is reset
    setTimerIdx(idx);
  };

  return (
    <Timers>
      <TimerSelector >
      {timers.map((timer, idx) => {
        if (timerIdx === idx) {
          return <ActiveTimerTitle key={timer.title} onClick={(e) => onTimerSwitch(e, idx)}>{timer.title}</ActiveTimerTitle>;
        }
        return <TimerTitle key={timer.title} onClick={(e) => onTimerSwitch(e, idx)}>{timer.title}</TimerTitle>;
      })}
      </TimerSelector>
      <Panel>
        {timers[timerIdx].C}
      </Panel>
    </Timers>
  );
}

export default App;
