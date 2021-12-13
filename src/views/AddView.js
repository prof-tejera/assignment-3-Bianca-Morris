import { faPlus, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import styled from "styled-components";
import Button from "../components/generic/Button";
import { RoundsLabel } from "../components/generic/DisplayRounds";
import Input from "../components/generic/Input";
import TimeInput, { TimeInputLabel } from "../components/generic/TimeInput";
import { AppContext } from "../context/AppProvider";


import { H1 } from "../utils/tokensAndTheme";

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CenteredRow = styled(CenteredDiv)`
  flex-direction: row;
`;
const CenteredCol = styled(CenteredDiv)`
  flex-direction: column;
`;

const CenteredBlock = styled(CenteredCol)`
    padding: 20px 40px;
    background: #ffffff;
    margin: 10px;
`;

const Scrollable = styled.div`
    max-height: 450px;
    overflow-y: scroll; 
`;

const Dropdown = styled.select`
    padding: 5px;
    margin: 0 5px;
`;

const AddView = () => {
    const { routineState = [], dispatch } = useContext(AppContext);

    return (
        <CenteredCol>
            <H1>Add to Workout Routine</H1>

            <Scrollable>
                {routineState.map((timer, i) => {
                    const { uuid } = timer;
                    return <EditBlock key={uuid} {...timer} index={i} {...{ dispatch }} />
                })}
            </Scrollable>
            

            <CenteredRow>
                <Button onClick={() => dispatch({ type: "addTimer" })}>
                    <FontAwesomeIcon icon={faPlus} size="xs"/>
                    Add New Timer
                </Button>
                { (routineState.length !== 0) &&
                    <Button variant="danger" onClick={() => dispatch({ type: "clearAll" })}>
                        <FontAwesomeIcon icon={faSync} size="xs"/>
                        Start Over
                    </Button>}
            </CenteredRow>
        </CenteredCol>
    );
};

const EditBlock = (props) => {
    const { type, dispatch, index, ...passProps } = props;
    const timerTypes = ["Stopwatch", "Countdown", "Tabata", "XY"];
    
    let blockToRender;
    switch (type) {
        case "Stopwatch": 
            blockToRender = <StopwatchEditBlock {...passProps} {...{ dispatch, index }} />
            break;
        case "Countdown": 
            blockToRender = <CountdownEditBlock {...passProps} {...{ dispatch, index }} />
            break;
        case "Tabata":
            blockToRender = <TabataEditBlock {...passProps} {...{ dispatch, index }} />
            break;
        case "XY": 
            blockToRender = <XYEditBlock {...passProps} {...{ dispatch, index }} />
            break;
        default:
            throw new Error("Unrecognized type of timer in EditBlock #" + index);
    }

    return (
        <CenteredBlock>
            <CenteredRow>
                <div>
                    <strong>Type:</strong>
                    <Dropdown value={type} onChange={(e) => dispatch({ type: "changePropVal", indexToChange: index, newValue: e.target.value, propName: "type" })} >
                        {timerTypes.map(timer => <option key={timer} value={timer}>{timer}</option>) }
                    </Dropdown>
                </div>
                <Button variant="danger" onClick={() => dispatch({ type: "removeTimer", indexToRemove: index })} >
                    <FontAwesomeIcon icon={faTrash} size="xs"/>
                </Button>
            </CenteredRow>
            { blockToRender }
        </CenteredBlock>
    );
};

const StopwatchEditBlock = (props) => {
    const { handleSetEndTime } = useContext(AppContext);
    const { endTime, index } = props;
    const { 0: hours = "", 1: minutes = "", 2: seconds = "" } = endTime || [];

    return (
        <>
            <TimeInputLabel>
                <strong>End Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}
                    onChange={(e) => handleSetEndTime(e, index, endTime )} />
            </TimeInputLabel>
        </>
    );
}

const CountdownEditBlock = (props) => {
    const { handleSetStartTime } = useContext(AppContext);
    const { startTime, index } = props;
    const { 0: hours = "", 1: minutes = "", 2: seconds = "" } = startTime || [];

    return (
        <>
            <TimeInputLabel>
                <strong>Start Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}
                    onChange={(e) => handleSetStartTime(e, index, startTime )} />
            </TimeInputLabel>
        </>
    );
}

const TabataEditBlock = (props) => {
    const { handleSetWorkTime, handleSetRestTime, handleChangeNumRounds } = useContext(AppContext);
    const { 
        workTime, restTime, numRounds, index
    } = props;

    const { 0: workHours = "", 1: workMinutes = "", 2: workSeconds = "" } = workTime || [];
    const { 0: restHours = "", 1: restMinutes = "", 2: restSeconds = "" } = restTime || [];

    return (
        <>
            <TimeInputLabel>
                <strong>Work Time:</strong>
                <TimeInput hoursVal={workHours} minutesVal={workMinutes} secondsVal={workSeconds}
                    onChange={(e) => handleSetWorkTime(e, index, workTime )}/>
            </TimeInputLabel>
            <TimeInputLabel>
                <strong>Rest Time:</strong>
                <TimeInput hoursVal={restHours} minutesVal={restMinutes} secondsVal={restSeconds}
                    onChange={(e) => handleSetRestTime(e, index, restTime )}/>
            </TimeInputLabel>
            <RoundsLabel>
                # of Rounds:
                <Input name="numRoundsTabata" value={numRounds} placeholder="1" onChange={(num) => handleChangeNumRounds(index, num)} />
            </RoundsLabel>
        </>
    );
}

const XYEditBlock = (props) => {
    const { handleSetStartTime, handleChangeNumRounds } = useContext(AppContext);
    const { 
        startTime, numRounds, index
    } = props;
    const { 0: hours = "", 1: minutes = "", 2: seconds = "" } = startTime || [];

    return (
        <>
            <TimeInputLabel>
                <strong>Start Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}
                    onChange={(e) => handleSetStartTime(e, index, startTime )} />
            </TimeInputLabel>
            <RoundsLabel>
                # of Rounds:
                <Input name="numRoundsXY" value={numRounds} placeholder="1" onChange={(num) => handleChangeNumRounds(index, num)} />
            </RoundsLabel>
        </>
    );
}


export default AddView;
