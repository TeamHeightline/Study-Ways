import React, {useState} from 'react'
import {Button, Card, Container, Paper, Typography} from "@material-ui/core";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import EditCourseByID, {CourseLines} from "./EditCourseByID";
import {Col, Tabs} from "antd";
import {Row} from "antd";
import CourseMicroView from "./CourseMicroView";

const { TabPane } = Tabs;
const CREATE_COURSE_WITH_DEFAULT_VALUE = gql`
    mutation CREATE_COURSE_WITH_DEFAULT_VALUE($default_data: GenericScalar){
        createCardCourse(input: {courseData: $default_data}){
            course{
                courseData
                id
            }
        }
    }
`

const GET_OWN_COURSE = gql`
    query GET_OWN_COURSE{
        me{
            cardcourseSet{
                courseData
                id
                name
            }
        }
    }`
export default function MainCourseEditor({...props}: any) {
    const [isEditCourseNow, setIsEditCourseNow] = useState(false)
    const [selectedCourseID, setSelectedCourseID] = useState<any>()
    const [create_course, {data: create_course_data, error: create_course_error}] = useMutation(CREATE_COURSE_WITH_DEFAULT_VALUE,
        {
            variables:{
                default_data: CourseLines
            }
        })
    const {data: own_course_data, refetch} = useQuery(GET_OWN_COURSE)
    // console.log(own_course_data)
    if(isEditCourseNow){
        return (
            <EditCourseByID course_id={selectedCourseID} onChange={(data) =>{
                if(data === "goBack"){
                    setIsEditCourseNow(false)
                    refetch()
                }
            }}/>
        )
    }

    return(
        <div>
            <Container>
                <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                        size="large"  onClick={() => {
                    create_course().then(() => refetch())
                }}>
                    Создать новый курс
                </Button>

                {own_course_data?.me.cardcourseSet.map((course, cIndex) =>{
                    return(
                        <CourseMicroView key={course.id} course={course} className="ml-3 mt-4" cIndex={course.id}
                                         onEdit={(data) =>{
                                             // console.log(data)
                                             setSelectedCourseID(data)
                                             setIsEditCourseNow(true)
                                         }}/>
                    )
                }) }
            </Container>
        </div>
    )
}