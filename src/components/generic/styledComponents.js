import styled from "styled-components";

/**
 * Decided to try this towards the end of the project; if I had more time, I'd add more props to it and replace most of the basic
 * positioning/layout styled components with it, and pass the details in as props.
 */
export const CustomDiv = styled.div`
  display: flex;
  ${ props => props.justifyContent ? `justify-content: ${props.justifyContent};\n` : "justify-content: center;\n" }
  ${ props => props.alignItems ? `align-items: ${props.alignItems};\n` : "align-items: center;\n"}
  ${ props => props.width ? `width: ${props.width};\n` : ""}
  ${ props => props.flexDirection ? `flex-direction: ${props.flexDirection};\n`: ""}
  ${ props => props.marginTop ? `margin-top: ${props.marginTop};\n`: ""}
  ${ props => props.marginBottom ? `margin-bottom: ${props.marginBottom};\n`: ""}
  ${ props => props.marginLeft ? `margin-left: ${props.marginLeft};\n`: ""}
  ${ props => props.marginRight ? `margin-right: ${props.marginRight};\n`: ""}
  ${ props => props.paddingTop ? `padding-top: ${props.paddingTop};\n`: ""}
  ${ props => props.paddingBottom ? `padding-bottom: ${props.paddingBottom};\n`: ""}
  ${ props => props.paddingLeft ? `padding-left: ${props.paddingLeft};\n`: ""}
  ${ props => props.paddingRight ? `padding-right: ${props.paddingRight};\n`: ""}
  ${ props => props.backgroundColor ? `background-color: ${props.backgroundColor};\n`: ""}
`;

export const Scrollable = styled.div`
  max-height: 450px;
  overflow-y: scroll; 
`;

export const Dropdown = styled.select`
  padding: 5px;
  margin: 0 5px;
`;