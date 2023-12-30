import styled from "@emotion/styled";
import { Grid } from "@mui/material";

export const GridContainer = styled(Grid)`
    width: 100vw;
    height: 100vh;
    background: 
        linear-gradient(0deg, transparent 24px,#D3D3D3 25px,#D3D3D3 26px, transparent 27px, transparent 49px,#D3D3D3 50px,#D3D3D3 51px, transparent 52px),
        linear-gradient(90deg, transparent 24px,#D3D3D3 25px,#D3D3D3 26px, transparent 27px, transparent 49px,#D3D3D3 50px,#D3D3D3 51px, transparent 52px);
    background-size: 50px 50px;
    overflow: hidden;  
    font-family: 'Lazy Dog', sans-serif;
`