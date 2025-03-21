import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export let theme = createTheme({
  palette: {
    primary: {
      light: '#f1bb5e',
      main: '#EEAB36',
      dark: '#a67725',
      contrastText: '#fff',
    },
    secondary: {
      light: '#eee6df',
      main: '#EAE0D7',
      dark: '#464340',
      contrastText: '#000',
    },
  },
});

theme = responsiveFontSizes(theme);
