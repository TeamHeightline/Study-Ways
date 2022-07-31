import React from 'react';
import {Box, Card, CardActionArea, Collapse, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import CourseNavigation from "./CourseNavigation";
import ArrowNavigation from "./ArrowNavigation";
import {FILE_URL} from "../../../settings";
import {ICourseData, ICoursePosition} from "./types";
import {amber, blue, cyan, green, indigo, lime, orange, purple, red, teal, yellow} from '@mui/material/colors';
import {darken} from "@mui/material/styles";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ICourseMicroViewProps extends React.HTMLAttributes<HTMLDivElement> {
    courseData: ICourseData,
    coursePosition?: ICoursePosition,
    onChangePosition?: (elementPosition: ICoursePosition) => void,
}

const colors = [blue, amber, red, cyan, green, lime, indigo, yellow, teal, purple, orange];

export default function CourseByData({courseData, coursePosition, onChangePosition}: ICourseMicroViewProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const courseColor = colors[courseData.id % colors.length];

    return (
        <div style={{
            padding: 0,
            overflowX: "auto",
        }}>
            <Card variant="outlined" sx={{borderRadius: "12px"}}>
                <Card style={{
                    padding: 0,
                    height: 170,
                    width: 360,
                    backgroundColor: darken(courseColor[300], 0.25),
                    borderRadius: "12px"
                }}
                      variant="elevation">
                    <Stack direction="row" alignItems="stretch">

                        <Tooltip title={<div>{courseData.name?.toUpperCase()}</div>}>
                            <CardActionArea
                                onClick={() => setIsOpen(!isOpen)}
                                style={{
                                    height: 170,
                                    width: 170,
                                    padding: 0,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: "url(" + FILE_URL + "/" + courseData?.cards_cardcourseimage?.image + ")"
                                }}
                            >
                                <div style={{width: 170, height: 171,}}/>
                            </CardActionArea>
                        </Tooltip>
                        <Stack direction={"column"} sx={{p: 1}}>
                            <Stack direction={"column"} justifyContent={"space-between"} sx={{height: 155}}>
                                <Typography variant={"h6"} sx={{fontSize: "1.15rem", wordSpace: "pre-wrap"}}>
                                    {courseData.name}
                                </Typography>

                                <Stack alignItems={"end"} sx={{width: 174}}>
                                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                                        <KeyboardArrowDownIcon/>
                                    </IconButton>
                                </Stack>

                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
                <Collapse in={isOpen}>
                    <Box sx={{
                        p: 0,
                        width: 360,
                        borderTop: "none",
                        borderTopLeftRadius: "none",
                        borderTopRightRadius: "none"
                    }}>

                        <CourseNavigation courseData={courseData} coursePosition={coursePosition}
                                          onChangePosition={onChangePosition}/>
                    </Box>
                </Collapse>
            </Card>
            {coursePosition &&
                <ArrowNavigation coursePosition={coursePosition} courseData={courseData}
                                 onChangePosition={onChangePosition}/>}
        </div>
    )
}
