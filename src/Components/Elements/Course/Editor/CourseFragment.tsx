import Stack from '@mui/material/Stack';
import React, {useState} from 'react';
import EditCourseItem from "./EditCourseItem";

export default function CourseFragment({fragment, ...props}: any) {
    const [Fragment, setFragment] = useState(fragment.CourseFragment)
    return (
        <div style={{width: 1500}}>
            <Stack direction={"row"}>
                {Fragment.map((item, iIndex) => {
                    return (
                        // <Col span={2} key={iIndex+ "Fragment" + props.fIndex + "row" + props.lIndex + "course" + props.cIndex} >
                        <EditCourseItem item_id={item.CourseElement.id}
                                        editCard={(item_id) => props.editCard(item_id)}
                                        key={iIndex + "Fragment" + props.fIndex + "row" + props.lIndex + "course" + props.cIndex}
                                        item_position={iIndex}
                                        updateItem={(new_data) => {
                                            const newCourseFragment = Fragment.slice()
                                            newCourseFragment[iIndex] = new_data
                                            setFragment(newCourseFragment)
                                            props.updateFragment(newCourseFragment)
                                        }}
                        />
                        // </Col>
                    )
                })}
            </Stack>
        </div>
    )
}