import React, {useState} from 'react'
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import CourseMicroView from "../Editor/CourseMicroView";

const GET_ALL_COURSE = gql`
    query GET_ALL_COURSE{
        cardCourse{
            id
            name
            courseData
        }
    }`
export default function MainCoursePublicView({...props}){
    const [isOpenCourse, setIsOpenCourse] = useState(false)
    const [openCourseNumber, setOpenCourseNumber] = useState<any>()
    const {data: course_data} = useQuery(GET_ALL_COURSE)
    if (!course_data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div{...props}>
            {/*Потом убрать reverse*/}
            {course_data.cardCourse.map((sameCourse, cIndex) =>{
                return(
                    <CourseMicroView className="ml-5 mt-4" course={sameCourse} key={"Course" + cIndex}
                    onEdit={(data) =>{
                        setOpenCourseNumber(data)
                        setIsOpenCourse(true)
                    }}/>
                )
            })}
        </div>
    )
}