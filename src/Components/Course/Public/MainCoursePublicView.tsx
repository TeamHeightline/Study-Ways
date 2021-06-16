import React, {useState} from 'react'
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import CourseMicroView from "../Editor/CourseMicroView";
import Card from '../../Cards/Card'
const GET_ALL_COURSE = gql`
    query GET_ALL_COURSE{
        cardCourse{
            id
            name
            courseData
        }
    }`
export default function MainCoursePublicView({...props}){
    const [isOpenCard, setIsOpenCard] = useState(false)
    const [cardPositionData, setCardPositionData] = useState<any>()
    const [cardID, setCardID] = useState<any>()
    const {data: course_data} = useQuery(GET_ALL_COURSE)
    function get_card_id_by_position(cardPositionData, stepRight= 0, stepUp = 0){
        if(cardPositionData.buttonIndex + stepRight >= 0){
            return(course_data.cardCourse[cardPositionData.courseIndex].courseData[Number(cardPositionData.row) + stepUp]
                .SameLine[cardPositionData.fragment].CourseFragment[Number(cardPositionData.buttonIndex) + stepRight].CourseElement.id)
        }else{
            return null
        }
    }
    if (!course_data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(isOpenCard){
        return (
            <Card id={cardID}
                  openFromCourse={true}
                  disabledNext={get_card_id_by_position(cardPositionData, 1) === null}
                  disabledBack={get_card_id_by_position(cardPositionData, -1) === null}
                  course={course_data.cardCourse[cardPositionData.courseIndex]}
                  ButtonClick={(data) =>{
                      if(data === "Next"){
                          const newCardPositionData = cardPositionData
                          newCardPositionData.buttonIndex = Number(newCardPositionData.buttonIndex) + 1
                          setCardPositionData(newCardPositionData)
                          setCardID(get_card_id_by_position(newCardPositionData))
                      }
                      if(data === "Back"){
                          const newCardPositionData = cardPositionData
                          newCardPositionData.buttonIndex = Number(newCardPositionData.buttonIndex) - 1
                          setCardPositionData(newCardPositionData)
                          setCardID(get_card_id_by_position(newCardPositionData))
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
        <div{...props}>
            {/*Потом убрать reverse*/}
            {course_data.cardCourse.map((sameCourse, cIndex) =>{
                return(
                    <CourseMicroView className="ml-5 mt-4" course={sameCourse} key={"Course" + cIndex}
                                     buttonClick={async (data) =>{
                                         data.courseIndex=cIndex
                                         data.courseID=sameCourse.id
                                         // console.log(data)
                                         if(get_card_id_by_position(data)){
                                             await setCardID(get_card_id_by_position(data))
                                             await setCardPositionData(data)
                                             await setIsOpenCard(true)
                                         }
                                         // get_card_id_by_position(data)
                                     }}
                    onEdit={(get_data) =>{
                        const data = {
                            courseIndex: cIndex,
                            courseID: get_data,
                            buttonIndex: 0,
                            fragment: 0,
                            row:1
                        }
                        console.log(data)
                        setCardPositionData(data)
                        setIsOpenCard(true)
                        get_card_id_by_position(data)
                    }}/>
                )
            })}
        </div>
    )
}