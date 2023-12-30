import { CreateUser } from "@/apis/postData";
import { GridContainer } from "@/components/Homepage/styled";
import Layout from "@/layout";
import { Grid, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";


export default function Signup() {

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                setError('Passwords do not match')
            }
        }
        return () => {
            setError('')
        }
    }, [confirmPassword, password])

    const isButtonDisabled = () => {
        if (!username || !email || !password || !confirmPassword) {
            return true
        }
        if (password !== confirmPassword) {
            return true
        }
        return false
    }

    const handleSubmit = async() => {
        try {
            setLoading(true)
            await CreateUser({user_name: username, email, password})
            enqueueSnackbar('Account created successfully', {variant: 'success'})
        } catch (error: any) {
            setError(error?.response?.data?.message ?? 'Failed to create account.')
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Layout>
            <GridContainer container>
                <Grid item lg={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={'/Signup_1.svg'} alt={'Signup_Image_1'} style={{width: '150px', marginRight: '1.5rem'}} />
                    <Typography variant={'h3'}>
                        Welcome to Music Buddy!
                    </Typography>
                    <img src={'/Signup_2.svg'} alt={'Signup_Image_2'} style={{width: '150px', marginLeft: '1.5rem'}} />
                </Grid>
                <Grid item lg={3} />
                <Grid item lg={6}>
                    <Grid rowGap={3} container>
                        <Grid item lg={12}>
                            <TextField
                                type={'email'}
                                label={'Email'} 
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item lg={12}>
                            <TextField
                                type={'text'}
                                label={'Username'}
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item lg={12}>
                            <TextField 
                                type={'password'}
                                label={'Password'}
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item lg={12}>
                            <TextField 
                                type={'password'}
                                label={'Confirm Password'}
                                value={confirmPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        {
                            error && (
                                <Grid item lg={12}>
                                    <Typography variant={'subtitle1'} color={'red'}>
                                        {error}
                                    </Typography>
                                </Grid>
                            )
                        }
                        <Grid item lg={12}>
                            <Button 
                                variant="contained" 
                                type={'submit'} 
                                disabled={isButtonDisabled()} 
                                onClick={handleSubmit}
                                fullWidth
                            >
                                {
                                    loading ? <CircularProgress /> : 'Create Account'
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={3} />
            </GridContainer>
        </Layout>
    )
}
