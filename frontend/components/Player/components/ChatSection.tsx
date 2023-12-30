import { Accordion, AccordionSummary, Box, Typography } from "@mui/material";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import LockIcon from '@mui/icons-material/Lock';

export default function ChatSection() {

    return (
        <Box sx={{
            marginTop: '1rem'
        }}>
            <Accordion sx={{border: '5px solid white', borderRadius: '11px'}}>
                <AccordionSummary sx={{background: '#6a4ea0'}} expandIcon={<UnfoldMoreIcon color={'primary'}/>}>
                    <Typography color={'white'} sx={{display: 'flex', alignItems: 'center'}} variant={'h6'} gutterBottom>
                        Chat Section <LockIcon color={'primary'} sx={{marginLeft: '0.5rem'}}/>
                    </Typography>
                </AccordionSummary>
            </Accordion>
        </Box>
    )
}