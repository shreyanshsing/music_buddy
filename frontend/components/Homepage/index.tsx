import { Grid, Typography } from "@mui/material";
import { GridContainer } from "./styled";
import { useState } from "react";
import PlayerCard from "./PlayerCard";
import CustomButton from "../UIComponents/CustomButton";
import MemberLoginModal from "./MemberLoginModal";
import Layout from "@/layout";

export default function Homepage() {

    const [openMemberLoginModal, setOpenMemberLoginModal] = useState<boolean>(false)

    const handleClick = () => {
        setOpenMemberLoginModal(true)
    }

    return (
        <Layout>
            <GridContainer spacing={2} sx={{padding: '3rem'}} container>
                <Grid lg={4} item>
                    <img src="/Homepage_Svg_1.svg" alt="Homepage Image" style={{width: '100%', marginTop: '5rem'}} />
                </Grid>
                <Grid lg={8} sx={{position: 'relative', width: 'fit-content'}} item>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px'
                    }}>
                        <PlayerCard />
                    </div>
                    <Grid container spacing={3} sx={{ margin: '5rem'}}>
                        <Grid lg={12} item>
                            <Typography 
                                style={{
                                    backgroundColor: '#A1D683',
                                    width: 'fit-content',
                                    padding: '1rem 3rem',
                                    borderRadius: '10px 50px 100px 12px'
                                }}
                                variant={'h4'}
                            >
                                MUSIC BUDDY
                            </Typography>
                        </Grid>
                        <Grid lg={12} item>
                            <Typography 
                                style={{
                                    width: '500px',
                                    margin: 'auto 1rem',
                                    fontWeight: '500'
                                }} 
                                variant={'h2'}
                            >
                                STREAM & PLAY LOCAL / ONLINE MUSIC WITH YOUR FRINEDS 
                            </Typography>
                        </Grid>
                        <Grid lg={12} item>
                            <Typography 
                                style={{
                                    backgroundColor: '#65C4EB',
                                    width: 'fit-content',
                                    padding: '1rem 3rem',
                                    borderRadius: '10px 50px 100px 12px'
                                }} 
                                variant={'h4'}
                            >
                                DEVELOPED BY : SHREYANSH SINGH
                            </Typography>
                        </Grid>
                        <Grid lg={12} item>
                            <CustomButton onClick={() => handleClick()}>
                                Get Started
                            </CustomButton>
                        </Grid>
                    </Grid>
                </Grid>
                {
                    openMemberLoginModal && (
                        <MemberLoginModal open={openMemberLoginModal} handleClose={() => setOpenMemberLoginModal(false)}/>
                    )
                }
            </GridContainer>
        </Layout>
    )
}