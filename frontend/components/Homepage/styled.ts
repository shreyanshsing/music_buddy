import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";

export const HomepageContainer = styled(Box)`
    width: 70%;
    height: 70%;
    background-color: #6a4ea0;
    border-radius: 11px;
    color: white;
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    position: relative;
    overflow: hidden;
`

export const GridContainer = styled(Grid)`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`