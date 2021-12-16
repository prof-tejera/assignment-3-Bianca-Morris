import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { CustomDiv, Dropdown } from "../generic/styledComponents";
import { CountdownEditBlock, StopwatchEditBlock, TabataEditBlock, XYEditBlock } from "./TimerSpecificEditBlocks";
import Button from "../generic/Button";
import { timerTypes } from "../../utils/constants";

/* Used in AddView.js and contains features common to all timers; a timer-specific version of each edit block
is located in ./TimerSpecificEditBlocks */
export const EditBlock = (props) => {
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
        <CustomDiv flexDirection="column" paddingTop="20px" paddingBottom="20px" paddingLeft="40px" paddingRight="40px" backgroundColor="#ffffff" marginTop="10px">
            <CustomDiv alignItems="center" justifyContent="center">
                <div>
                    <strong>Type:</strong>
                    <Dropdown value={type} onChange={(e) => dispatch({ type: "changePropVal", indexToChange: index, newValue: e.target.value, propName: "type" })} >
                        {timerTypes.map(timer => <option key={timer} value={timer}>{timer}</option>) }
                    </Dropdown>
                </div>
                <Button variant="danger" onClick={() => dispatch({ type: "removeTimer", indexToRemove: index })} >
                    <FontAwesomeIcon icon={faTrash} size="xs"/>
                </Button>
            </CustomDiv>
            { blockToRender }
        </CustomDiv>
    );
};