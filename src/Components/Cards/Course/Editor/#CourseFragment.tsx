import React, {useState} from 'react';
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";

export default function CourseFragment({fragment, ...props}: any){

    console.log(fragment)

    return(
        <Col>
            <div style={{width: 2000}}>
                <Row gutter={[16, 16]}>
                    {fragment.CourseFragment.map((item, iIndex) =>{
                        // console.log(item)
                        return(
                            <Col span={2} key={`${iIndex}_${item}`} >
                            <EditCourseItem item_id={item.CourseElement.id}
                                            item_position={iIndex}
                                            updateItem={(new_data) =>{
                                                // console.log(new_data)
                                                fragment.CourseFragment[new_data.itemPosition].CourseElement.id = new_data.itemID
                                                // console.log(fragment.CourseFragment)
                                                props.updateFragment(fragment)
                                            }}
                            />
                        </Col>)
                    })}
                </Row>
            </div>
        </Col>
    )
}