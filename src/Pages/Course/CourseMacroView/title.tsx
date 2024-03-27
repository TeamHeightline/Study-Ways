import {Box, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";

interface ICourseTitleProps extends BoxProps {
    courseData: any
}

export default function Title({courseData, ...props}: ICourseTitleProps) {

    return (
        <Box {...props}>
            <Typography variant={"h5"}>
                {courseData?.name.replace(/\[.*?\]/g, '')}
            </Typography>
        </Box>
    )
}
