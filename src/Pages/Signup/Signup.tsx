import './Signup.scss'
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Google as GoogleLogo } from '@mui/icons-material';
import { useEffect, useLayoutEffect, useState } from 'react'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/Firebase/config';
import { authServer } from '../../config/axios/axios';
import { Link, useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import { VisibilityOff, Visibility } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton';
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

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setCpassword] = useState("")
    const [status, setStatus] = useState({ show: true, error: false, message: "" })
    const [showPassword, setShowPassword] = useState(false);
    const [showcPassword, setShowcPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleClickShowcPassword = () => setShowcPassword(!showcPassword);
    const handleMouseDowncPassword = () => setShowcPassword(!showcPassword);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isAuthenticated } = useSelector((state: any) => state.auth)

    useEffect(()=>{
        if(isAuthenticated){
            return navigate(-1)
        }
    },[isAuthenticated])

    const signupUser = async (type: string) => {
        try {
            const nameErr = { message: "Name is required" }
            const emailErr = { message: "Email is required" }
            const passErr = { message: "Password is required" }
            const cPassErr = { message: "Password doesn't match" }

            if (type === "email" && !name) throw nameErr
            if (type === "email" && !email) throw emailErr
            if (type === "email" && !password) throw passErr
            if (type === "email" && password != cPassword) throw cPassErr

            dispatch(showLoading())

            const response =
                type === 'email'
                    ? await createUserWithEmailAndPassword(auth, email, password)
                    : await signInWithPopup(auth, new GoogleAuthProvider())

            let user: any = auth.currentUser

            name &&
                (await updateProfile(user, {
                    displayName: name,
                }));

            const IdToken = await response.user.getIdToken()
            console.log(IdToken);

            try {
                const response = await authServer.post("/signup", { IdToken })
                dispatch(hideLoading())
                dispatch(loginSuccess(response.data))
                setStatus({ show: true, message: "Login success", error: false });
                navigate('/')

            } catch (err: any) {
                const errObj = {
                    message: err?.message ? err.message : 'Unable to signup'
                }
                throw errObj
            }

        } catch (err: any) {
            setStatus({
                show: true,
                error: true,
                message: err.message
            })
            dispatch(loginFailure(err.message))
        }

    }


    return (
        <>
            <div className="mt-28">
                <h1 className='text-black font-bold text-4xl'>Get Started</h1>
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
                    <div className='flex justify-center'>
                        <TextField
                            id="outlined-required"
                            label="Name"
                            onChange={(e) => setName(e.target.value)}
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
                    <div>
                        <TextField
                            id="outlined-required"
                            label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'password' : 'text'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '55ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <div>
                        <TextField
                            id="outlined-required"
                            label="Confirm Password"
                            onChange={(e) => setCpassword(e.target.value)}
                            type={showcPassword ? 'password' : 'text'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowcPassword}
                                            onMouseDown={handleMouseDowncPassword}
                                        >
                                            {showcPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </Box>
            </div>
            <div className='mt-10 flex flex-col items-center gap-4'>
                <ThemeProvider theme={theme}>
                    <Button color='primary' className='w-96 h-12' variant="contained" onClick={() => signupUser('email')}>Create account</Button>
                    <Button className='w-96 h-12' variant="outlined" onClick={() => signupUser('')}><GoogleLogo className='mr-2' color='secondary'></GoogleLogo>Sign in with google</Button>
                </ThemeProvider>
                <Link to={'/login'}><span className="text-black text-sm mt-1">Already have an account?<span className="text-orange-300 text-sm"> Login</span></span></Link>
            </div>
        </>
    )
}

export default Signup
