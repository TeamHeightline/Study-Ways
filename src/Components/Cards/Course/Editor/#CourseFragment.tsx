import React from 'react';
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";

export default function CourseFragment(){
    return(
        <Col>
            <div style={{width: 2000}}>
                <Row gutter={[16, 16]}>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                        return(<Col span={2} key={id + "KEY"} >
                            <EditCourseItem item_id={id}/>
                        </Col>)
                    })}
                </Row>
            </div>
        </Col>
    )
}