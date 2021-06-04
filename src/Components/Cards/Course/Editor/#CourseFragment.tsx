import React from 'react';
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";

export default function CourseFragment({fragment}: any){
    console.log(fragment)
    return(
        <Col>
            <div style={{width: 2000}}>
                <Row gutter={[16, 16]}>
                    {fragment.CourseFragment.map((item, iIndex) =>{
                        return(<Col span={2} key={`${iIndex}_${item}`} >
                            <EditCourseItem item_id={item.id}/>
                        </Col>)
                    })}
                </Row>
            </div>
        </Col>
    )
}