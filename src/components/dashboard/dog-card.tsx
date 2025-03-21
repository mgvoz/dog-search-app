import { useEffect, useState } from "react";
import { Card, CardActions, CardContent, CardMedia, IconButton, Typography,Skeleton, Box, Divider } from "@mui/material";
import { Dog } from "../../models/dog";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

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
        <Box component='div' sx={{width: '100%', display: 'flex', flexDirection: 'row', gap: '50px', flexWrap: 'wrap', justifyContent: 'center'}}>
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
                            <Card variant="outlined" sx={{ minWidth: 125, boxShadow: '1', width: '250px' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={dog.img}
                                    alt={"Picture of a " + dog.breed + " dog named " + dog.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: 'secondary.dark', paddingBottom: '10px' }}>{dog.name}</Typography>
                                    <Divider/>
                                    <Typography variant="body2" sx={{ color: 'secondary.dark', paddingTop: '15px' }}>
                                    | Age: <b>{dog.age}</b> <br/>| Breed: <b>{dog.breed}</b><br/>| Location: <b>{dog.zip_code}</b>
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
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