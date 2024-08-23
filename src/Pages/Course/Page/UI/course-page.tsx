import {Box, Grid} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React, {useEffect} from "react";
import {RootState, useAppDispatch} from "../../../../ReduxStore/RootStore";
import {useSelector} from "react-redux";
import CourseByData from "./CourseByData";
import {Helmet} from "react-helmet";
import {loadCourseDataThunk} from "../redux-store/async-functions";
import {useNavigate} from "react-router-dom";
import UISearch from "./ui-search";

interface ICoursePageProps extends BoxProps {

}

const DEFAULT_COURSE_TITLE = "Название курса по умолчанию"

export default function CoursePage({...props}: ICoursePageProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const courses = useSelector((state: RootState) => state.coursePage.courses_data);

    useEffect(() => {
        dispatch(loadCourseDataThunk())
    }, [])

    const coursesWithContent = courses.filter((course) => course.name !== DEFAULT_COURSE_TITLE)

    return (
        <Box {...props} sx={{overflow: "auto"}}>
            <Helmet>
                <title>Курсы</title>
            </Helmet>
            <UISearch/>
            <Grid container
                  sx={{pt: 2}}
                  justifyContent={"center"}
                  spacing={2}
                  rowSpacing={2}>
                {coursesWithContent?.map((course_data) => {
                    return (
                        <Grid item key={course_data.id} xl={3} md={4} sm={6} xs={12}>
                            <CourseByData
                                courseData={course_data}
                                onChangePosition={(position) => {
                                    if (location.pathname === "/course") {
                                        navigate("/course?" + "id=" + course_data.id +
                                            "&activePage=" + position.activePage +
                                            "&selectedPage=" + position.activePage +
                                            "&selectedRow=" + position.selectedRow +
                                            "&selectedIndex=" + position.selectedIndex, {replace: true})
                                    } else {
                                        navigate("/course?" + "id=" + course_data.id +
                                            "&activePage=" + position.activePage +
                                            "&selectedPage=" + position.activePage +
                                            "&selectedRow=" + position.selectedRow +
                                            "&selectedIndex=" + position.selectedIndex)
                                    }
                                }}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
