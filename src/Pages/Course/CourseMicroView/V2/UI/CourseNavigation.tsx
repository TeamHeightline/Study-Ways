import React from 'react';

import {Box, Divider, IconButton, Pagination, Slider, Stack, Typography} from '@mui/material';
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
                <Typography
                    variant={"subtitle2"}
                    sx={{p: 1}}>
                    {courseStore?.courseName}
                </Typography>
                <Divider/>
                <Box>
                    {courseStore?.course?.map((courseRow, CRI) => {
                        return (
                            <RowFragment key={CRI + "NavigationRow"} CRI={CRI} courseStore={courseStore}/>
                        )
                    })}

                    <Box sx={{width: '500px'}}>
                        <Pagination
                            sx={{p: 1, width: '100%'}}

                            variant="outlined"
                            count={courseStore?.courseData[0].SameLine.length}
                            page={courseStore.position.activePage}
                            onChange={(event, page) => courseStore.setActivePage(page)}
                            color="primary"
                            disabled={Number(courseStore?.courseData[0].SameLine.length) <= 1}
                        />
                    </Box>
                </Box>

                {/*<Divider/>*/}


            </div>
        </Stack>
    )
})

export default CourseNavigation
