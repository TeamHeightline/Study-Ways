import React from 'react'
import {Button, Card, Container, Paper, Typography} from "@material-ui/core";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import {CourseLines} from "./EditCourseByID";
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
        cardCourse{
            courseData
            id
        }
    }`
export default function MainCourseEditor({...props}: any) {
    const [create_course, {data: create_course_data, error: create_course_error}] = useMutation(CREATE_COURSE_WITH_DEFAULT_VALUE,
        {
            variables:{
                default_data: CourseLines
            }
        })
    const {data: own_course_data, refetch} = useQuery(GET_OWN_COURSE)
    console.log(own_course_data)
    return(
        <div>
            <Container>
                <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                        size="large"  onClick={() => {
                    create_course().then(() => refetch())
                }}>
                    Создать новый курс
                </Button>

                {own_course_data?.cardCourse.map((course, cIndex) =>{
                    return(
                        <CourseMicroView key={cIndex} course={course}/>
                    )
                }) }
            </Container>
        </div>
    )
}