import React, { useContext } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFastForward, faPlay, faStop, faSync } from '@fortawesome/free-solid-svg-icons';

import { AppContext } from "../../context/AppProvider";
import Button, { ButtonSpacer } from "../generic/Button";
import { globalPropTypes } from "../../utils/globalPropTypes";
import { nullFx } from "../../utils/constants";


const ButtonIconHolderRow = styled.div`
    display: flex;
    justify-items: center;
    align-items: center;
    >span {
        font-size: 18px;
    }
    >svg {
        margin-right: 5px;
    }
`;

const TimerControls = (props) => {
  const {
    isTimerRunning,
    handleSkipToEnd = nullFx,
    handleStop = nullFx,
    handleStart = nullFx,
    handleReset = nullFx,
    handleResume = nullFx,
    hasStarted
  } = useContext(AppContext);

  const { 
    stopDisabled, startDisabled, resetDisabled, resumeDisabled, hideResume, hideReset
  } = props;

  const resetButton = (
    <Button onClick={handleReset} variant="secondary" disabled={resetDisabled}>
        <ButtonIconHolderRow>
            <FontAwesomeIcon icon={faSync} size="xs"/>
            <span>RESET</span>
        </ButtonIconHolderRow>
    </Button>);

  if (!isTimerRunning) {
    return (
      <>
        <ButtonSpacer>
            { (hasStarted && !hideResume) &&
                <Button onClick={handleResume} disabled={resumeDisabled}>
                    <ButtonIconHolderRow>
                        <FontAwesomeIcon icon={faPlay} size="xs"/>
                        <span>RESUME</span>
                    </ButtonIconHolderRow>
                </Button>}
            { !hasStarted &&
                <Button onClick={handleStart} disabled={startDisabled}>
                    <ButtonIconHolderRow>
                        <FontAwesomeIcon icon={faPlay} size="xs"/>
                        <span>START</span>
                    </ButtonIconHolderRow>
                </Button>} 
            { hasStarted && !hideReset && resetButton }
        </ButtonSpacer>
      </>
    )
  }
  return (
    <>
      <ButtonSpacer>
        { isTimerRunning &&
            <Button onClick={handleStop} variant="danger" disabled={stopDisabled}>
                <ButtonIconHolderRow>
                    <FontAwesomeIcon icon={faStop} size="xs"/>
                    <span>STOP</span>
                </ButtonIconHolderRow>
            </Button>} 
        { !hideReset && resetButton }
        { isTimerRunning && 
            <Button onClick={handleSkipToEnd}>
                <ButtonIconHolderRow>
                    <FontAwesomeIcon icon={faFastForward} size="xs"/>
                    <span>FF</span>
                </ButtonIconHolderRow>
            </Button> }
      </ButtonSpacer>
    </>
  );
}
TimerControls.propTypes = {
    startDisabled: globalPropTypes.disabled,
    stopDisabled: globalPropTypes.disabled,
    resetDisabled: globalPropTypes.disabled,
    resumeDisabled: globalPropTypes.disabled,
    hideResume: globalPropTypes.disabled,
    hideReset: globalPropTypes.disabled
}
TimerControls.defaultProps = {
    startDisabled: false,
    stopDisabled: false,
    resetDisabled: false,
    resumeDisabled: false,
    hideResume: false,
    hideReset: false
}

export default TimerControls;
