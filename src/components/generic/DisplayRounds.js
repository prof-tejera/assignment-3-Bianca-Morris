import React from "react";
import styled from "styled-components";
import { globalPropTypes } from "../../utils/globalPropTypes";

export const RoundsLabel = styled.div`
  font-family: BubblegumSans;
  padding-bottom: 15px;
  padding-top: 10px;
`;

const Rounds = styled.div`
  font-size: 25px;
  font-family: BubblegumSans;
`;

const DisplayRounds = (props) => {
  const { currRound, totalRounds, isRest } = props;
  return (
    <Rounds>
        (Round: {currRound}
        {totalRounds > 0 && <span> of {totalRounds}</span>}
        { isRest && <span> - Rest</span>})
    </Rounds>
  );
}
DisplayRounds.propTypes = {
    totalRounds: globalPropTypes.totalRounds,
    currRound: globalPropTypes.currRound,
    isRest: globalPropTypes.isRest
}
DisplayRounds.defaultProps = {
    totalRounds: 0,
    currRound: 0,
    isRest: false
}

export default DisplayRounds;