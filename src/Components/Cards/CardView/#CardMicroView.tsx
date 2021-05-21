import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import {Grid, Paper} from "@material-ui/core";
import {gql} from "@apollo/client/core";

const useStyles = makeStyles({
    root: {
        maxWidth: 395,
        display: 'flex',
    },
    media: {
        height: 170,
    },
});

const GET_CARD_FOR_MICRO_VIEW_BY_ID = gql`
    query GET_CARD_FOR_MICRO_VIEW_BY_ID($id: ID!){
        cardById(id: $id){
            id
            text
            title
            cardContentType
            videoUrl
            subTheme{
                id
                name
                theme{
                    id
                    name
                    globalTheme{
                        id
                        name
                    }
                }
            }
            author{
                id
                name
            }

        }
    }`
export default function CardMicroView(){
    const classes = useStyles();
    const theme = useTheme();
    return(
        <div>
            <Grid item xs={5} className="ml-5 mt-5">
                <Paper elevation={3} className={classes.root} >
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <CardMedia
                                    className={classes.media}
                                    image="https://sun9-15.userapi.com/impg/j0sDW0LCS0xXqk9ckUq0dTAyfmOnePIfOMZtLQ/ffokBfYyyjk.jpg?size=734x979&quality=96&sign=4df79703568167cbfb441be3d23609fa&type=album"
                                />
                                </Grid>
                            <Grid item xs={8}>
                            </Grid>
                        </Grid>
                </Paper>
            </Grid>
        </div>
    )
}
