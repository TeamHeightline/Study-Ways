import {Box, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";

interface ICourseTitleProps extends BoxProps {
    courseData: any
}

export default function CourseTitle({courseData, ...props}: ICourseTitleProps) {

    return (
        <Box {...props}>
            <Typography variant={"h5"} sx={{p: 0.5}}>
                {courseData?.name.replace(/\[.*?\]/g, '')}
            </Typography>
        </Box>
    )
}
