import styled from "@emotion/styled";
import { ButtonHTMLAttributes, ReactNode } from "react";

const StyledButton = styled.button`
    padding: 1rem 5rem;
    border: 2px groove black;
    color: black;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    border-radius: 0px;
    font-size: 1rem;
    letter-spacing: 0.1rem;
    transform: skewX(-15deg);
    transition: all 0.3s;
    &:hover {
        transform: skewX(0deg);
        transition: all 0.3s;
        background-color: whitesmoke;
    }
`

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function CustomButton({children, ...props}: CustomButtonProps) {
    return (
        <StyledButton {...props}>
            {children}
        </StyledButton>
    )
}