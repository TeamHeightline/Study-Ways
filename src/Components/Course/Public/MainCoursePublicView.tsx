import React, {useState} from 'react'
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import CourseMicroView from "../Editor/CourseMicroView";
import {CARD} from '../../Cards/Card'
import {CoursePageStorage} from "../../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";
import {autorun, toJS} from "mobx";
export const MainCoursePublicView = observer(({...props}) => {
    const [isOpenCard, setIsOpenCard] = useState(false)
    const [cardID, setCardID] = useState<any>()
    // const {data: course_data} = useQuery(GET_ALL_COURSE)
    if (!CoursePageStorage.courseArr) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(isOpenCard){
        return (
            <CARD id={cardID}
                  buttonClick={async data => {
                      data.courseIndex=CoursePageStorage.positionData.courseIndex
                      data.courseID=CoursePageStorage.positionData.courseID
                      if(CoursePageStorage.get_card_id_by_position(data)){
                          await setCardID(CoursePageStorage.get_card_id_by_position(data))
                          CoursePageStorage.positionData = data
                      }
                  }}
                  openFromCourse={true}
                  cardPositionData={CoursePageStorage.positionData}
                  course={CoursePageStorage.courseArr[CoursePageStorage.positionData.courseIndex]}
                  ButtonClick={(data) =>{
                      if(data === "Next"){
                          const newCardPositionData = CoursePageStorage.positionData
                          newCardPositionData.buttonIndex = Number(newCardPositionData.buttonIndex) + 1
                          CoursePageStorage.positionData = newCardPositionData
                          setCardID(CoursePageStorage.get_card_id_by_position(newCardPositionData))
                      }
                      if(data === "Back"){
                          const newCardPositionData = CoursePageStorage.positionData
                          newCardPositionData.buttonIndex = Number(newCardPositionData.buttonIndex) - 1
                          CoursePageStorage.positionData = newCardPositionData
                          setCardID(CoursePageStorage.get_card_id_by_position(newCardPositionData))
                      }
                      if(data === "Up"){
                          const newCardPositionData = CoursePageStorage.positionData
                          newCardPositionData.row = Number(newCardPositionData.row) - 1
                          CoursePageStorage.positionData = newCardPositionData
                          setCardID(CoursePageStorage.get_card_id_by_position(newCardPositionData))
                      }
                      if(data === "Down"){
                          const newCardPositionData = CoursePageStorage.positionData
                          newCardPositionData.row = Number(newCardPositionData.row) + 1
                          CoursePageStorage.positionData = newCardPositionData
                          setCardID(CoursePageStorage.get_card_id_by_position(newCardPositionData))
                      }
                  }}
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
                                             await setCardID(CoursePageStorage.get_card_id_by_position(data))
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