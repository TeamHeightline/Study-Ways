import React, {useEffect, useRef, useState} from "react";
import {Button, Grid, Input, Paper} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

export default function CKEDITOR(props: any){
    const [selectedAnswerImage, setSelectedAnswerImage] = useState<any>();
    const [isSelectedAnswerImage, setIsSelectedAnswerImage] = useState(false);
    const changeHandlerForAnswerImage = async (event) => {
        if (event.target.files[0]){
        await setSelectedAnswerImage(event.target.files[0]);
        await setIsSelectedAnswerImage(true);
        handleSubmissionAnswerImage(event.target.files[0])
        }
    };

    const handleSubmissionAnswerImage = (img: any) => {
        console.log("---")
        const formData = new FormData();

        formData.append('image', img);
        formData.append('owner_answer', '14');
        fetch(
            'https://iot-experemental.herokuapp.com/files/answer?update_id=14',
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const classes = useStyles();
    return(
        <div>
            {/*<div>*/}
            {/*    <Button*/}
            {/*        color="primary"*/}
            {/*        variant="outlined"*/}
            {/*        component="label"*/}
            {/*    >*/}
            {/*        <input type="file"  hidden name="file" onChange={changeHandlerForAnswerImage} />*/}
            {/*        Upload File*/}
            {/*    </Button>*/}
            {/*    {isSelectedAnswerImage ? (*/}
            {/*        <div>*/}
            {/*            Filename: {selectedAnswerImage?.name}*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        <p>Select a file to show details</p>*/}
            {/*    )}*/}
            {/*/!*            <Button  color="primary"*!/*/}
            {/*/!*                     variant="contained"*!/*/}
            {/*/!*                     onClick={handleSubmissionAnswerImage}>S</Button>*!/*/}
            {/*</div>*/}
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=12</Paper>
                    </Grid>
                    <Grid item xs={10} sm={6} >
                        <Paper className={classes.paper}>xs=12 sm=6</Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>xs=12 sm=6</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}