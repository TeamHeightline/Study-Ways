import React from 'react';
import {Row} from "antd";
import CourseFragment from "./#CourseFragment";
export default function CourseRow({row, ...props}: any){
    // console.log(data)
    return(
        <div style={{width: row.SameLine.length * 2000}}>
            <br/>
            <Row>
                {row.SameLine.map((fragment, fIndex)=>{
                    return(<CourseFragment key={fIndex} fragment={fragment}
                                           updateFragment={(new_data =>{
                                               // console.log(new_data)
                                               row.SameLine[fIndex] = new_data
                                               // console.log(row)
                                               props.updateCourseRow(row)
                                           })}/>)
                })}
                {/*<CourseFragment/>*/}
                {/*<CourseFragment/>*/}
            </Row>
            <br/>
        </div>
    )
}