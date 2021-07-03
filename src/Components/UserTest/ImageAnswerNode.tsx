import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import {CardActionArea} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import axios from "axios";
const useStyles = makeStyles((theme: Theme) =>
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
        controls: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
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
        const data = await axios("https://iot-experemental.herokuapp.com/files/answer?id=" + props.answer.id)
        try {
            if (!urlHasBeenPassed){
                setUrlHasBeenPassed(true)
                setAnswerImgUrl(data.data[0].image)
                // console.log(props.answerIndex)
            }
        }catch (e) {
            console.log(e)
        }
    }
    useEffect( () => {
        fetchData()
    }, [props.answerIndex]);
    const classes = useStyles();
    return(
        <div className=" mt-3 ml-3"  >
            {/*"#93cdf3"*/}
            <Card elevation={2} className={classes.root}  style={{backgroundColor:  props.selected.indexOf(props.answer.id) !== -1? "#71c3ef" : ""}}
                  onClick={() =>{
                        props.onChange(props.answer.id)
                        setTimeout(changeIsSelected, 150,  !isSelected)
            }}>
                <CardActionArea>
                    {answerImgUrl?
                        <CardMedia
                            style={{opacity: props.selected.indexOf(props.answer.id) !== -1? 0.5 : 1}}
                            className={classes.media}
                            image={answerImgUrl}
                            title="Contemplative Reptile"
                        />: null}
                        <CardContent className="mb-5">
                            <Typography variant="body2" color="textSecondary" component="p" className="mb-5 pb-5">
                                {props?.answer?.text}
                            </Typography>
                        </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}

