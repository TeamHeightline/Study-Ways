import React, {useState} from 'react';
import {Col, Row} from "react-bootstrap";
import EditCourseItem from "./##EditCourseItem";

export default function CourseFragment({fragment, ...props}: any){
    const [Fragment, setFragment] = useState(fragment.CourseFragment)
    return(
        <Col>
            <div style={{width: 1500}}>
                <Row >
                    {Fragment.map((item, iIndex) =>{
                        return(
                            // <Col span={2} key={iIndex+ "Fragment" + props.fIndex + "row" + props.lIndex + "course" + props.cIndex} >
                            <EditCourseItem item_id={item.CourseElement.id}
                                            key={iIndex+ "Fragment" + props.fIndex + "row" + props.lIndex + "course" + props.cIndex}
                                            item_position={iIndex}
                                            updateItem={(new_data) =>{
                                                const newCourseFragment = Fragment.slice()
                                                newCourseFragment[iIndex] = new_data
                                                setFragment(newCourseFragment)
                                                props.updateFragment(newCourseFragment)
                                            }}
                            />
                        // </Col>
                        )
                    })}
                </Row>
            </div>
        </Col>
    )
}