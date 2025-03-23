import { useEffect, useState } from "react";
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography,Skeleton, Box, Divider, List, ListItem, ListItemIcon } from "@mui/material";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PetsIcon from '@mui/icons-material/Pets';
import { Dog } from "../../models/dog";

type Props = {dogs: Dog[], loading: boolean, handleFavorites: Function};

function DogCard({dogs, loading, handleFavorites}: Props) {
    const [tempFavorites, setTempFavorites] = useState<Dog[]>([]);

    const addToFavorites = (dog: Dog) => {
        const list = [...tempFavorites];
        if (!list.includes(dog)) {
            list.push(dog);
        } else {
            const index = list.findIndex((favorite) => {return favorite.id == dog.id});
            list.splice(index, 1);
        }
        setTempFavorites(list);
    }

    useEffect(() => {
        handleFavorites(tempFavorites);
    }, [tempFavorites])

    const setColor = (dog: Dog) => {
        if(tempFavorites.includes(dog)) {
            return 'var(--orange)'
        } else {
            return 'var(--darkgrey)'
        }
    }

    return (
        <Box component='div' sx={{width: '100%', display: 'flex', flexDirection: 'row', gap: ['30px', '30px', '50px', '50px'], flexWrap: 'wrap', justifyContent: 'center'}}>
            {dogs.map((dog: Dog) => {
                return (
                    <Box component='div' key={dog.id}>
                        {loading ? ( 
                            <Box component='div' sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <Skeleton variant="rectangular" width={250} height={200} />
                                <Skeleton variant="rectangular" width={50} height={20} />
                                <Skeleton variant="rectangular" width={30} height={10} />
                            </Box>
                        ) : (
                            <Card variant="outlined" sx={{ minWidth: 125, boxShadow: '1', width: '310px' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={dog.img}
                                    alt={"Picture of a " + dog.breed + " dog named " + dog.name}
                                />
                                <CardContent sx={{paddingBottom: '0'}}>
                                    <Typography variant="h6" sx={{ color: 'secondary.dark', paddingBottom: '10px' }}>{dog.name}</Typography>
                                    <Divider />
                                    <List >
                                        <ListItem sx={{padding: ['8px', '0', '8px', '0']}}>
                                            <ListItemIcon sx={{minWidth: '32px'}}>
                                                <PetsIcon color="primary"/>
                                            </ListItemIcon>
                                            <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                Age: <b>{dog.age}</b>
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{padding: ['8px', '0', '8px', '0']}}>
                                            <ListItemIcon sx={{minWidth: '32px'}}>
                                                <PetsIcon color="primary"/>
                                            </ListItemIcon>
                                            <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                Breed: <b>{dog.breed}</b>
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{padding: ['8px', '0', '8px', '0']}}>
                                            <ListItemIcon sx={{minWidth: '32px'}}>
                                                <PetsIcon color="primary"/>
                                            </ListItemIcon>
                                            <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                Location: <b>{dog.city}, {dog.state} { dog.zip_code}</b>
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </CardContent>
                                <CardActions disableSpacing sx={{justifyContent: 'end'}}>
                                    <IconButton aria-label="add to favorites" onClick={() => addToFavorites(dog)}>
                                        <FavoriteBorderOutlinedIcon 
                                            style={{ 'color': setColor(dog) } as React.CSSProperties}/>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        )}
                    </Box>
                )
            })}
        </Box>
    )
}

export default DogCard;