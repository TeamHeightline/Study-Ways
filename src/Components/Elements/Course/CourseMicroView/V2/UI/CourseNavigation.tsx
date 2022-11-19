import React from 'react';

import {Box, Divider, IconButton, Slider, Stack, Typography} from '@mui/material';
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {observer} from "mobx-react";
import RowFragment from "./RowFragment";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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


                <Box>

                    {courseStore?.course?.map((courseRow, CRI) => {
                        return (
                            <RowFragment key={CRI + "NavigationRow"} CRI={CRI} courseStore={courseStore}/>
                        )
                    })}
                    <Stack direction={"row"} alignItems={"center"}>
                        <IconButton color="primary"
                                    onClick={() => courseStore.setActivePage(courseStore.position.activePage - 1)}
                                    disabled={courseStore.position.activePage === 1 || Number(courseStore?.courseData[0].SameLine.length) <= 1}>
                            <ArrowBackIosIcon/>
                        </IconButton>

                        <Slider
                            sx={{width: 270}}
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

                        <IconButton color="primary"
                                    onClick={() => courseStore.setActivePage(courseStore.position.activePage + 1)}
                                    disabled={courseStore.position.activePage === courseStore?.courseData[0].SameLine.length || Number(courseStore?.courseData[0].SameLine.length) <= 1}>
                            <ArrowForwardIosIcon/>
                        </IconButton>
                    </Stack>
                </Box>

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
