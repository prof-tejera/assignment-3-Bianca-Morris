import React from "react";
import styled from "styled-components";
import { transformTimeUnitToDisplayString } from "../../utils/helpers";
import { globalPropTypes } from "../../utils/globalPropTypes";

const Time = styled.div`
    font-size: 4em;
    font-family: 'SourceCodePro';
`;

const DisplayTime = (props) => {
    const { hours, minutes, seconds } = props;
    return (
        <Time id="display-time">
            {transformTimeUnitToDisplayString(hours || 0, "h")}:
            {transformTimeUnitToDisplayString(minutes || 0, "m")}:
            {transformTimeUnitToDisplayString(seconds|| 0, "s")}
        </Time>
    );
}
DisplayTime.propTypes = {
    hours: globalPropTypes.hours,
    minutes: globalPropTypes.minutes,
    seconds: globalPropTypes.seconds
}
DisplayTime.defaultProps = {
    hours: 0,
    minutes: 0,
    seconds: 0,
}

export default DisplayTime;