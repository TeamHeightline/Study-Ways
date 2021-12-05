import React, {useEffect, useState} from "react";
import Card from "@mui/material/Card";
import {CardActionArea} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import axios from "axios";
import {SERVER_BASE_URL} from "../../../settings";
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            width: 385,
            height: 400,
            // paddingBottom: '200px'

        },
        media: {
            height: 240,
        },
        fullHeightMedia: {
            height: 400
        },

        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },

        playIcon: {
            height: 38,
            width: 38,
        },

    }),
);

export default function ImageAnswerNode(props: any){
    const [answerImgUrl, setAnswerImgUrl] = useState('')
    const [urlHasBeenPassed, setUrlHasBeenPassed] = useState(false)
    const [isSelected, changeIsSelected] = useState(false)
    const fetchData = async () => {
        const data = await axios(SERVER_BASE_URL + "/files/answer?id=" + props.answer.id)
        try {
                setUrlHasBeenPassed(true)
                setAnswerImgUrl(data.data[0].image)
        }catch (e) {
            console.log(e)
        }
    }
    useEffect( () => {
        fetchData()
    }, [props.answerIndex]);
    const classes = useStyles();
    return(
        <div className=" mt-3"  >
            {/*"#93cdf3"*/}
            <Card variant="outlined"  className={classes.root}  style={{backgroundColor:  props.selected.indexOf(props?.answer?.id) !== -1? "#71c3ef" : ""}}
                  onClick={() =>{
                        props.onChange(props.answer.id)
                        setTimeout(changeIsSelected, 150,  !isSelected)
            }}>
                <CardActionArea>
                    {answerImgUrl?
                        <CardMedia
                            style={{opacity: props.selected.indexOf(props.answer.id) !== -1? 0.5 : 1}}
                            className={(props?.answer?.text || props?.answerText)? classes.media : classes.fullHeightMedia}
                            image={answerImgUrl}
                            title="Contemplative Reptile"
                        />: null}
                    {props?.answer?.text &&
                        <CardContent className="mb-5">
                            <Typography variant="body1" color="textSecondary" component="p" className="mb-5 pb-5">
                                {props?.answer?.text ? props?.answer?.text: props?.answerText}
                            </Typography>
                        </CardContent>}
                </CardActionArea>
            </Card>
        </div>
    )
}

