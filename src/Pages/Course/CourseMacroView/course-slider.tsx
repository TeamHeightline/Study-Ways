import {IconButton, Slider, Stack} from "@mui/material";
import {StackProps} from "@mui/material/Stack/Stack"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from "react";

interface ICourseSliderProps extends StackProps {
    activePage: number,
    setActivePage: (newPage: number) => void,
    courseData: any
}

export default function CourseSlider({activePage, setActivePage, courseData, ...props}: ICourseSliderProps) {

    function handleChange(e, newValue) {
        if (newValue) {
            setActivePage(newValue)
        }
    }

    return (
        <Stack direction={"row"} alignItems={"center"} {...props}>
            <IconButton color="primary"
                        onClick={() => setActivePage(activePage - 1)}
                        disabled={activePage === 1 || Number(courseData.course_data[0].SameLine.length) <= 1}>
                <ArrowBackIosIcon/>
            </IconButton>

            <Slider
                sx={{width: "100%"}}
                size={"small"}
                value={activePage}
                onChange={handleChange}
                orientation="horizontal"
                valueLabelDisplay="auto"
                disabled={Number(courseData.course_data[0].SameLine.length) <= 1}
                min={1}
                marks
                step={1}
                max={courseData.course_data[0].SameLine.length}
            />

            <IconButton color="primary"
                        onClick={() => setActivePage(activePage + 1)}
                        disabled={activePage === courseData.course_data[0].SameLine.length || Number(courseData.course_data[0].SameLine.length) <= 1}>
                <ArrowForwardIosIcon/>
            </IconButton>
        </Stack>
    )
}
