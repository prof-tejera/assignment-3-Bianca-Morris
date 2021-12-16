import React from "react";
import styled from "styled-components";
import { themeColors } from "./../../utils/tokensAndTheme";
import { globalPropTypes } from "../../utils/globalPropTypes";

const ImageBackgroundPane = styled.div`
    background: linear-gradient(120deg, ${themeColors.timerBgGradient1}, ${themeColors.timerBgGradient2}), url('/assignment-3-Bianca-Morris/maarten-van-den-heuvel-unsplash-sm.jpg');
    height: 390px;
    width: 550px;
    border-radius: 0 20px 20px 0;
    padding: 15px 20px 5px 20px;
    background-position: center;
    background-size: cover;
`;

const InnerPane = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-shrink: 0;
    border-radius: 20px;
    border: 4px dotted #FFFFFF;
    height: 380px;
    width: 100%;
    color: ${themeColors.textLight};
`;


const Panel = (props) => {
    const { children } = props;
    return (
        <ImageBackgroundPane>
            <InnerPane>
            { children }
            </InnerPane>  
        </ImageBackgroundPane>
    );   
}
Panel.propTypes = {
    children: globalPropTypes.children.isRequired,
}

export default Panel;