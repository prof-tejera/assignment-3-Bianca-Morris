import React, { useState } from "react";
import styled from "styled-components";

import DocumentComponent from "../components/documentation/DocumentComponent";

import Loading from "../components/generic/Loading";
import Button from "../components/generic/Button";
import Input from "../components/generic/Input";
import DisplayTime from "../components/generic/DisplayTime";
import DisplayRounds from "../components/generic/DisplayRounds";
import Panel from "../components/generic/Panel";
import TimeInput from "../components/generic/TimeInput";
import TimerControls from "../components/generic/TimerControls";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2rem;
  margin-top: 25px;
  font-family: Lobster;
`;

const Documentation = () => {

  const [ inputValue, setInputValue ] = useState("Test");
  
  return (
    <Container>
      <div>
        <Title>Documentation</Title>
        <DocumentComponent
          title="Loading spinner "
          component={<Loading />}
          propDocs={[
            {
              prop: "size",
              description: "Changes the size of the loading spinner",
              type: "string",
              defaultValue: "'medium'",
            },
          ]}
        />
        <DocumentComponent
          title="Button "
          component={<Button onClick={() => alert("You clicked the button!")} />}
          propDocs={[
            {
              prop: "type",
              description: "HTML attribute type of the button ('button' | 'submit' | 'reset')",
              type: "string",
              defaultValue: "'button'",
            },
            {
              prop: "disabled",
              description: "Is the button clickable?",
              type: "boolean",
              defaultValue: "false",
            },
            {
              prop: "onClick",
              description: "Function defining what to do when button is clicked",
              type: "function",
              defaultValue: "undefined",
            },
            {
              prop: "variant",
              description: "One of: ('primary' | 'secondary' | 'danger')",
              type: "string",
              defaultValue: "'primary'",
            },
            {
              prop: "children",
              description: "What to render inside of the button",
              type: "node OR array of nodes",
              defaultValue: "'Click Me'",
            },
          ]}
        />
        <DocumentComponent
          title="Input "
          component={<Input name="docInput" onChange={setInputValue} value={inputValue} />}
          propDocs={[
            {
              prop: "type",
              description: "HTML attribute type of the input ('text' | 'number' | 'submit')",
              type: "string",
              defaultValue: "'text'",
            },
            {
              prop: "placeholder",
              description: "Placeholder text for the input",
              type: "string",
              defaultValue: "'Enter text here...'"
            },
            {
              prop: "disabled",
              description: "Is is possible to enter text?",
              type: "boolean",
              defaultValue: "false",
            },
            {
              prop: "onChange",
              description: "Function defining what to do when text is updated",
              type: "function",
              defaultValue: "undefined",
            },
            {
              prop: "name",
              description: "An identifier for this input",
              type: "string",
              defaultValue: "undefined",
            },
            {
              prop: "value",
              description: "Current value of the input (should match 'type' prop)",
              type: "string or number",
              defaultValue: "''",
            },
            {
              prop: "min",
              description: "If type is number, this will be used as the minimum the field accepts",
              type: "string",
              defaultValue: "undefined",
            },
            {
              prop: "max",
              description: "If type is number, this will be used as the maximum the field accepts",
              type: "string",
              defaultValue: "undefined"
            }
          ]}
        />
        <DocumentComponent
          title="Display Time "
          component={<DisplayTime hours={0} minutes={0} seconds={0} />}
          propDocs={[
            {
              prop: "hours",
              description: "A numeric representation of hours; max 2 digits",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "minutes",
              description: "A numeric representation of minutes; max 2 digits",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "seconds",
              description: "A numeric representation of seconds; max 2 digits",
              type: "number",
              defaultValue: "0",
            },
          ]}
        />
        <DocumentComponent
          title="Display Rounds "
          component={<DisplayRounds />}
          propDocs={[
            {        
              prop: "currRound",
              description: "The current round",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "totalRounds",
              description: "The total number of rounds selected",
              type: "number",
              defaultValue: "0"
            },
            {
              prop: "isRest",
              description: "Is this a rest interval?",
              type: "boolean",
              defaultValue: "false",
            },
          ]}
        />
        <DocumentComponent
          title="Panel "
          component={<Panel children={<div/>}/>}
          propDocs={[
            {        
              prop: "children",
              description: "React children to render inside of the panel",
              type: "node or array of nodes",
              defaultValue: "undefined",
            },
          ]}
        />
        <DocumentComponent
          title="TimeInput "
          component={<TimeInput onChange={() => console.log("timeinput")}/>}
          propDocs={[
            {
              prop: "hoursVal",
              description: "A numeric representation of hours; max 2 digits",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "minutesVal",
              description: "A numeric representation of minutes; max 2 digits",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "secondsVal",
              description: "A numeric representation of seconds; max 2 digits",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "disabled",
              description: "Should the inputs be disabled or enabled?",
              type: "boolean",
              defaultValue: "false"
            },
            {
              prop: "onChange",
              description: "A single function to handle updates for hours, minutes and seconds",
              type: "function",
              defaultValue: "undefined"
            }
          ]}
        />
        <DocumentComponent
          title="TimerControls "
          component={<TimerControls  startDisabled={true} stopDisabled={true} resetDisabled={true} />}
          propDocs={[
            {
              prop: "startDisabled",
              description: "Should start button be disabled?",
              type: "boolean",
              defaultValue: "false",
            },
            {
              prop: "stopDisabled",
              description: "Should stop button be disabled?",
              type: "boolean",
              defaultValue: "false"
            },
            {
              prop: "resetDisabled",
              description: "Should reset button be disabled?",
              type: "boolean",
              defaultValue: "false"
            },
            {
              prop: "resumeDisabled",
              description: "Should resume button be disabled?",
              type: "boolean",
              defaultValue: "false"
            },
            {
              prop: "hideResume",
              description: "Should resume button be hidden altogether?",
              type: "boolean",
              defaultValue: "false"
            },
            {
              prop: "hideReset",
              description: "Should reset button be hidden altogether?",
              type: "boolean",
              defaultValue: "false"
            },
            {
              prop: "context (not technically a prop...)",
              description: "This component needs to use global AppContext for event handlers and conditional display.",
              type: "object",
              defaultValue: "undefined"
            }
          ]}
        />
      </div>
    </Container>
  );
}

export default Documentation;
