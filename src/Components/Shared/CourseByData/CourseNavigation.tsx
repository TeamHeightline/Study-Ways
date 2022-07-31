import React from 'react';

import {Paper, Slider, Stack} from '@mui/material';
import {observer} from "mobx-react";
import RowFragment from "./RowFragment";
import {ICourseData, ICoursePosition} from "./types";

type CourseNavigationProps = {
    courseData: ICourseData,
    coursePosition?: ICoursePosition,
    onChangePosition?: (elementPosition: ICoursePosition) => void,

}
const CourseNavigation = observer(({courseData, coursePosition, onChangePosition}: CourseNavigationProps) => {
    const [activePage, setActivePage] = React.useState(Number(coursePosition?.activePage) || 1);

    // @ts-ignore
    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setActivePage(newValue)
        }
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <Stack direction={"row"}>
            <Paper elevation={0} sx={{pt: 2, pb: 2}}>
                <Slider
                    value={activePage}
                    onChange={handleChange}
                    orientation="vertical"
                    valueLabelDisplay="auto"
                    disabled={Number(courseData.course_data[0].SameLine.length) <= 1}
                    min={1}
                    marks
                    step={1}
                    max={courseData.course_data[0].SameLine.length}
                />
            </Paper>
            <div>
                {courseData.course_data?.map((courseRow, rowIndex) => {
                    return (
                        <RowFragment
                            positionData={coursePosition}
                            activePage={activePage}
                            courseRow={courseRow}
                            rowIndex={rowIndex}
                            courseID={courseData.id}
                            onChangePosition={onChangePosition}
                            key={rowIndex + "NavigationRow"}/>
                    )
                })}

                {/*<Divider/>*/}
                {/*<Typography*/}
                {/*    variant={"body2"}*/}
                {/*    sx={{*/}
                {/*        p: 0.5*/}
                {/*    }}>*/}
                {/*    {courseData.name}*/}
                {/*</Typography>*/}
            </div>
        </Stack>
    )
})

export default CourseNavigation
