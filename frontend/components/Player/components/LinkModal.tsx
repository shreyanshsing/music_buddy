import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { ChangeEvent, useState } from "react";

interface IProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleLink: (link: string) => void;
    error: string
    setError: (str: string) => void
}

export default function LinkModal({open, setOpen, handleLink, error, setError}: IProps) {

    const [link, setLink] = useState<string>('')
    
    return (
        <Dialog open={open}>
            <DialogTitle>
                Link to Video
            </DialogTitle>
            <DialogContent>
                <Typography 
                    sx={{
                        border: '2px solid #32a9db', 
                        backgroundColor: '#76c6e8',
                        padding: '1rem',
                        borderRadius: '5px',
                        alignItems: 'center',
                        display: 'flex'
                    }} 
                    color={'white'}
                >
                    <InfoIcon sx={{marginRight: '1rem'}}/>
                    <span>
                        Higher quality videos provide a better experience.
                    </span>
                </Typography>
                <TextField
                    sx={{marginTop: '2rem'}}
                    placeholder={'enter link here'}
                    variant={'standard'}
                    value={link}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setLink(e.target.value)
                        setError('')
                    }}
                    fullWidth
                    required
                />
                {
                    error && (
                        <Typography sx={{color: 'red'}}>{error}</Typography>
                    )
                }
            </DialogContent>
            <DialogActions sx={{justifyContent: 'flex-end', gap: '1rem', marginRight: '1rem', marginBlock: '1rem'}}>
                <Button variant={'text'} onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button 
                    variant={'contained'} 
                    disabled={!link} 
                    onClick={() => {
                        handleLink(link) 
                        setOpen(false)
                    }}
                >
                    Proceed
                </Button>
            </DialogActions>
        </Dialog>
    )
}