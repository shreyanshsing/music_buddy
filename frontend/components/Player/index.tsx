import { Box, Button, ButtonGroup, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../Signup/redux/slice";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import LinkIcon from '@mui/icons-material/Link';
import { PLAYER_IMG_SRC } from "./data";
import { RotatingImage } from "./styled";
import { useState } from "react";
import LinkModal from "./components/LinkModal";
import CustomPlayer from "./components/CustomPlayer";
import { UpdateUser } from "@/apis/patchData";


export default function Player() {

    const user = useSelector(getUser)
    const [openLinkModal, setOpenLinkModal] = useState<boolean>(false)
    const [showCustomPlayer, setShowCustomPlayer] = useState<boolean>(false)
    const [link, setLink] = useState<string>('')
    const [error, setError] = useState<string>('')
    const dispatch = useDispatch()

    console.log('user---', user)

    const handleLink = async(link: string) => {
        try {
            if (link) {
                const result = await UpdateUser({
                    id: user?.id,
                    recently_watched: link
                })
                dispatch(setUser(result?.data?.results))
                setLink(link)
                setShowCustomPlayer(true)
            }
        } catch (error: any) {
            console.log(error)
            setError(error?.response?.data?.message ?? 'Failed to play this video, please try again')
        }
    }

    return (
        <Box 
            sx={{
                boxShadow: '2px 2px 5px lightgray',
                borderRadius: '5px', 
                margin: '1rem auto',
                backgroundColor: '#efc11b',
                color: 'white',
                padding: '2rem'
            }}
        >
            {
                showCustomPlayer ? (
                    <CustomPlayer link={link}/>
                ) : (
                    <Grid 
                        container
                        spacing={1}
                        rowGap={1}
                        columnGap={1}
                    >
                        <Grid item lg={12}>
                            <Typography variant={'h5'} textAlign={'center'} gutterBottom>
                                Welcome! {user?.name ?? user?.user_name ?? '--'}
                            </Typography>
                        </Grid>
                        <Grid item lg={12}>
                            <Box sx={{width: '100%', textAlign: 'center', margin: '1rem'}}>
                                <RotatingImage 
                                    src={`${PLAYER_IMG_SRC}`} 
                                    alt={'player-img'}
                                />
                            </Box>
                            <Typography variant={'h6'} textAlign={'center'} gutterBottom>
                                To get started, please provide a video link/ upload video from your device
                            </Typography>
                            <ButtonGroup fullWidth variant={'text'} sx={{backgroundColor: 'white'}}>
                                <Button sx={{color: '#6a4ea0'}}>
                                    <Typography component={'span'} gutterBottom>
                                        <DriveFolderUploadIcon fontSize={'large'} /> <br/ >
                                        Upload from Device
                                    </Typography>
                                </Button>
                                <Button sx={{color: '#6a4ea0'}} onClick={() => setOpenLinkModal(true)}>
                                    <Typography component={'span'} gutterBottom>
                                        <LinkIcon fontSize={'large'} /> <br/ >
                                        Link to Video
                                    </Typography>
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                )
            }
            {
                openLinkModal && (<LinkModal error={error} setError={setError} open={openLinkModal} setOpen={setOpenLinkModal} handleLink={handleLink} />)
            }
        </Box>
    )
}
