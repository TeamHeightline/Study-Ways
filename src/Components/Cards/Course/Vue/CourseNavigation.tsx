import React from 'react';
import {Row} from "antd";
import {Button} from "@material-ui/core";
import NavigationRow from "./#NavigationRow";
export default function CourseNavigation({course, ...props}: any){
    // console.log(course)
    return(
        <div style={{width: 820, overflowY: "scroll", marginBottom:5}}>
            {course.courseData.map((courseRow, CRI) =>{
                return(
                    <NavigationRow key={CRI} courseRow={courseRow}/>
                )
            })}
            {/*<NavigationRow/>*/}
            {/*<NavigationRow/>*/}
            {/*<NavigationRow/>*/}
        </div>
    )
}