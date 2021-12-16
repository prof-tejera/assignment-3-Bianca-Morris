import React, { useContext } from "react";
import { faArrowLeft, faPlus, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AppContext } from "../context/AppProvider";

import { CustomDiv, Scrollable } from "../components/generic/styledComponents";
import { H1 } from "../utils/tokensAndTheme";
import { EditBlock } from "../components/add/EditBlock";
import Button from "../components/generic/Button";
import { Link } from "react-router-dom";
import { nullFx } from "../utils/constants";


const AddView = () => {
    const { routineState = [], dispatch } = useContext(AppContext);

    return (
        <CustomDiv flexDirection="column" alignItems="center" justifyContent="center">
            <H1>Add to Workout Routine</H1>

            <CustomDiv alignItems="center" justifyContent="center" marginTop="10px" marginBottom="10px">
               <Link to="/">
                    <Button variant="secondary" onClick={nullFx}>
                        <FontAwesomeIcon icon={faArrowLeft} size="xs"/>
                        Back to Timers
                    </Button>
                </Link>
            </CustomDiv>

            <Scrollable>
                {routineState.map((timer, i) => {
                    const { uuid } = timer;
                    return <EditBlock key={uuid} {...timer} index={i} {...{ dispatch }} />
                })}
            </Scrollable>

            <CustomDiv alignItems="center" justifyContent="center">
                <Button onClick={() => dispatch({ type: "addTimer" })}>
                    <FontAwesomeIcon icon={faPlus} size="xs"/>
                    Add New Timer
                </Button>
                { (routineState.length !== 0) &&
                    <Button variant="danger" onClick={() => dispatch({ type: "clearAll" })}>
                        <FontAwesomeIcon icon={faSync} size="xs"/>
                        Start Over
                    </Button>}
            </CustomDiv>
        </CustomDiv>
    );
};

export default AddView;
