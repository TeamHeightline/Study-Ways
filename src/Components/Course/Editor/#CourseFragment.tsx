import React, {useState} from 'react';
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";

export default function CourseFragment({fragment, ...props}: any){

    // console.log(fragment)
    const [Fragment, setFragment] = useState(fragment.CourseFragment)
    return(
        <Col>
            <div style={{width: 2000}}>
                <Row gutter={[16, 16]}>
                    {Fragment.map((item, iIndex) =>{
                        // console.log(iIndex+ "Fragment" + props.fIndex + "row" + props.lIndex + "course" + props.cIndex)
                        return(
                            <Col span={2} key={iIndex+ "Fragment" + props.fIndex + "row" + props.lIndex + "course" + props.cIndex} >
                            <EditCourseItem item_id={item.CourseElement.id}
                                            item_position={iIndex}
                                            updateItem={(new_data) =>{
                                                const newCourseFragment = Fragment.slice()
                                                newCourseFragment[iIndex] = new_data
                                                setFragment(newCourseFragment)
                                                props.updateFragment(newCourseFragment)
                                            }}
                            />
                        </Col>)
                    })}
                </Row>
            </div>
        </Col>
    )
}