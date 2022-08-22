import React from 'react';

import {Divider, Slider, Stack, Typography} from '@mui/material';
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
            <div>

                {courseStore?.course?.map((courseRow, CRI) => {
                    return (
                        <RowFragment key={CRI + "NavigationRow"} CRI={CRI} courseStore={courseStore}/>
                    )
                })}

                <Slider
                    sx={{width: 320, mx: 1}}
                    size={"small"}
                    value={courseStore.position.activePage}
                    onChange={handleChange}
                    orientation="horizontal"
                    valueLabelDisplay="auto"
                    disabled={Number(courseStore?.courseData[0].SameLine.length) <= 1}
                    min={1}
                    marks
                    step={1}
                    max={courseStore?.courseData[0].SameLine.length}
                />
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
