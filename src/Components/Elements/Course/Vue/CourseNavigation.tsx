import React from 'react';
import NavigationRow from "./#NavigationRow";
import "../../../../index.css"

export default function CourseNavigation({course, ...props}: any){
    // console.log(course)
    return(
        <div>
            <div style={{width: 350, overflowX: "auto"}}>
                {course.courseData.length !== 0 && course.courseData.map((courseRow, CRI) =>{
                    return(
                        <>
                            <NavigationRow
                                buttonClick={(data) =>{
                                data.row = CRI
                                // console.log(data)
                                props.buttonClick(data)
                            }}
                               key={CRI + "NavigationRow"} CRI={CRI} courseRow={courseRow}
                               cardPositionData={props.cardPositionData}
                            />
                        </>
                    )
                })}
            </div>
        </div>
    )
}