import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CardContent, FormControl, FormLabel, TextField, Typography, Stack, Fade, Snackbar } from '@mui/material';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { AxiosResponse } from "axios";
import { useLogin }  from '../../api/hooks';
import logo from "../../assets/logo.png"

const Container = styled(Stack)(() => ({
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
   '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      height: '100vh',
      width: '100%',
      background: 'conic-gradient(rgb(238,171,54, .1) 90deg,rgb(234,223,215, .1) 90deg 180deg,rgb(238,171,54, .1) 180deg 270deg,rgb(234,223,215, .1) 270deg)',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'fixed'
   },
}));

function Login() {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const validateInput = async (name: string = "", email: string = ""): Promise<boolean> => {
        let isValid = true;
        if (!name || !/^[a-zA-Z0-9'\s-]*$/.test(name)) {
            setNameError(true);
            setNameErrorMessage('Please enter a valid name.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        return new Promise((resolve) => {
            resolve(isValid)
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = data.get('name')?.toString();
        const email = data.get('email')?.toString();
        const validationResult = await validateInput(name, email);
        
        if (validationResult == false) {
            return;
        }

        useLogin(name, email)
        .then((_response: AxiosResponse) => {
            localStorage.setItem("user-name", name ?? "")
            navigate("/dashboard");
        })
        .catch((_err) => {
            setErrMsg("We encountered a problem when logging you in.")
        });
    };

    const closeErrMsg = () => {
        setErrMsg('');
    }

  return (
    <Fade in={true} unmountOnExit>
        <Container>
            <Box component='div'sx={{display: 'flex'}}>
                <Card variant="outlined" sx={{display: 'flex', flexDirection: 'column', flex: '1 1', alignSelf: 'center', padding: [null, null, '10px', '10px'], width: '30%', minWidth: '200px'}}>
                <CardContent>
                    <Box component='div' sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                        <img height={100} width={100} src={logo} alt="the dog search app logo"/>
                        <Typography variant='h3' color='primary' sx={{fontFamily: '"Kirang Haerang", system-ui', padding: '0 20px 10px 20px', alignItems: 'center'}}>DogSearchApp</Typography>
                    </Box>
                    <Typography 
                        variant="h3"
                        color="var(--darkgrey)"
                        sx={{ margin: '20px auto 10px auto', textAlign: 'center' }}>
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name" sx={{color: 'var(--darkgrey)'}}>Name</FormLabel>
                            <TextField
                                error={nameError}
                                helperText={nameErrorMessage}
                                id="name"
                                name="name"
                                placeholder="John Smith"
                                autoComplete="name"
                                autoFocus
                                required
                                fullWidth
                                sx={{color: 'var(--darkgrey)'}}
                                variant="outlined"
                                color={nameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email" sx={{color: 'var(--darkgrey)'}}>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                required
                                fullWidth
                                sx={{color: 'var(--darkgrey)'}}
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            >
                            Sign in
                        </Button>
                    </Box>
                    </CardContent>
                </Card>
            </Box>
            <Snackbar
            open={errMsg != ''}
            autoHideDuration={6000}
            onClose={closeErrMsg}
            message={errMsg}
            />
        </Container>
    </Fade>
  )
}

export default Login
