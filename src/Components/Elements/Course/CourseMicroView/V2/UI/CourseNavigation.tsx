import React from 'react';

import { Pagination } from '@mui/material';
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {observer} from "mobx-react";
import RowFragment from "./##RowFragment";

type CourseNavigationProps = {
    courseStore: CourseMicroStoreByID
}
const CourseNavigation = observer(({courseStore}: CourseNavigationProps) => {
    return(
        <div>
            {courseStore?.course?.map((courseRow, CRI) =>{
                return(
                    <RowFragment key={CRI + "NavigationRow"} CRI={CRI} courseStore={courseStore} />
                )
            })}
            <Pagination
                page={courseStore.position.activePage}
                onChange={courseStore.changeActivePage}
                style={{marginLeft: 6}}
                count={courseStore?.courseData[0].SameLine.length}
                shape="rounded" size="small" />

        </div>
    )
})

export default CourseNavigation