import { Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slice";
import { useRouter } from "next/router";
import { LoginUser } from "@/apis/postData";


export default function Login() {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const dispatch = useDispatch()
    const router = useRouter()

    const handleSubmit = async() => {
        try {
            setLoading(true)
            setError('')
            const result = await LoginUser({email, password})
            dispatch(setUser(result?.data?.user))
            localStorage.setItem('apiToken', result?.data?.token)
            router.push(`/dashboard/${result?.data?.user?.id}`)
        } catch (error: any) {
            setError(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Grid 
            container
            rowGap={'2rem'}
            justifyContent={'center'} 
            alignContent={'center'}
            sx={{
                margin: '1rem auto'
            }}
        >
            <Grid item lg={12}>
                <TextField
                    type={'text'}
                    label={'Email'} 
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                <Typography gutterBottom>
                    Don&apos;t have an account? <Link href="/signup">{' '}Sign Up</Link>
                </Typography>
                <Typography gutterBottom>
                    Forgot Password? <Link href="">{' '}Reset Password</Link>
                </Typography>
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
                    disabled={(loading || email === '' || password === '')} 
                    onClick={handleSubmit}
                    fullWidth
                >
                    {
                        loading ? <CircularProgress /> : 'Login'
                    }
                </Button>
            </Grid>
        </Grid>
    )
}
