import {observer} from "mobx-react";
import React from 'react';
import {CPSObject} from "../Store/CoursePageStore";
import {Grid} from "@mui/material";
import CourseMicroView from "../../CourseMicroView/V2/UI/CourseMicroView";
import {Helmet} from "react-helmet";

interface ICoursePageProps extends React.HTMLAttributes<HTMLDivElement> {

}

const CoursePage = observer(({...props}: ICoursePageProps) => {
    return (
        <div {...props}>
            <Helmet>
                <title>Курсы</title>
            </Helmet>

            <Grid container
                  sx={{pt: 2}}
                  justifyContent={"space-evenly"}
                  spacing={4}
                  rowSpacing={2}>
                {CPSObject.courseArray?.map((course_id) => {
                    return (
                        <Grid item key={course_id + "Course"}>
                            <CourseMicroView course_id={Number(course_id)}/>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
})

export default CoursePage