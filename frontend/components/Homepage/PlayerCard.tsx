import { Box, ButtonGroup, Card, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function PlayerCard() {
    return (
        <Card sx={{display: 'flex', width: 'fit-content'}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent>
                    <Typography variant={'h6'} gutterBottom>
                        MUSIC BUDDY
                    </Typography>
                    <Typography variant={'subtitle2'} gutterBottom>
                        Shreyansh Singh 
                    </Typography>
                    <ButtonGroup>
                        <IconButton>
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton>
                            <PlayArrowIcon />
                        </IconButton>
                        <IconButton>
                            <SkipNextIcon />
                        </IconButton>
                    </ButtonGroup>
                </CardContent>
            </Box>
            <CardMedia
                component={'img'}
                sx={{width: '150px'}}
                image={'/Mac_Miller_Live_from_Space.jpg'}
                alt={'Live from space'}
            />
        </Card>
    )
}