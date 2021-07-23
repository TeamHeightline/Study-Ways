import React, {useState} from 'react'
import {Spinner} from "react-bootstrap";
import CourseMicroView from "../Editor/CourseMicroView";
import {CARD} from '../../Cards/Card'
import {CoursePageStorage} from "../../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";
export const MainCoursePublicView = observer(({...props}) => {
    const [isOpenCard, setIsOpenCard] = useState(false)
    if (!CoursePageStorage.courseArr) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(isOpenCard){
        return (
            <CARD id={CoursePageStorage.selectedCardID}
                  buttonClick={async data => {
                      data.courseIndex=CoursePageStorage.positionData.courseIndex
                      data.courseID=CoursePageStorage.positionData.courseID
                      if(CoursePageStorage.get_card_id_by_position(data)){
                          CoursePageStorage.selectedCardID = CoursePageStorage.get_card_id_by_position(data)
                          CoursePageStorage.positionData = data
                      }
                  }}
                  openFromCourse={true}
                  onChange={(data) =>{
                    if(data ==="goBack"){
                        setIsOpenCard(false)
                    }
            }}/>
        )
    }
    return(
        <div{...props} className="col-12" style={{overflowY: "scroll"}}>
            {/*Потом убрать reverse*/}
            {CoursePageStorage.courseArr.map((sameCourse, cIndex) =>{
                return(
                    <div key={"Course" + cIndex} className="col-12" style={{overflowY: "scroll"}}>
                    <CourseMicroView className="ml-lg-5 mt-4" course={sameCourse}
                                     buttonClick={async (data) =>{
                                         data.courseIndex=cIndex
                                         data.courseID=sameCourse?.id
                                         if(CoursePageStorage.get_card_id_by_position(data)){
                                             CoursePageStorage.selectedCardID = CoursePageStorage.get_card_id_by_position(data)
                                             CoursePageStorage.positionData = data
                                             await setIsOpenCard(true)
                                         }
                                     }}
                    onEdit={() =>{
                        console.log("_")
                    }}/>
                    </div>
                )
            })}
        </div>
    )
})