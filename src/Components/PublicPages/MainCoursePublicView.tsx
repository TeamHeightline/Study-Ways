import React from 'react'
import {Row, Spinner} from "react-bootstrap";
import CourseMicroView from "../Elements/Course/Editor/CourseMicroView";
import {CARD} from '../Elements/Cards/Card'
import {CoursePageStorage} from "../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";

export const MainCoursePublicView = observer(({...props}) => {
    if (!CoursePageStorage.dataHasBeenGot) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(CoursePageStorage.isOpenCard){
        return (
            <CARD openFromCourse={true}/>
        )
    }
    return(
        <div{...props}>
            <Row className="justify-content-around col-12">
                {CoursePageStorage.courseArr.map((sameCourse, courseIndex) =>{
                    return(
                        <div key={"Course" + courseIndex} style={{overflowX: "auto"}}>
                            <CourseMicroView className="mt-4" course={sameCourse}
                                             buttonClick={(data) =>
                                                 CoursePageStorage.cardSelectInCourseByMouseClick(data, courseIndex, sameCourse?.id)}
                            onEdit={() =>{
                                void(0)
                            }}/>

                        </div>
                    )
                })}
            </Row>
        </div>
    )
})