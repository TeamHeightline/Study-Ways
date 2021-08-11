import React, {useState} from 'react';
import {Row} from "antd";
import CourseFragment from "./#CourseFragment";
export default function CourseRow({row, ...props}: any){
    const [RowState, setRow] = useState(row.SameLine)
    // console.log(data)
    return(
        <div style={{width: row.SameLine.length * 2000}}>
            <Row className="mt-3">
                {RowState.map((fragment, fIndex)=>{
                    return(<CourseFragment key={fIndex + "row" + props.lIndex + "course" + props.cIndex} fragment={fragment} fIndex={fIndex}
                                           lIndex={props.lIndex} cIndex={props.cIndex}
                                           updateFragment={(new_data =>{
                                               const update_fragment = {
                                                   CourseFragment: new_data
                                               }
                                               const newRow = RowState.slice()
                                               newRow[fIndex] = update_fragment
                                               // console.log(newRow)
                                               setRow(newRow)
                                                props.updateCourseRow(newRow)
                                           })}/>)
                })}
                {/*<CourseFragment/>*/}
                {/*<CourseFragment/>*/}
            </Row>
        </div>
    )
}