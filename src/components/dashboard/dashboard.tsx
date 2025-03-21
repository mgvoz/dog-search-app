import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, FormControl, FormLabel, TextField, Autocomplete, Slider, Pagination, Select, MenuItem, Paper, Divider, Modal, List, ListItem, ListItemIcon, Stack, Snackbar, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useBreedData, useDogSearch, useLogout, useMatch } from '../../api/hooks';
import { Filters } from '../../models/filters';
import { Dog } from '../../models/dog';
import DogCard from './dog-card';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import CopyrightIcon from '@mui/icons-material/Copyright';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../../assets/logo.png';
import { AxiosResponse } from 'axios';
import { theme } from '../../theme';

const sortOptions = [
    {id: 1, value: "breed:asc", name: "Breed A-Z"}, 
    {id: 2, value: "breed:desc", name: "Breed Z-A"}, 
    {id: 3, value: "age:asc", name: "Age Low-High"}, 
    {id: 4, value: "age:desc", name: "Age High-Low"}, 
    {id: 5, value: "name:asc", name: "Name A-Z"}, 
    {id: 6, value: "name:desc", name: "Name Z-A"}
];

const Container = styled(Stack)(() => ({
    height: '100%',
    minWidth: '375px',
   '&::before': {
      content: '""',
      minWidth: '375px',
      display: 'block',
      position: 'fixed',
      zIndex: -1,
      inset: 0,
      background: 'conic-gradient(rgb(238,171,54, .1) 90deg,rgb(234,223,215, .1) 90deg 180deg,rgb(238,171,54, .1) 180deg 270deg,rgb(234,223,215, .1) 270deg)',
      backgroundRepeat: 'repeat',
      backgroundAttachment: 'fixed'
   },
}));
const favoritesModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid var(--orange)',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto'
  };
  const matchModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '1px solid var(--orange)',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto'
  };
  const filterModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
        width: '70%',
    },
    [theme.breakpoints.between('sm','md')]: {
        width: '50%',
    },
    [theme.breakpoints.up('md')]: {
        width: '30%',
    },
    bgcolor: 'background.paper',
    border: '1px solid var(--orange)',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto',
    gap: '25px'
  };
  const buttonStyle = {
    width: '75%', 
    minWidth: '150px', 
    '&:hover': {
        backgroundColor: 'var(--lightorange)'
    }
  }
  const formControlStyle = {
    minWidth: '150px', 
    width: '75%'
  }
  const formItemStyle = {
    width: '100%', 
  }
  const baseFlexRow = {
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
  const modalCloseStyle = {
    alignSelf: 'end',
    padding: '0'
  }
  const headerStyle = {
    position: 'sticky', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 1000, 
    backgroundColor:'#ffffff'
  }

function Dashboard() {
    const navigate = useNavigate();
    const name = localStorage.getItem("user-name");

    const [zipCodeValue, setZipCodeValue] = useState<string[]>([]);
    const [sliderValues, setSliderValues] = useState([0, 25]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('breed:asc');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [favoritesOpen, setFavoritesOpen] = useState(false);
    const [matchOpen, setMatchOpen] = useState(false);
    const [match, setMatch] = useState<Dog>();
    const [favorites, setFavorites] = useState<Dog[]>([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Filters>({
         breeds: selectedBreeds,
         zipCodes: zipCodeValue,
         ageMin: sliderValues[0],
         ageMax: sliderValues[1],
         size: 25,
         sort: sort
    });

    const { breedValues, breedErrMsg } = useBreedData();

    const { dogs, totalRecords, searchErrMsg } = useDogSearch(filters);

    useEffect(()=>{
        setErrMsg(breedErrMsg);
    },[breedErrMsg]);

    useEffect(()=>{
        setErrMsg(searchErrMsg);
    },[searchErrMsg]);

    useEffect(()=>{
         setLoading(true);
    },[filters]);

    useEffect(()=>{
        setTimeout(() => {setLoading(false)}, 2000);
    },[dogs]);
    
    const logoutFunc = async () => {
        useLogout();
        navigate("/");
    };

    const applyFilters = () => {
        setFilters({
            breeds: selectedBreeds,
            zipCodes: zipCodeValue,
            ageMin: sliderValues[0],
            ageMax: sliderValues[1],
            size: 25,
            sort: sort
        });
        setFiltersOpen(false);
        resetPage();
    };

    const pageChange = (page: number) => {
        setPage(page);
        if ((25 * page) < totalRecords){
            setFilters({...filters, from: 25*page})
        } else {
            var numOfPages = totalRecords / 25;
            setFilters({...filters, from: Math.floor(numOfPages) * 25})
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const sortChange = (event: any) => {
        setSort(event.target.value);
        setFilters({...filters, sort: event.target.value})
        resetPage();
    }

    const resetPage = () => {
        setPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const findMatch = () => {
        const favoriteIds = favorites.map((favorite: Dog) => favorite.id);

        useMatch(favoriteIds)
            .then((response: AxiosResponse) => {
                console.log(response)
                setMatchOpen(true)
                setMatch(response.data[0])
            })
            .catch((err) => {
                setErrMsg(err);
            });
    }

    const handleFavorites = (favs: Dog[]) => {
        setFavorites(favs);
    }

    const clearFilters = () => {
        setFilters({
            breeds: [],
            zipCodes: [],
            ageMin: 0,
            ageMax: 25,
            size: 25,
            sort: sort
        });
        setZipCodeValue([]);
        setSelectedBreeds([]);
        setSliderValues([0, 25]);
        resetPage();
    }

    const closeErrMsg = () => {
        setErrMsg('');
    }

  return (
    <Fade in={true} unmountOnExit>
        <Container>
            <Box sx={headerStyle}>
                <Paper sx={{...headerStyle, padding: '10px 20px 10px 20px'}} elevation={3}> 
                    <Box component='div' sx={{...baseFlexRow, justifyContent: 'space-between', padding: '5px'}}>
                        <Box component='div' sx={{display: 'flex', flexDirection: 'row'}}>
                            <img height={70} width={70} src={logo} alt="the dog search app logo"/>
                            <Typography variant='h3' color='primary' sx={{fontFamily: '"Kirang Haerang", system-ui', padding: '0 20px 10px 20px', alignItems: 'center'}}>DogSearchApp</Typography>
                        </Box>
                        <Box component='div' sx={{...baseFlexRow, gap: '15px', justifyContent: 'end'}}>
                            <Typography sx={{marginRight: '15px', fontWeight: '400'}} variant="body1" color='secondary.dark'>{name}</Typography>
                            <Button aria-label="view favorites" disabled={favorites.length == 0} onClick={() => setFavoritesOpen(true)}>
                                <FavoriteIcon /><Typography sx={{marginLeft: '15px'}} >Favorites ({favorites.length})</Typography>
                            </Button>
                            <Button variant='contained' color="primary" sx={{height: 'min-content'}} onClick={() => logoutFunc()}>Logout</Button>
                        </Box>
                    </Box>
                </Paper> 
                <Button type='button' variant='contained' onClick={() => setFiltersOpen(true)} sx={{backgroundColor: 'var(--lightorange)', left: 0, right: 0, width: '100%', minWidth: '375px', zIndex: 1000}}><TuneIcon sx={{marginRight: '10px'}}/>Filters</Button>
            </Box>
            <Box component='div' sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '25px', paddingTop: '75px' }}>
                <Box component='div' sx={{...baseFlexRow, width: '80%', gap: '50px;', justifyContent: 'center', alignSelf: 'center'}}>
                    {dogs.length > 0 ? 
                    (
                        <DogCard dogs={dogs} loading={loading} handleFavorites={handleFavorites}/>
                    ) : (
                        <Box component='div' sx={{...baseFlexRow, justifySelf: 'center', paddingTop: '50px'}}>
                            <PetsIcon color='primary'/><Typography variant='h6' color='var(--darkgrey)' sx={{marginLeft: '10px'}}>No dogs match your search</Typography>
                        </Box>
                    )}
                </Box>
                <Box component='div' sx={{...baseFlexRow, justifyContent: 'center', height: '60px', margin: '50px 0 100px 0' }}>
                    {loading ? (<></>) : (dogs.length > 0 ? (<Pagination count={(totalRecords % 25 == 0 ? totalRecords/25 : Math.floor((totalRecords/25)) + 1)} onChange={(event, page) => pageChange(page)} page={page} color="primary"/>) : (<></>))}
                </Box>
            </Box>
            <Paper sx={{...baseFlexRow, justifyContent: 'space-around', position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', height: '45px', padding: '0 10px 0 10px', minWidth: '375px', }} elevation={3}>
                    <Box component='div' sx={{...baseFlexRow, justifyContent: 'space-between', color: 'var(--darkgrey)'}}>
                        <CopyrightIcon/> 
                        <Typography variant='body2' sx={{marginLeft: '10px'}}>Copyright 2025, DogSearchApp</Typography>
                    </Box>
                    <Typography variant='body2'>Marissa Gvozdenovich</Typography>
            </Paper>
            <Modal
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                aria-labelledby="filters"
                aria-describedby="filter options for dog results"
            >
                <Box component='div' sx={filterModalStyle}> 
                    <Button onClick={()=> setFiltersOpen(false)} sx={modalCloseStyle}><CloseIcon/></Button>
                    <Divider sx={{color: 'var(--darkgrey)', width: '100%'}} variant='fullWidth' textAlign='center'>Sort</Divider>
                    <FormControl sx={formControlStyle}>
                        <Select
                            sx={formItemStyle}
                            variant='standard'
                            labelId="sort-label"
                            id="sort"
                            value={sort}
                            label="Sort"
                            color="primary"
                            onChange={(event, child) => sortChange(event)}
                        >
                            {sortOptions.map((option) => {
                                return (
                                    <MenuItem key={option.id} sx={{color: 'var(--darkgrey)'}} value={option.value}>{option.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <Divider sx={{color: 'var(--darkgrey)', marginTop: '20px;', width: '100%'}} variant='fullWidth' textAlign='center'>Filter</Divider>
                    <FormControl sx={formControlStyle}>
                        <TextField
                            id='zipCodes'
                            name='zipCodes'
                            placeholder='Enter multiple separated by commas'
                            variant='standard'
                            color='primary'
                            label='Zip Code(s)'
                            value={zipCodeValue}
                            onChange={(event) => setZipCodeValue(event.target.value.split(","))}
                            sx={formItemStyle}
                        />
                    </FormControl>
                    <FormControl sx={formControlStyle}>
                        <Autocomplete
                            multiple
                            id="breeds"
                            onChange={((event, values) => setSelectedBreeds(values))}
                            options={breedValues}
                            color='primary'
                            getOptionLabel={(option: string) => option}
                            value={selectedBreeds}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label='Breed(s)'
                                    sx={{color: 'var(--darkgrey)'}}
                                />
                            )}
                            sx={formItemStyle}
                        />
                    </FormControl>
                    <FormControl sx={{...formControlStyle}}>
                        <FormLabel>Age</FormLabel>
                        <Slider
                            getAriaLabel={() => 'Minimum distance'}
                            value={sliderValues}
                            min={0}
                            max={25}
                            onChange={(event, value) => setSliderValues(value as number[])}
                            valueLabelDisplay="auto"
                            getAriaValueText={(value, index) => `Age range between ${sliderValues[0]} and ${sliderValues[1]}`}
                            disableSwap
                            color='primary'
                            sx={{width: '95%', alignSelf: 'center'}}
                        />
                    </FormControl>
                    <Button type='button' onClick={applyFilters} sx={buttonStyle} color='primary' variant="contained">Apply Filters</Button>
                    <Button type='button' sx={buttonStyle} color='primary' variant="outlined" onClick={clearFilters}>Clear Filters</Button>
                </Box>   
            </Modal>
            <Modal
                open={favoritesOpen}
                onClose={() => setFavoritesOpen(false)}
                aria-labelledby="favorites"
                aria-describedby="dogs selected as favorites"
            >
                <Box component='div' sx={favoritesModalStyle}>
                    <Button onClick={()=> setFavoritesOpen(false)} sx={modalCloseStyle}><CloseIcon/></Button>
                    <Typography id="favorites-title" variant="h6" component="h2" color='var(--darkgrey)'>
                        Here are the dogs you <FavoriteIcon color='primary'/>
                    </Typography>
                    <List sx={{padding: '25px'}}>
                        {favorites.map((favorite) => { return (
                            <ListItem key={favorite.id}>
                                <ListItemIcon>
                                    <img height={50} width={50} src={favorite.img} style={{'borderRadius': '50%'}} alt="image of a dog"/>
                                </ListItemIcon>
                                <Box component='div' sx={{marginLeft: '10px'}}><b>{favorite.name}</b>, Age: {favorite.age} | Breed: {favorite.breed} | Location: {favorite.zip_code}</Box>
                            </ListItem>
                        )})}
                    </List>
                    <Button variant='contained' color="primary" sx={{height: 'min-content'}} onClick={() => findMatch()}>Find your perfect pet match!</Button>
                </Box>
            </Modal>
            <Modal
                    open={matchOpen}
                    onClose={() => setMatchOpen(false)}
                    aria-labelledby="match"
                    aria-describedby="dog that matches you"
                >
                    <Box component='div' sx={matchModalStyle}>
                        <Button onClick={()=> setMatchOpen(false)} sx={modalCloseStyle}><CloseIcon/></Button>
                        <Typography id="match-title" variant="h6" component="h2" color='secondary.dark' sx={{textAlign: 'center', padding: '15px'}}>
                        {match?.name} is your perfect pet match! <FavoriteIcon color='primary'/>
                        </Typography>
                        <img height={250} width={250} src={match?.img} style={{'borderRadius': '50%', 'padding': '15px'}} alt="image of a dog"/>
                    </Box>
            </Modal>
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

export default Dashboard
