import {Box, Skeleton} from "@mui/material";
import React from "react";

interface IProps {
    size: {
        width: number,
        height: number
    },
}

export default function NotLoaded(props: IProps) {
    const {size} = props
    return (
        <Box sx={size}>
            <Skeleton variant="rectangular" width={size.width} height={size.height}/>
        </Box>
    )
}