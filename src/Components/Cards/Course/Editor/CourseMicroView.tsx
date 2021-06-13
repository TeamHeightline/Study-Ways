import React from 'react';
import {Row} from "antd";
import {Button, Card, CardActionArea, CardMedia, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import CourseNavigation from "../Vue/CourseNavigation";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        // width: 1070,
        width: 1200,
        // width: 820
    },
    cover: {
        width: 251,
    },

}));

export default function CourseMicroView({course, ...props}: any) {
    const classes = useStyles();
    return(
        <div {...props}>
            <Card className={classes.root}>
                <CardMedia
                    onClick={() => console.log("click")}
                    className={classes.cover}
                    image="https://content.skyscnr.com/m/5462d448281ea355/original/GettyImages-468945589.jpg?resize=1800px:1800px&quality=100"
                />
                <CardActionArea style={{ width:260}} onClick={() => {
                    console.log("Click")
                    props.onEdit(course.id)
                }}>
                    <Typography variant="h5" className="text-center rl mr-1 ml-1" style={{fontFamily: "Raleway"}}>
                        {(course.name && course.name.length !== 0) ? course.name: "Название курса по умолчанию"}
                    </Typography>
                </CardActionArea>
                <Divider orientation="vertical" flexItem className="ml-1" />
                <CourseNavigation course={course}/>
            </Card>
        </div>
    )
}