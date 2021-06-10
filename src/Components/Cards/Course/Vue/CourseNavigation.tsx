import React from 'react';
import {Row} from "antd";
import {Button} from "@material-ui/core";
import NavigationRow from "./#NavigationRow";
export default function CourseNavigation({course, ...props}: any){
    // console.log(course)
    return(
        <div>
            
            <div style={{width: 820, overflowY: "scroll", marginBottom:5}}>
                {course.courseData.map((courseRow, CRI) =>{
                    return(
                        <NavigationRow key={CRI + "NavigationRow"} courseRow={courseRow}/>
                    )
                })}
                <br/>
                {/*<NavigationRow/>*/}
                {/*<NavigationRow/>*/}
                {/*<NavigationRow/>*/}
            </div>
        </div>
    )
}