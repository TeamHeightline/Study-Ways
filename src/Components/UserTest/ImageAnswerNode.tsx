import React from "react";
import Card from "@material-ui/core/Card";
import {CardActionArea} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
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

    const classes = useStyles();
    console.log(props)
    return(
        <div className=" mt-3 ml-3" style={{borderColor: "azure"}} >
            <Card className={classes.root}  >
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                        title="Contemplative Reptile"
                    />
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