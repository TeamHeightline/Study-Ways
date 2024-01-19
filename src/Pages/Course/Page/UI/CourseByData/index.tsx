import React from 'react';
import {Box, Card, CardActionArea, Collapse, IconButton, Stack, Typography} from "@mui/material";
import CourseNavigation from "./CourseNavigation";
import ArrowNavigation from "./ArrowNavigation";
import {FILE_URL, REST_SERVER_URL} from "../../../../../settings";
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

    const courseColor = colors[courseData.id % colors.length];
    const colorAfterCorrection = darken(courseColor[300], 0.25)

    function openCourse() {
        if (!onChangePosition) return

        function findFirstNonEmptyCourseElementPosition(course: ICourseData): {
            page: number;
            line: number;
            position: number
        } | null {
            for (let lineIndex = 0; lineIndex < course.course_data.length; lineIndex++) {
                for (let pageIndex = 0; pageIndex < course.course_data[lineIndex].SameLine.length; pageIndex++) {
                    for (let positionIndex = 0; positionIndex < course.course_data[lineIndex].SameLine[pageIndex].CourseFragment.length; positionIndex++) {
                        if (course.course_data[lineIndex].SameLine[pageIndex].CourseFragment[positionIndex].CourseElement.id !== null &&
                            course.course_data[lineIndex].SameLine[pageIndex].CourseFragment[positionIndex].CourseElement.id !== "") {
                            return {
                                page: pageIndex,
                                line: lineIndex,
                                position: positionIndex
                            }; // Возвращаем позицию первого непустого элемента
                        }
                    }
                }
            }
            return null; // Если ничего не найдено
        }

        const positionOfFirstElement = findFirstNonEmptyCourseElementPosition(courseData)
        if (!positionOfFirstElement) {
            return;
        }
        console.log(positionOfFirstElement)

        onChangePosition({
            activePage: positionOfFirstElement.page + 1,
            selectedPage: positionOfFirstElement.page + 1,
            selectedRow: positionOfFirstElement.line,
            selectedIndex: positionOfFirstElement.position,
        })
    }

    const isCourseHasImage = !!courseData?.cards_cardcourseimage?.image
    const courseImageUrl = FILE_URL + "/" + courseData?.cards_cardcourseimage?.image

    return (
        <>
            <Card variant="outlined"
                  onClick={openCourse}
                  sx={{
                      borderRadius: 1.5,
                      width: 360,
                      display: 'flex',
                      flexDirection: 'row',
                      minHeight: '150px',
                  }}
            >
                <Box sx={{
                    width: '5px',
                    backgroundColor: colorAfterCorrection,
                    flexShrink: 0,
                }}/>
                <CardActionArea sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                }}>
                    <Stack sx={{p: 2, width: '360px'}}
                           spacing={1}
                           direction={"row"}
                           justifyContent={"space-between"}>
                        <Typography variant="h6" sx={{fontSize: "1.15rem"}}>
                            {courseData.name}
                        </Typography>
                        {isCourseHasImage &&
                            <Box>
                                <Box sx={{
                                    height: "100px",
                                    width: "100px",
                                    borderRadius: 2,
                                    backgroundColor: "black",
                                    backgroundImage: `url(${courseImageUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "block"
                                }}/>
                            </Box>}
                    </Stack>
                    <Box sx={{p: 2, alignSelf: 'flex-end'}}>
                        <Typography variant="caption" sx={{fontSize: "0.75rem", textAlign: 'right'}}>
                            {courseData?.users_customuser?.users_userprofile?.firstname || ""}
                            {" "}
                            {courseData?.users_customuser?.users_userprofile?.lastname || ""}
                        </Typography>
                    </Box>
                </CardActionArea>
            </Card>
            {
                coursePosition &&
                <ArrowNavigation coursePosition={coursePosition} courseData={courseData}
                                 onChangePosition={onChangePosition}/>
            }
        </>
    )
}
