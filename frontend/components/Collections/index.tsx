import { Box, List, Typography } from "@mui/material";

export default function Collections() {

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
                <Typography variant={'h5'} gutterBottom>Collections &#128230;</Typography>
            </div>
            <List sx={{
                padding: '1rem 2rem'
            }}>
                {}
            </List>
        </Box>
    )
}