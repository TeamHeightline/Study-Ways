import React, {useEffect, useState} from 'react';
import {Card, CardActionArea, Typography} from "@material-ui/core";
import CourseNavigation from "../Vue/CourseNavigation";
import {Row} from "react-bootstrap";
import styles from './Style.module.css'

export default function CourseMicroView({course, ...props}: any) {
    const [cardCourseImageURL, setCardCourseImageURL] = useState('');
    async function getCourseImageData(){
        fetch("https://iot-experemental.herokuapp.com/cardfiles/course?id=" + course.id)
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
    return(
        <div {...props}>
            <Card style={{padding: 0, width: 530, height: 125}} variant="outlined">
                <Row>
                    <CardActionArea
                        style={{width:180,
                            backgroundSize: "cover",
                            // boxShadow: "inset 0 0 5em 1em #000",
                            backgroundImage: cardCourseImageURL ? "url(" + cardCourseImageURL + ")": "url('https://content.skyscnr.com/m/5462d448281ea355/original/GettyImages-468945589.jpg?resize=1800px:1800px&quality=100')"}}
                        onClick={() => {
                            props.onEdit(course.id)
                        }}>
                        <Typography
                            style={{
                                height: 125,
                                fontFamily: "system-ui",
                                fontSize: 15,
                                color: "white",
                                width: 180,
                                textAlign: "center",
                                marginLeft: "5px",
                                // textShadow: "1px 1px 2px black, 0 0 1em black"
                            }}>
                            {(course.name && course.name.length !== 0) ? course.name.toUpperCase() : "Название курса по умолчанию"}
                        </Typography>
                    </CardActionArea>
                    {/*<Divider orientation="vertical" flexItem className="ml-1" />*/}
                    <CourseNavigation className={styles.NavigationBackground}
                        style={{width: 350, paddingBottom: 15, height: 120,}}
                                      course={course} buttonClick={data => props.buttonClick(data)}
                                      cardPositionData={props.cardPositionData}/>

                </Row>
            </Card>
        </div>
    )
}