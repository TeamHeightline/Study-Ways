import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import {CourseMicroStoreByID, positionDataI} from "../Store/CourseMicroStoreByID";
import {Card, CardActionArea, Stack, Tooltip, Typography} from "@mui/material";
import CourseNavigation from "./CourseNavigation";
import ArrowNavigation from "./ArrowNavigation";
import {useHistory} from "react-router-dom";

interface ICourseMicroViewProps extends React.HTMLAttributes<HTMLDivElement>{
    course_id: number,
    position_data?: positionDataI,
    onPosition?: (selected_position: positionDataI) => void,
    onCardSelect?: (selected_card_id: number | undefined) => void,
    onCourseImageClick?: (clicked: string) => void,
    showArrowNavigation?: boolean
}

const CourseMicroView = observer(({
                                      course_id,
                                      position_data,
                                      onPosition,
                                      showArrowNavigation,
                                      onCardSelect,
                                      ...props}: ICourseMicroViewProps) =>{
    const [courseStore] = useState(new CourseMicroStoreByID(course_id))
    const history = useHistory()
    useEffect(()=> courseStore.changeID(course_id), [course_id])

    useEffect(()=> {
        if(onPosition && courseStore.position && courseStore.isPositionChanged){
            onPosition(courseStore.position)
            courseStore.isPositionChanged = false
        }}, [courseStore.position])

    useEffect(()=>{
        if(onCardSelect){
            onCardSelect(Number(courseStore.get_card_id_by_position(courseStore.position)))
        }
    }, [Number(courseStore.get_card_id_by_position(courseStore.position))])

    useEffect(()=> {
        if(position_data){
            courseStore.positionData = position_data
        }
    }, [position_data])

    return(
        <div {...props} style={{padding: 0, overflowX: "auto"}}>
            <Card style={{padding: 0, width:530, height: 160}} variant="outlined">
                <Stack direction="row">
                    <Tooltip title={<div>{courseStore?.courseName?.toUpperCase()}</div>}>
                        <CardActionArea
                            onClick={()=>{
                                history.push("./course?" + "id=" + course_id +
                                    "&activePage=1" +
                                    "&selectedPage=1" +
                                    "&selectedRow=0" +
                                    "&selectedIndex=0")
                            }}
                            style={{
                                width:200,
                                height: 164,
                                backgroundSize: "cover",
                                backgroundImage: courseStore.courseImage ?
                                    "url(" + courseStore.courseImage + ")":
                                    "url('https://storage.googleapis.com/sw-files/cards-course-images/course/'" +
                                courseStore.id + ")"}}
                            >
                            <Typography
                                style={{
                                    background: "rgba(10,33,49,0.73)",
                                    backdropFilter: "blur(5px)",
                                    fontFamily: "system-ui",
                                    fontSize: 15,
                                    color: "white",
                                    textAlign: "center",
                                }}>
                                {courseStore?.courseName?.toUpperCase()}
                            </Typography>
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