import React from 'react';
import {Row} from "antd";
import CourseFragment from "./#CourseFragment";
export default function CourseRow(){
    return(
        <div style={{width: 4000}}>
            <br/>
            <Row>
                <CourseFragment/>
                <CourseFragment/>
            </Row>
            <br/>
        </div>
    )
}