import React from 'react'
import {Spinner} from "react-bootstrap";
import CourseMicroView from "../Editor/CourseMicroView";
import {CARD} from '../../Cards/Card'
import {CoursePageStorage} from "../../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";
export const MainCoursePublicView = observer(({...props}) => {
    if (!CoursePageStorage.courseArr) {
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
        <div{...props} className="col-12" style={{overflowY: "scroll"}}>
            {CoursePageStorage.courseArr.map((sameCourse, courseIndex) =>{
                return(
                    <div key={"Course" + courseIndex} className="col-12" style={{overflowY: "scroll"}}>
                    <CourseMicroView className="ml-lg-5 mt-4" course={sameCourse}
                                     buttonClick={(data) =>
                                         CoursePageStorage.cardSelectInCourseByMouseClick(data, courseIndex, sameCourse?.id)}
                    onEdit={() =>{
                        console.log("_")
                    }}/>
                    </div>
                )
            })}
        </div>
    )
})