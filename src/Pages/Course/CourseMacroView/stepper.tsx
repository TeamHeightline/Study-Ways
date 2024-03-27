import {Box, IconButton, Slider, Stack} from "@mui/material";
import {StackProps} from "@mui/material/Stack/Stack"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from "react";
import Pagination from '@mui/material/Pagination';

interface ICourseSliderProps extends StackProps {
    activePage: number,
    setActivePage: (newPage: number) => void,
    courseData: any
}

export default function Stepper({activePage, setActivePage, courseData, ...props}: ICourseSliderProps) {

    return (
        <Box sx={{p: 1}} {...props}>
            <Pagination
                variant={"outlined"}
                count={courseData.course_data[0].SameLine.length}
                page={activePage}
                onChange={(event, page) => setActivePage(page)}
                color="primary"
                disabled={Number(courseData.course_data[0].SameLine.length) <= 1}
            />
        </Box>
    )
}
