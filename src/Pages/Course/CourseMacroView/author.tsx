import {Box, Typography} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React from "react";
import {useNavigate} from "react-router-dom";

interface Props {
    courseData: any
}

export default function Author(props: Props) {
    const {courseData} = props
    const navigate = useNavigate()

    const profile = courseData?.users_customuser?.users_userprofile

    function handleClick() {
        navigate('/author/' + courseData?.users_customuser.id)
    }

    if (!profile) {
        return null
    }

    return (
        <Box>
            <Typography variant="h5"
                        onClick={handleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }}>
                <OpenInNewIcon fontSize={"medium"} sx={{mr: 1}}/>
                {profile?.firstname || ''} {" "} {profile?.lastname || ''}
            </Typography>
        </Box>
    )
}
