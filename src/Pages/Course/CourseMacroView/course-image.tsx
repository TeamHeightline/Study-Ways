import {Box, Card} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";

interface ICourseImageProps extends BoxProps {
    courseData: any,
    courseID: number | null,
    HEIGHT_OF_COURSE_MACRO_VIEW: number
}

export default function CourseImage({courseData, courseID, HEIGHT_OF_COURSE_MACRO_VIEW, ...props}: ICourseImageProps) {
    const courseUrl = courseData?.cards_cardcourseimage?.image ?
        "url(https://storage.googleapis.com/study-ways-files/" + courseData.cards_cardcourseimage.image + ")"
        :
        "url(https://storage.googleapis.com/study-ways-files/cards-course-images/course/" + courseID + ")"
    return (
        <Box {...props}>
            <Card variant={"outlined"}
                  sx={{
                      width: HEIGHT_OF_COURSE_MACRO_VIEW, height: HEIGHT_OF_COURSE_MACRO_VIEW,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: courseUrl
                  }}/>
        </Box>
    )
}
