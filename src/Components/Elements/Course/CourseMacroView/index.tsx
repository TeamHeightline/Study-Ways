import {Box, Card, Divider, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useEffect, useState} from "react";
import axiosClient from "../../../../ServerLayer/QueryLayer/config";
import {positionDataI} from "../CourseMicroView/V2/Store/CourseMicroStoreByID";
import CourseImage from "./course-image";
import CourseSlider from "./course-slider";
import CardRow from "./card-row";
import CourseTitle from "./course-title";

interface ICourseMacroViewProps extends BoxProps {
    courseID: number
    onCardSelect?: (card_id: string) => void,
    positionData: positionDataI,

}

const CARD_WIDTH = 108
const CARD_PADDING = 11.5
const NUMBER_OF_CARD = 10
const ADDITIONAL_SPACE = 20
const HEIGHT_OF_COURSE_MACRO_VIEW = 425

export default function CourseMacroView({courseID, positionData, onCardSelect, ...props}: ICourseMacroViewProps) {
    const [courseData, setCourseData] = useState<null | any>(null)
    const [activePage, setActivePage] = useState(0)
    const [viewedCardIDs, setViewedCardIds] = useState(new Set())

    useEffect(() => {
        if (courseID) {
            axiosClient.get("/page/course-by-id/get-course-by-id/" + courseID)
                .then(res => setCourseData(res.data))
        }
    }, [courseID])

    useEffect(() => {
        if (onCardSelect) {
            const cardID = courseData?.course_data?.[Number(positionData.selectedRow)]
                .SameLine?.[Number(positionData.selectedPage) - 1]
                .CourseFragment?.[Number(positionData.selectedIndex)]?.CourseElement?.id

            onCardSelect(cardID)
            setViewedCardIds(viewedCardIDs.add(cardID))
        }
    }, [positionData, onCardSelect, courseData])

    useEffect(() => {
        setActivePage(positionData.activePage)
    }, [positionData.activePage])


    if (!courseData) {
        return <Box {...props}/>
    }
    const course_main_line_index = Number(courseData.name.match(/\[(.*?)\]/)?.[1]) - 1

    return (
        <Box {...props}>

            <Card variant={"outlined"} sx={{
                width: (CARD_WIDTH + CARD_PADDING) * NUMBER_OF_CARD + HEIGHT_OF_COURSE_MACRO_VIEW + ADDITIONAL_SPACE,
                height: HEIGHT_OF_COURSE_MACRO_VIEW
            }}>
                <Stack direction={"row"}>
                    <CourseImage courseData={courseData} courseID={courseID}
                                 HEIGHT_OF_COURSE_MACRO_VIEW={HEIGHT_OF_COURSE_MACRO_VIEW}/>
                    <Box>
                        <Box sx={{
                            width: (CARD_WIDTH + CARD_PADDING) * NUMBER_OF_CARD + ADDITIONAL_SPACE,
                            overflow: "auto",
                            p: 1
                        }}>
                            <Stack sx={{width: (CARD_WIDTH + CARD_PADDING) * NUMBER_OF_CARD}} spacing={1}>
                                <CardRow index={0} activePage={activePage} courseData={courseData}
                                         CARD_WIDTH={CARD_WIDTH} course_main_line_index={course_main_line_index}
                                         positionData={positionData} courseID={courseID} viewedCardIDs={viewedCardIDs}/>
                                <CardRow index={1} activePage={activePage} courseData={courseData}
                                         CARD_WIDTH={CARD_WIDTH} course_main_line_index={course_main_line_index}
                                         positionData={positionData} courseID={courseID} viewedCardIDs={viewedCardIDs}/>
                                <CardRow index={2} activePage={activePage} courseData={courseData}
                                         CARD_WIDTH={CARD_WIDTH} course_main_line_index={course_main_line_index}
                                         positionData={positionData} courseID={courseID} viewedCardIDs={viewedCardIDs}/>
                                <CardRow index={3} activePage={activePage} courseData={courseData}
                                         CARD_WIDTH={CARD_WIDTH} course_main_line_index={course_main_line_index}
                                         positionData={positionData} courseID={courseID} viewedCardIDs={viewedCardIDs}/>
                            </Stack>
                        </Box>
                        <Box sx={{width: (CARD_WIDTH + CARD_PADDING) * NUMBER_OF_CARD + ADDITIONAL_SPACE}}>
                            <CourseSlider activePage={activePage} setActivePage={setActivePage}
                                          courseData={courseData}/>
                            <Divider/>
                            <CourseTitle courseData={courseData}/>
                        </Box>
                    </Box>
                </Stack>
            </Card>

        </Box>
    )
}
