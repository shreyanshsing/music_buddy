import { Box, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../Signup/redux/slice";
import Image from "next/image";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { UpdateUser } from "@/apis/patchData";
import { useSnackbar } from "notistack";
import { useState } from "react";

export default function RecentlyPlayed() {

    const user = useSelector(getUser)
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState<boolean>(false)

    const getImgLink = (link: string) => {
        const videoId = link.split('/')[3].split('?')[0]
        return `https://img.youtube.com/vi/${videoId}/default.jpg`
    }

    const handleClearAll = async() => {
        try {
            setLoading(true)
            const result = await UpdateUser({
                'id': user?.id,
                'clear_watch_list': true
            })
            dispatch(setUser(result?.data?.results))
            enqueueSnackbar('All Recently Watched Content Cleared!', {variant: 'success'})
        } catch (error: any) {
            console.log(error)
            enqueueSnackbar(error?.response?.data?.message ?? 'Failed to clear recently watched content', {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const switchContent = () => {
        if (user.recently_watched.length === 0) {
            return (
                <Typography textAlign={'center'} gutterBottom>No Recently Watched Content!</Typography>
            )
        } else {
            return (
                <List>
                    <ListItem onClick={() => handleClearAll()}>
                        <Button variant={'text'} startIcon={<ClearAllIcon/>} disabled={loading}>
                            {
                                loading ? <CircularProgress /> :  <Typography variant={'body1'}>Clear All</Typography>
                            }
                        </Button>
                    </ListItem>
                    {
                        user.recently_watched.map((item: string, index: number) => (
                            <ListItemButton key={index}>
                                <ListItemAvatar>
                                    <Image src={getImgLink(item)} alt={item} width={50} height={50}/> 
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={item}
                                />
                            </ListItemButton>
                        ))
                    }
                </List>
            )
        }
    }

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
                <Typography variant={'h5'} gutterBottom>Recently Watched &#128336;</Typography>
            </div>
            <List sx={{
                padding: '1rem 2rem'
            }}>
                {switchContent()}
            </List>
        </Box>
    )
}