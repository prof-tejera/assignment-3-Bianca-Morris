import React from "react";
import styled from "styled-components";

import { globalPropTypes } from "../../utils/globalPropTypes";
import { themeColors } from "../../utils/tokensAndTheme";

export const ButtonSpacer = styled.div`
    width: 300px;
    justify-content: space-evenly;
    display: flex;
`;

const BaseButton = styled.button`
    color: ${themeColors.textLight};
    border: none;
    border-radius: 5px;
    padding: 3px 10px;
    font-size: 20px;
    font-weight: 700;
    font-family: SourceCodePro;
    :disabled {
        background-color: ${themeColors.btnDisabled};
        cursor: not-allowed;
        :hover {
            background-color: ${themeColors.btnDisabled};
        }
    }
`;

const ButtonPrimary = styled(BaseButton)`
    background-color: ${themeColors.btnPrimary};
    :hover {
        background-color: ${themeColors.btnPrimaryHover};
    }
`;

const ButtonSecondary = styled(BaseButton)`
    background-color: ${themeColors.btnSecondary};
    :hover {
        background-color: ${themeColors.btnSecondaryHover};
    }
`;

const ButtonDanger = styled(BaseButton)`
    background-color: ${themeColors.btnDanger};
    :hover {
        background-color: ${themeColors.btnDangerHover};
    }
`;

const Button = (props) => {
    const { children, variant, ...passProps } = props;

    switch(variant) {
        case "secondary":
            return (
                <ButtonSecondary {...passProps}>{children}</ButtonSecondary>
            );
        case "danger": 
            return (
                <ButtonDanger {...passProps}>{children}</ButtonDanger>
            );
        case "primary":
        default: 
            return (
                <ButtonPrimary {...passProps}>{children}</ButtonPrimary>
            );
    }
}
Button.propTypes = {
    variant: globalPropTypes.variant,
    type: globalPropTypes.buttonType,
    disabled: globalPropTypes.disabled,
    children: globalPropTypes.children,
    onClick: globalPropTypes.onClick.isRequired,
}
Button.defaultProps = {
    type: "button",
    disabled: false,
    variant: "primary",
    children: "Click me"
}

export default Button;
