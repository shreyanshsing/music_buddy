import { Avatar, Box, Button, ButtonGroup, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Rating, TextField, Tooltip, Typography } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Signup/redux/slice";
import { ChangeEvent, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import { useSnackbar } from "notistack";
import { FetchFriends, GetUserDetails } from "@/apis/fetchData";

export default function FriendsList() {

    const router = useRouter()
    const {userID} = router?.query
    const user = useSelector(getUser)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [friendsList, setFriendsList] = useState<any[]>([])
    const [search, setSearch] = useState<string>('')
    const [debounce] = useDebounce(search, 500)
    const socket = new WebSocket(`ws://localhost:9988/music_buddy/${userID ?? user.id}`)
    const {enqueueSnackbar} = useSnackbar()
    
    useEffect(() => {
        socket.onopen = () => {
            console.log('connected to invite server')
        }

        socket.onmessage = (event: MessageEvent<any>) => {
            console.log('event', JSON.parse(event.data))
            const response = JSON.parse(event.data)
            if (response.type === "error") {
                enqueueSnackbar(response.message, {variant: 'error'})
                return
            }
            if (response.type === "success") {
                enqueueSnackbar('Invite sent successfully', {variant: 'success'})
            }
        }

        socket.onclose = () => {
            console.log('connection closed')
        }

    }, [socket])

    useEffect(() => {
        (async () => {
            try {
                if (userID) {
                    setLoading(true)
                    setError('')
                    const result = await FetchFriends({userId: userID, userName: debounce})
                    if(result?.data?.results) {
                        const results = await Promise.all(result?.data?.results?.map(async(friend: string) => await GetUserDetails({userId: friend})))
                        setFriendsList(results.map((result: any) => result?.data?.results))
                    } else {
                        setFriendsList([])
                    }
                }
            } catch (error: any) {
                console.log('error', error)
                setError(error?.response?.data?.message ?? 'Failed to fetch friends list.')
            } finally {
                setLoading(false)
            }
        })()
    }, [dispatch, userID, debounce])

    const sendInvite = (receiverId: string) => {
        socket.send(JSON.stringify({
            type: 'send-invite',
            sender_id: `${userID}`,
            receiver_id: `${receiverId}`
        }))
    }

    const switchContent = () => {
        if (loading) {
            return <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><CircularProgress /></Box>
        } if (error) {
            return <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><Typography color={'error'}>{error}</Typography></Box>
        } if (!friendsList || friendsList?.length === 0) {
            if (debounce) {
                return <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><Typography>No user found.</Typography></Box>
            }
            return <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><Typography>Alright! you got no friends, got it.</Typography></Box>
        } else {
            return (friendsList)?.map((friend: any) => (
                <ListItem 
                    key={friend?.id} 
                    style={{
                        boxShadow: '2px 2px 3px lightgray',
                        marginBottom: '0.5rem',
                        borderRadius: '5px'
                    }} 
                    divider
                >
                    <ListItemAvatar>
                        <Avatar variant={'rounded'} src={'https://buffer.com/library/content/images/2023/10/free-images.jpg'} />
                    </ListItemAvatar>
                    <ListItemText primary={`${friend?.name ?? friend?.user_name}`} secondary={<Rating value={friend?.rating} max={5} precision={0.5} readOnly />} />
                    <ListItemSecondaryAction>
                        <ButtonGroup>
                            <Tooltip title={'Invite'}>
                                <IconButton onClick={() => sendInvite(friend?.id)}>
                                    <AddIcon color={'primary'} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Remove'}>
                                <IconButton>
                                    <DeleteIcon color={'error'} />
                                </IconButton>
                            </Tooltip>
                        </ButtonGroup>
                    </ListItemSecondaryAction>
                </ListItem>
            ))
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
                <Typography variant={'h5'} gutterBottom>Buddy List &#128170;</Typography>
            </div>
            <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem 2rem'
            }}>
                <TextField size={'small'} margin={'dense'} variant={'outlined'} placeholder={'Search by user name'} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} fullWidth/>
                <Button variant={'text'} style={{marginLeft: '1rem'}} startIcon={<SortIcon />}>Sort</Button>
            </div>
            <List sx={{
                padding: '1rem 2rem'
            }}>
                {switchContent()}
            </List>
        </Box>
    )
}