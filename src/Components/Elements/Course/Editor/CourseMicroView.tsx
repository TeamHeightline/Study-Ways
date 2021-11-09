import React, {useEffect, useState} from 'react';
import {Card, CardActionArea, Stack, Tooltip, Typography} from "@mui/material";
import CourseNavigation from "../Vue/CourseNavigation";
import {Spinner} from "react-bootstrap";
import styles from './Style.module.css'

export default function CourseMicroView({course, ...props}: any) {
    const [cardCourseImageURL, setCardCourseImageURL] = useState('');
    async function getCourseImageData(){
        fetch("https://iot-experemental.herokuapp.com/cardfiles/course?id=" + course?.id)
            .then((response) => response.json())
            .then((result) => {
                // console.log('Success:', result);
                setCardCourseImageURL(result[0].image)
            })
            .catch(() => {
                void(0)
            });
    }
    useEffect(() =>{
        if(!cardCourseImageURL){
            getCourseImageData()
        }
    }, [course])
    if(!course){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div {...props} style={{padding: 0, overflowX: "auto"}}>
            <Card style={{padding: 0, width:530}} variant="outlined">
                <Stack direction="row">
                    <Tooltip title={(course?.name && course?.name?.length !== 0) ? course?.name?.toUpperCase() : "Название курса по умолчанию"}>
                        <CardActionArea
                            style={{
                                width:200,
                                height: 160,
                                backgroundSize: "cover",
                                // boxShadow: "inset 0 0 5em 1em #000",
                                backgroundImage: cardCourseImageURL ? "url(" + cardCourseImageURL + ")": "url('https://content.skyscnr.com/m/5462d448281ea355/original/GettyImages-468945589.jpg?resize=1800px:1800px&quality=100')"}}
                            onClick={() => {
                                props?.onEdit(course.id)
                            }}>
                            <Typography
                                style={{
                                    background: "rgba(10,33,49,0.73)",
                                    backdropFilter: "blur(5px)",
                                    fontFamily: "system-ui",
                                    fontSize: 15,
                                    color: "white",
                                    textAlign: "center",
                                    marginLeft: "5px",
                                }}>
                                {(course?.name && course?.name?.length !== 0) ? course?.name?.toUpperCase() : "Название курса по умолчанию"}
                            </Typography>
                        </CardActionArea>
                    </Tooltip>
                    <CourseNavigation className={styles.NavigationBackground}
                                      style={{width: 330, height: 160,}}
                                      course={course} buttonClick={data => props?.buttonClick(data)}
                                      cardPositionData={props?.cardPositionData}/>


                    {/*<Divider orientation="vertical" flexItem className="ml-1" />*/}
                </Stack>
            </Card>
        </div>
    )
}