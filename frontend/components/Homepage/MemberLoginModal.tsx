import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import Login from "../Signup/Login"
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
    open: boolean
    handleClose: () => void
}

export default function MemberLoginModal({open, handleClose}: IProps) {

    return (
        <Dialog open={open}>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem'}}>
                <Typography variant={'h6'}>
                    Already a Member? Login here!
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{padding: '2rem', paddingTop: '0px'}}>
                <Login />
            </DialogContent>
        </Dialog>
    )
}