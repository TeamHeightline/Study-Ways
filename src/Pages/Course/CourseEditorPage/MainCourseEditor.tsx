import React, {useEffect, useState} from 'react'
import {Box, Button, Card, CardActionArea, Container, Grid, Stack, Typography} from "@mui/material";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import EditCourseByID, {CourseLines} from "../EditCourseByID/EditCourseByID";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../App/ReduxStore/RootStore";
import {loadCourseDataThunk} from "../Page/redux-store/async-functions";
import {FILE_URL} from "../../../settings";


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
    const courses = useSelector((state: RootState) => state.coursePage.courses_data);
    const dispatch = useAppDispatch()


    const [create_course] = useMutation(CREATE_COURSE_WITH_DEFAULT_VALUE,
        {
            variables: {
                default_data: CourseLines
            }
        })
    const {data: own_course_data, refetch} = useQuery(GET_OWN_COURSE)

    useEffect(() => {
        dispatch(loadCourseDataThunk())
    }, [])

    if (isEditCourseNow) {
        return (
            <EditCourseByID course_id={selectedCourseID} onChange={(data) => {
                if (data === "goBack") {
                    setIsEditCourseNow(false)
                    refetch()
                }
            }}/>
        )
    }


    const myCoursesID = own_course_data?.me.cardcourseSet.map((course) => Number(course.id))
    const myCoursesData = courses?.filter((course) => myCoursesID?.includes(Number(course.id)))


    return (
        <div>
            <Container>
                <Button variant="outlined" color="primary" fullWidth sx={{mt: 2}}
                        size="large" onClick={() => {
                    create_course().then(() => refetch())
                }}>
                    Создать новый курс
                </Button>
                <Grid container justifyContent="space-evenly" sx={{pt: 2}} style={{overflow: "auto"}}>
                    {myCoursesData?.map((courseData) => {
                        const isCourseHasImage = !!courseData?.cards_cardcourseimage?.image
                        const courseImageUrl = FILE_URL + "/" + courseData?.cards_cardcourseimage?.image
                        return (
                            <Card variant="outlined"
                                  onClick={() => {
                                      setSelectedCourseID(courseData.id)
                                      setIsEditCourseNow(true)
                                  }}
                                  sx={{
                                      borderRadius: 1.5,
                                      width: 360,
                                      display: 'flex',
                                      flexDirection: 'row',
                                      minHeight: '150px',
                                  }}
                            >
                                <CardActionArea sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                }}>
                                    <Stack sx={{p: 2, width: '360px'}}
                                           spacing={1}
                                           direction={"row"}
                                           justifyContent={"space-between"}>
                                        <Typography variant="h6" sx={{fontSize: "1.15rem"}}>
                                            {courseData.name}
                                        </Typography>
                                        {isCourseHasImage &&
                                            <Box>
                                                <Box sx={{
                                                    height: "100px",
                                                    width: "100px",
                                                    borderRadius: 2,
                                                    backgroundColor: "black",
                                                    backgroundImage: `url(${courseImageUrl})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    display: "block"
                                                }}/>
                                            </Box>}
                                    </Stack>
                                    <Box sx={{p: 2, alignSelf: 'flex-end'}}>
                                        <Typography variant="caption" sx={{fontSize: "0.75rem", textAlign: 'right'}}>
                                            {courseData?.users_customuser?.users_userprofile?.firstname || ""}
                                            {" "}
                                            {courseData?.users_customuser?.users_userprofile?.lastname || ""}
                                        </Typography>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        )
                    })}
                </Grid>
            </Container>
        </div>
    )
}
