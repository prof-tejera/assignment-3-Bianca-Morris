import React, { useContext } from "react";

import TimeInput, { TimeInputLabel } from "../generic/TimeInput";
import Input from "../generic/Input";
import { RoundsLabel } from "../generic/DisplayRounds";
import { AppContext } from "../../context/AppProvider";

/* Used in AddView.js and contains a timer-specific version of each edit block; the parent common to all edit blocks
is located in ./EditBlock.js */
export const StopwatchEditBlock = (props) => {
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

export const CountdownEditBlock = (props) => {
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

export const TabataEditBlock = (props) => {
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

export const XYEditBlock = (props) => {
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
