import {observer} from "mobx-react";
import {toJS} from "mobx";
import {authorPageStore} from "../Store/store";
import React, {useEffect} from "react";
import {loadCourseDataThunk} from "../../Course/Page/redux-store/async-functions";
import {RootState, useAppDispatch} from "../../../ReduxStore/RootStore";
import {useSelector} from "react-redux";
import {ICourseData} from "../../Course/Page/redux-store/types";
import CourseByData from "../../Course/Page/UI/CourseByData";

export const Courses = observer(() => {
    const dispatch = useAppDispatch()

    const authorCourses = toJS(authorPageStore.pageData?.cards_cardcourse) || []
    const coursesData = useSelector((state: RootState) => state.coursePage.courses_data);

    useEffect(() => {
        dispatch(loadCourseDataThunk())
    }, [])

    const idArray = authorCourses.map((obj) => obj.id)
    const authorCoursesData: ICourseData[] = []

    idArray.forEach((id) => {
        const courseData = coursesData.find((course) => course.id === id)
        if (courseData && courseData?.name !== DEFAULT_COURSE_TITLE) {
            authorCoursesData.push(courseData)
        }
    })

    if (authorCoursesData.length === 0) {
        return null
    }


    return (
        <Box>
            <Typography variant={'h4'}>
                Курсы автора
            </Typography>
            <Stack direction={'row'} spacing={2} sx={{overflowX: 'auto',}}>
                {authorCoursesData.map((courseData) => (
                    <Box key={courseData.id} sx={{width: {xs: 100 + 'vw', sm: 600}}}>
                        <CourseByData
                            courseData={courseData}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    )
})
import {DEFAULT_COURSE_TITLE} from "../../Course/Page/UI/course-page";

import {Box, Stack, Typography} from "@mui/material";
