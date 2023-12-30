import Layout from "@/layout";
import { Box, Typography } from "@mui/material";

export default function InviteList() {
    
    return (
        <Box
            sx={{
                boxShadow: '2px 2px 5px lightgray', 
                width: '100%', 
                height: 'fit-content', 
                borderRadius: '5px', 
                marginTop: '1rem',
                backgroundColor: 'white'
            }}
        >
            <div style={{
                backgroundColor: '#efc11b',
                color: 'white',
                borderRadius: '5px 5px 0 0',
                padding: '1rem 2rem',
            }}>
                <Typography variant={'h5'} gutterBottom>Invitations &#128722;</Typography>
            </div>

        </Box>
    )
}