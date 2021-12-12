import { faPlus, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import Button from "../components/generic/Button";
import { RoundsLabel } from "../components/generic/DisplayRounds";
import Input from "../components/generic/Input";
import TimeInput, { TimeInputLabel } from "../components/generic/TimeInput";


import { H1, themeColors } from "../utils/tokensAndTheme";

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

const initialState = { type: "Stopwatch", status: "not started", endTime: ["", 1, 0] };
const timerTypes = ["Stopwatch", "Countdown", "Tabata", "XY"];

const reducer = (state, action) => {
    switch(action.type) {
        case 'addTimer':
            return [...state, initialState ];
        case 'removeTimer':
            return state.filter((timer, i) => i !== action.indexToRemove);
        case 'clearAll':
            return [initialState];
        case 'changePropVal':
            const { indexToChange, propName, newValue } = action;
            const newState = [];
            for (let i=0; i < state.length; i++) {
                if (i !== indexToChange) {
                    newState.push(state[i]);
                } else {
                    const updated = {...state[i]};
                    updated[propName] = newValue;
                    newState.push(updated);
                }
            }
            return newState;
        default:
            throw new Error("Undefined action passed into reducer.");
    }
}

const AddView = () => {
    const [ routineState, dispatch ] = useReducer(reducer, [initialState]);
    return (
        <CenteredCol>
            <H1>Add to Workout Routine</H1>

            <Scrollable>
                {routineState.map((timer, i) => {
                    return <EditBlock {...timer} index={i} {...{dispatch}} />
                })}
            </Scrollable>
            

            <CenteredRow>
                <Button onClick={() => dispatch({ type: "addTimer" })}>
                    <FontAwesomeIcon icon={faPlus} size="xs"/>
                    Add New
                </Button>
                <Button variant="danger" onClick={() => dispatch({ type: "clearAll" })}>
                    <FontAwesomeIcon icon={faSync} size="xs"/>
                    Reset
                </Button>
            </CenteredRow>
        </CenteredCol>
    );
};

const EditBlock = (props) => {
    const { type, dispatch, index, ...passProps } = props;
    
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
                    <select value={type} onChange={(e) => dispatch({ type: "changePropVal", indexToChange: index, newValue: e.target.value, propName: "type" })} >
                        {timerTypes.map(timer => <option value={timer}>{timer}</option>) }
                    </select>
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
    const { endTime: [ hours = "", minutes = "", seconds = "" ] = [] } = props;

    return (
        <>
            <TimeInputLabel>
                <strong>End Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}/>
            </TimeInputLabel>
        </>
    );
}

const CountdownEditBlock = (props) => {
    const { startTime: [ hours = "", minutes = "", seconds = "" ] = [] } = props;

    return (
        <>
            <TimeInputLabel>
                <strong>Start Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}/>
            </TimeInputLabel>
        </>
    );
}

const TabataEditBlock = (props) => {
    const { 
        workTime: [ workHours = "", workMinutes = "", workSeconds = "" ] = [],
        restTime: [ restHours = "", restMinutes = "", restSeconds = "" ] = [],
        numRounds
    } = props;

    return (
        <>
            <TimeInputLabel>
                <strong>Work Time:</strong>
                <TimeInput hoursVal={workHours} minutesVal={workMinutes} secondsVal={workSeconds}/>
            </TimeInputLabel>
            <TimeInputLabel>
                <strong>Rest Time:</strong>
                <TimeInput hoursVal={restHours} minutesVal={restMinutes} secondsVal={restSeconds}/>
            </TimeInputLabel>
            <RoundsLabel>
                # of Rounds:
                <Input name="numRoundsTabata" value={numRounds} placeholder="1" onChange={() => console.log("needs work")}/>
            </RoundsLabel>
        </>
    );
}

const XYEditBlock = (props) => {
    const { 
        startTime: [ hours = "", minutes = "", seconds = "" ] = [],
        numRounds
    } = props;

    return (
        <>
            <TimeInputLabel>
                <strong>Start Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}/>
            </TimeInputLabel>
            <RoundsLabel>
                # of Rounds:
                <Input name="numRoundsXY" value={numRounds} placeholder="1" onChange={() => console.log("needs work")}/>
            </RoundsLabel>
        </>
    );
}


export default AddView;
