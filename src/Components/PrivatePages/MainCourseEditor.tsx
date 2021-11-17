import React, {useState} from 'react'
import {Button,  Container} from "@mui/material";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import EditCourseByID, {CourseLines} from "../Elements/Course/Editor/EditCourseByID";
import CourseMicroView from "../Elements/Course/Editor/CourseMicroView";
import {Col, Row} from "react-bootstrap";


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
export default function MainCourseEditor() {
    const [isEditCourseNow, setIsEditCourseNow] = useState(false)
    const [selectedCourseID, setSelectedCourseID] = useState<any>()
    const [create_course] = useMutation(CREATE_COURSE_WITH_DEFAULT_VALUE,
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
                <Row className="justify-content-around" style={{overflow: "auto"}}>
                    {own_course_data?.me.cardcourseSet.map((course) =>{
                        return(
                            <Col key={"CourseID" + course.id}>
                                <CourseMicroView key={course.id} course={course} className="ml-1 mt-4" cIndex={course.id}
                                                 buttonClick={data =>console.log(data)}
                                                 onEdit={(data) =>{
                                                     setSelectedCourseID(data)
                                                     setIsEditCourseNow(true)
                                                 }}/>
                            </Col>
                        )
                    }) }

                </Row>
            </Container>
        </div>
    )
}