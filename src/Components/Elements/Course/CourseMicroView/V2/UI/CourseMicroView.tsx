import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import {CourseMicroStoreByID, positionDataI} from "../Store/CourseMicroStoreByID";
import {Card, CardActionArea, Divider, Stack, Tooltip, Typography} from "@mui/material";
import CourseNavigation from "./CourseNavigation";
import ArrowNavigation from "./ArrowNavigation";
import {useHistory} from "react-router-dom";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import Paper from "@mui/material/Paper";

interface ICourseMicroViewProps extends React.HTMLAttributes<HTMLDivElement> {
    course_id: number,
    position_data?: positionDataI,
    onPosition?: (selected_position: positionDataI) => void,
    onCardSelect?: (selected_card_id: number | undefined) => void,
    onCourseImageClick?: (clicked: string) => void,
    showArrowNavigation?: boolean,
    ignoreURLRedirectOnSelectCard?: boolean,
}

const CourseMicroView = observer(({
                                      course_id,
                                      position_data,
                                      onPosition,
                                      showArrowNavigation,
                                      onCardSelect,
                                      ignoreURLRedirectOnSelectCard,
                                      ...props
                                  }: ICourseMicroViewProps) => {
    const [courseStore] = useState(new CourseMicroStoreByID(course_id))
    const history = useHistory()
    const isMobile = isMobileHook()
    useEffect(() => courseStore.changeID(course_id), [course_id])

    useEffect(() => courseStore.changeIsIgnoreRouteAfterSelect(ignoreURLRedirectOnSelectCard),
        [ignoreURLRedirectOnSelectCard])

    useEffect(() => {
        if (onPosition && courseStore.position && courseStore.isPositionChanged) {
            onPosition(courseStore.position)
            courseStore.isPositionChanged = false
        }
    }, [courseStore.position])

    useEffect(() => {
        if (onCardSelect) {
            onCardSelect(Number(courseStore.get_card_id_by_position(courseStore.position)))
        }
    }, [Number(courseStore.get_card_id_by_position(courseStore.position))])

    useEffect(() => {
        if (position_data) {
            courseStore.positionData = position_data
        }
    }, [position_data])

    return (
        <div {...props}
             style={{
                 padding: 0,
                 overflowX: isMobile ? "auto" : undefined,
                 maxWidth: isMobile ? window.innerWidth - 40 : ""
             }}>
            <Card style={{padding: 0, width: 500}} variant="outlined">
                <Paper elevation={24} square sx={{
                    boxShadow: "none"
                }}>
                    <Stack alignItems={"center"}>
                        <Typography
                            sx={{
                                fontFamily: "system-ui",
                                fontSize: 15,
                                // color: "white",
                                userSelect: "none",
                                pl: 2,
                                pr: 2
                            }}>
                            {courseStore?.courseName}
                        </Typography>
                    </Stack>
                </Paper>
                <Divider/>
                <Stack direction="row" alignItems="stretch">
                    <Tooltip
                        title={<div>{courseStore?.courseName?.toUpperCase()}</div>}>
                        <CardActionArea
                            style={{
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundImage: courseStore.courseImage ?
                                    "url(" + courseStore.courseImage + ")" :
                                    "url('https://storage.googleapis.com/sw-files/cards-course-images/course/'" +
                                    courseStore.id + ")"
                            }}
                            onClick={() => {
                                history.push("./course?" + "id=" + course_id +
                                    "&activePage=1" +
                                    "&selectedPage=1" +
                                    "&selectedRow=0" +
                                    "&selectedIndex=0")
                            }}
                        >
                            <div style={{
                                width: 180,
                            }}/>
                        </CardActionArea>
                    </Tooltip>
                    <CourseNavigation courseStore={courseStore}/>
                </Stack>
            </Card>
            {showArrowNavigation && <ArrowNavigation courseStore={courseStore}/>}
        </div>
    )
})

export default CourseMicroView