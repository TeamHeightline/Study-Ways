import React, {useState} from 'react';
import NavigationRow from "./#NavigationRow";
import "../../../../index.css"
import {Pagination} from "@material-ui/lab";

export default function CourseNavigation({course, ...props}: any){
    // console.log(course)
    const [openPage, setOpenPage] = useState(props.cardPositionData? props.cardPositionData.openPage : 1)

    return(
        <div>
            <div style={{width: 290, overflowX: "auto"}}>
                {course.courseData.length !== 0 && course.courseData.map((courseRow, CRI) =>{
                    return(
                        <>
                            <NavigationRow
                                openPage={openPage}
                                buttonClick={(data) =>{
                                    data.row = CRI
                                    data.openPage = openPage
                                // console.log(data)
                                props.buttonClick(data)
                            }}
                               key={CRI + "NavigationRow"} CRI={CRI} courseRow={courseRow}
                               cardPositionData={props.cardPositionData}
                            />
                        </>
                    )
                })}
                <Pagination
                    page={openPage}
                    onChange={(e, value) =>{setOpenPage(value)}}
                    style={{marginLeft: 6}} count={course.courseData[0].SameLine.length}
                    shape="rounded" size="small" />
            </div>
        </div>
    )
}