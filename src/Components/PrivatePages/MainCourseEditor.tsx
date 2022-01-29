import React, {useState} from 'react'
import {Button, Container, Grid} from "@mui/material";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import EditCourseByID, {CourseLines} from "../Elements/Course/Editor/EditCourseByID";
import CourseMicroView from '../Elements/Course/CourseMicroView/V2/UI/CourseMicroView';


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
                <Grid container justifyContent="space-evenly" sx={{pt: 2}} style={{overflow: "auto"}}>
                    {own_course_data?.me.cardcourseSet.map((course) =>{
                        return(
                            <Grid item xs={"auto"} key={"CourseID" + course.id}>
                                <CourseMicroView
                                    onClick={()=>{
                                        setSelectedCourseID(course.id)
                                        setIsEditCourseNow(true)
                                    }}
                                    course_id={Number(course.id)}
                                    key={"CourseID" + course.id}/>
                            </Grid>
                        )
                    }) }
                </Grid>
            </Container>
        </div>
    )
}