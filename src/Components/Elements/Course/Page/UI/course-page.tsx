import {Box, Grid} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React, {useEffect} from "react";
import {RootState, useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";
import CourseByData from "../../../../Shared/CourseByData/CourseMicroView";
import {Helmet} from "react-helmet";
import {loadCourseDataThunk} from "../redux-store/AsyncFunctions";
import {useNavigate} from "react-router-dom";

interface ICoursePageProps extends BoxProps {

}

export default function CoursePage({...props}: ICoursePageProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const courses = useSelector((state: RootState) => state.coursePage.courses_data);
    useEffect(() => {
        dispatch(loadCourseDataThunk())
    }, [])
    return (
        <Box {...props} sx={{overflow: "auto"}}>
            <Helmet>
                <title>Курсы</title>
            </Helmet>
            <Grid container
                  sx={{pt: 2, minWidth: "500px"}}
                  justifyContent={"space-evenly"}
                  spacing={4}
                  rowSpacing={2}>
                {courses?.map((course_data) => {
                    return (
                        <Grid item key={course_data.id}>
                            <CourseByData
                                courseData={course_data}
                                onChangePosition={(position) => {
                                    navigate("/course?" + "id=" + course_data.id +
                                        "&activePage=" + position.activePage +
                                        "&selectedPage=" + position.activePage +
                                        "&selectedRow=" + position.selectedRow +
                                        "&selectedIndex=" + position.selectedIndex)
                                }}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
