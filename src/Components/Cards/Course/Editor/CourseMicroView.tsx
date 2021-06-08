import React from 'react';
import {Row} from "antd";
import {Button, Card, CardMedia} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import CourseNavigation from "../Vue/CourseNavigation";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: 1070,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 251,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
    },

}));

export default function CourseMicroView({...props}: any) {
    const classes = useStyles();
    return(
        <div className="mt-4">
            <Card className={classes.root}>
                {/*<Typography component="h5" variant="h5">*/}
                {/*    Название курса*/}
                {/*</Typography>*/}
                <CardMedia
                    className={classes.cover}
                    image="https://content.skyscnr.com/m/5462d448281ea355/original/GettyImages-468945589.jpg?resize=1800px:1800px&quality=100"
                />
                <CourseNavigation/>
            </Card>
        </div>
    )
}