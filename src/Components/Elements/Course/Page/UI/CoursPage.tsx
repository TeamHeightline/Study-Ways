import {observer} from "mobx-react";
import React from 'react';
import {CPSObject} from "../Store/CoursePageStore";
import {Grid} from "@mui/material";
import MicroCourseForPage from "./MicroCourseForPage";

interface ICoursePageProps extends React.HTMLAttributes<HTMLDivElement>{

}

const CoursePage = observer(({...props}: ICoursePageProps) =>{
    return(
        <div {...props}>
            <Grid container
                  sx={{pt:2}}
                  justifyContent={"space-evenly"}
                  spacing={4}
                  rowSpacing={2}>
                {CPSObject.courseArray?.map((course_id) =>{
                    return(
                        <Grid item>
                            <MicroCourseForPage course_id={Number(course_id)}/>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
})

export default CoursePage