import React from "react";
import styled from "styled-components";

import { globalPropTypes } from "../../utils/globalPropTypes";
import Input from "../generic/Input";

export const TimeInputLabel = styled.div`
  display: flex;
  align-items: center;
  font-family: BubblegumSans;
  width: 100%;
  justify-content: center;
`;

const TimeInputWrapper = styled.div`
    display: flex;
    width: 200px;
    justify-content: space-between;
    margin: 10px 5px;
`;

const TimeInput = (props) => {
    const { disabled, hoursVal, minutesVal, secondsVal, onChange } = props;
    return (
        <TimeInputWrapper>
            <Input placeholder="HH" value={hoursVal} type="number" name="hourInput" min="0" max="24" {...{ disabled, onChange }} />
            <Input placeholder="MM" value={minutesVal} type="number" name="minuteInput" min="0" max="59" {...{ disabled, onChange }} />
            <Input placeholder="SS" value={secondsVal} type="number" name="secondInput" min="0" max="59" {...{ disabled, onChange }} />
        </TimeInputWrapper>
    )
}
TimeInput.propTypes = {
    hoursVal: globalPropTypes.hours,
    minutesVal: globalPropTypes.minutes,
    secondsVal: globalPropTypes.seconds,
    onChange: globalPropTypes.onChange.isRequired,
    disabled: globalPropTypes.disabled
}
TimeInput.defaultProps = {
    disabled: false,
    hoursVal: 0,
    minutesVal: 0,
    secondsVal: 0
}

export default TimeInput;
