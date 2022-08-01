import React from 'react';
import {Box, Card, CardActionArea, Collapse, IconButton, Stack, Typography} from "@mui/material";
import CourseNavigation from "./CourseNavigation";
import ArrowNavigation from "./ArrowNavigation";
import {FILE_URL} from "../../../settings";
import {ICourseData, ICoursePosition} from "./types";
import {amber, blue, cyan, green, indigo, lime, orange, purple, red, teal, yellow} from '@mui/material/colors';
import {alpha, darken} from "@mui/material/styles";
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
    const colorAfterCorrection = darken(courseColor[300], 0.25)
    const colorAfterCorrectionWithAlpha = alpha(colorAfterCorrection, 0.42)

    return (
        <>
            <Card variant="outlined"
                  sx={{
                      borderRadius: "12px",
                      boxShadow: `0 0 42px 0 ${colorAfterCorrectionWithAlpha}`,
                      width: 360,
                  }}
            >
                <Card
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{
                        height: 170,
                        padding: 0,
                        backgroundColor: colorAfterCorrection,
                        borderRadius: "12px",
                        boxShadow: `0 0 42px 0 ${colorAfterCorrectionWithAlpha}`,
                    }}
                    variant="elevation">
                    <CardActionArea>
                        <Stack direction="row" alignItems="stretch">
                            <Box sx={{
                                height: 171,
                                width: 170,
                                padding: 0,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundImage: "url(" + FILE_URL + "/" + courseData?.cards_cardcourseimage?.image + ")"
                            }}>
                                <Box sx={{
                                    height: 171,
                                    width: 170,
                                }}/>
                            </Box>
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
                    </CardActionArea>
                </Card>

                <Collapse in={isOpen} unmountOnExit>
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
            {
                coursePosition &&
                <ArrowNavigation coursePosition={coursePosition} courseData={courseData}
                                 onChangePosition={onChangePosition}/>
            }
        </>
    )
}
