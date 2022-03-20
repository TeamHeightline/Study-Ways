import React from 'react';

import {Divider, Paper, Slider, Stack, Typography} from '@mui/material';
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {observer} from "mobx-react";
import RowFragment from "./RowFragment";

type CourseNavigationProps = {
    courseStore: CourseMicroStoreByID
}
const CourseNavigation = observer(({courseStore}: CourseNavigationProps) => {
    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            courseStore.setActivePage(newValue)
        }
    };

    return (
        <Stack direction={"row"}>
            <Paper elevation={0} sx={{pt: 2, pb: 2}}>
                <Slider
                    value={courseStore.position.activePage}
                    onChange={handleChange}
                    orientation="vertical"
                    valueLabelDisplay="auto"
                    disabled={Number(courseStore?.courseData[0].SameLine.length) <= 1}
                    min={1}
                    marks
                    step={1}
                    max={courseStore?.courseData[0].SameLine.length}
                />
            </Paper>
            <div>
                {courseStore?.course?.map((courseRow, CRI) => {
                    return (
                        <RowFragment key={CRI + "NavigationRow"} CRI={CRI} courseStore={courseStore}/>
                    )
                })}

                <Divider/>
                <Typography
                    variant={"body2"}
                    sx={{
                        p: 0.5
                    }}>
                    {courseStore?.courseName}
                </Typography>
            </div>
        </Stack>
    )
})

export default CourseNavigation