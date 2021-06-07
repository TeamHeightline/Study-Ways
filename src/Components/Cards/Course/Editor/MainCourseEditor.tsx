import React from 'react'
import {Button, Container} from "@material-ui/core";
import {gql} from "graphql.macro";
import {useMutation} from "@apollo/client";
import {CourseLines} from "./EditCourseByID";

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

export default function ({...props}: any) {
    const [create_course, {data: create_course_data, error: create_course_error}] = useMutation(CREATE_COURSE_WITH_DEFAULT_VALUE,
        {
            variables:{
                default_data: CourseLines
            }
        })
    return(
        <div>
            <Container>
                <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                        size="large"  onClick={() => create_course()}>
                    Создать новый курс
                </Button>
            </Container>
        </div>
    )
}