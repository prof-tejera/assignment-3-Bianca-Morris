import { faPlus, faSync, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import Button from "../components/generic/Button";
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
`

const initialState = { type: "Stopwatch", status: "not started", endTime: ["", 1, 0] };

const reducer = (state, action) => {
    switch(action.type) {
        case 'addTimer':
            return [...state, initialState ];
        case 'removeTimer':
            // find state[action.indexToRemove]
            return [];
        case 'clearAll':
            return [initialState];
        case 'changeType':
            state[action.indexToChange].type = action.newType;
            return state;
        default:
            throw new Error("Undefined action passed into reducer.");
    }
}

const AddView = () => {
    const [ routineState, dispatch ] = useReducer(reducer, [initialState]);
    return (
        <CenteredCol>
            <H1>Add to Workout Routine</H1>

            {routineState.map(timer => {
                return <EditBlock {...timer} />
            })}

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
    const { type = null, ...passProps } = props;
    
    let blockToRender;
    switch (type) {
        case "Stopwatch": 
            blockToRender = <StopwatchEditBlock {...passProps} />
            break;
        default:
            blockToRender = "lol unfinished";
            break;
    }

    const timerTypes = ["Stopwatch", "Countdown", "Tabata", "XY"];

    return (
        <CenteredBlock>
            <CenteredRow>
                <div>
                    <strong>Type:</strong>
                    <select value={type}>
                        {timerTypes.map(timer => <option value={timer}>{timer}</option>) }
                    </select>
                </div>
                <Button variant="danger" onClick={() => console.log("button clicked")} >
                    <FontAwesomeIcon icon={faTrash} size="xs"/>
                </Button>
            </CenteredRow>
            { blockToRender }
        </CenteredBlock>
    );
};

const StopwatchEditBlock = (props) => {
    const { endTime: [ hours = "", minutes = "", seconds = "" ] = ["", "", ""] } = props;

    return (
        <>
            <TimeInputLabel>
                <strong>End Time:</strong>
                <TimeInput hoursVal={hours} minutesVal={minutes} secondsVal={seconds}/>
            </TimeInputLabel>
        </>
    );
}


export default AddView;
