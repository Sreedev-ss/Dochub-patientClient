import { useEffect, useLayoutEffect, useState } from 'react'
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Google as GoogleLogo } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/Firebase/config';
import { authServer } from '../../config/axios/axios';
import {showLoading,hideLoading} from '../../Redux/loadingSlice'
import {loginSuccess,loginFailure} from '../../Redux/authSlice'
import {useDispatch, useSelector} from 'react-redux'

const theme = createTheme({
    palette: {
        primary: {
            main: '#6981A6',
        },
        secondary: {
            main: "#00000",
        },
    },
});

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState({ show: true, error: false, message: "" })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state: any) => state.auth)

    useEffect(()=>{
        if(isAuthenticated){
            return navigate(-1)
        }
    },[isAuthenticated])
    

    const loginUser = async (type: string) => {
        try {
            const emailErr = { message: "Email is required" }
            const passErr = { message: "Password is required" }

            if (type === "email" && !email) throw emailErr
            if (type === "email" && !password) throw passErr

            const response =
                type === 'email'
                    ? await signInWithEmailAndPassword(auth, email, password)
                    : await signInWithPopup(auth, new GoogleAuthProvider())

            const IdToken = await response.user.getIdToken()
            console.log(IdToken,'login');

            try {
                const response = await authServer.post('/login',{IdToken})
                console.log(response);
                dispatch(hideLoading())
                dispatch(loginSuccess(response.data))
                setStatus({ show: true, message: "Login success", error: false });
                navigate('/')
            } catch (err:any) {
                const errObj = {
                    message : err?.message ? err.message : 'Unable to Login'
                }
                throw errObj 
            }

        } catch (err:any) {
            setStatus({
                show: true,
                error: true,
                message: err.message
            })
            dispatch(hideLoading())
            dispatch(loginFailure(err.message))
            console.log(status);
        }
    }
    
    return (
        <>
            <div>
                <h1 className='text-black font-bold text-4xl mt-28'>Hi</h1>
                <span className="text-gray-500 text-sm mt-3">Welcome to Doc<span className="text-orange-300 text-sm">hub!</span></span>

                <Box
                    className='mt-10'
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '55ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '55ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField
                            id="outlined-required"
                            label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '55ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div className='flex justify-center'>
                        <TextField
                            id="outlined-required"
                            label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </Box>

            </div>
            <div className='mt-10 flex flex-col items-center gap-4'>
                <ThemeProvider theme={theme}>
                    <Button color='primary' className='w-96 h-12' variant="contained" onClick={()=>loginUser('email')}>Login</Button>
                    <Button className='w-96 h-12' variant="outlined" onClick={()=>loginUser('')}><GoogleLogo className='mr-2' color='secondary'></GoogleLogo>Sign in with google</Button>
                </ThemeProvider>
                <Link to={'/signup'}><span className="text-black text-sm mt-1">Don't have an account?<span className="text-orange-300 text-sm"> Signup</span></span></Link>
            </div>
        </>
    )
}

export default Login;
