import React, {useEffect, useState} from 'react';

import {Box, Divider, Pagination, Stack, Typography} from '@mui/material';
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {observer} from "mobx-react";
import RowFragment from "./RowFragment";
import axiosClient from "../../../../../ServerLayer/QueryLayer/config";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {useNavigate} from "react-router-dom";


type CourseNavigationProps = {
    courseStore: CourseMicroStoreByID
}
const CourseNavigation = observer(({courseStore}: CourseNavigationProps) => {
    const navigate = useNavigate()

    const [courseData, setCourseData] = useState<null | any>(null)

    useEffect(() => {
        if (courseStore.id) {
            axiosClient.get("/page/course-by-id/get-course-by-id/" + courseStore.id)
                .then(res => setCourseData(res.data))
        }
    }, [courseStore.id])

    function handleAuthorClick() {
        navigate('/author/' + courseData?.users_customuser.id)
    }

    const profile = courseData?.users_customuser?.users_userprofile


    return (
        <Stack direction={"row"}>
            <div>
                <Typography
                    variant={"subtitle2"}
                    sx={{p: 1, width: 500}}>
                    {courseStore?.courseName}
                </Typography>
                {profile &&
                    <Typography variant="caption"
                                onClick={handleAuthorClick}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    cursor: 'pointer',
                                }}>
                        <OpenInNewIcon fontSize={"small"} sx={{mr: 1}}/>
                        {profile?.firstname || ''} {" "} {profile?.lastname || ''}
                    </Typography>}
                <Divider/>
                <Box>
                    {courseStore?.course?.map((courseRow, CRI) => {
                        return (
                            <RowFragment key={CRI + "NavigationRow"} CRI={CRI} courseStore={courseStore}/>
                        )
                    })}

                    <Box sx={{width: 500}}>
                        <Pagination
                            sx={{p: 1, width: '100%'}}

                            variant="outlined"
                            count={courseStore?.courseData[0].SameLine.length}
                            page={courseStore.position.activePage}
                            onChange={(event, page) => courseStore.setActivePage(page)}
                            color="primary"
                            disabled={Number(courseStore?.courseData[0].SameLine.length) <= 1}
                        />
                    </Box>
                </Box>

                {/*<Divider/>*/}


            </div>
        </Stack>
    )
})

export default CourseNavigation
