import {Box, Card, Divider, Grid, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useEffect, useState} from "react";
import axiosClient from "../../../ServerLayer/QueryLayer/config";
import {positionDataI} from "../CourseMicroView/V2/Store/CourseMicroStoreByID";
import Image from "./image";
import Stepper from "./stepper";
import CardRow from "./card-row";
import Title from "./title";
import Author from "./author";

interface ICourseMacroViewProps extends BoxProps {
    courseID: number
    onCardSelect?: (card_id: string) => void,
    positionData: positionDataI,

}

const CARD_WIDTH = 108
const CARD_PADDING = 11.5
const NUMBER_OF_CARD = 10
const ADDITIONAL_SPACE = 20

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
            const cardID = courseData?.course_data?.[Number(positionData?.selectedRow)]
                ?.SameLine?.[Number(positionData.selectedPage) - 1]
                ?.CourseFragment?.[Number(positionData?.selectedIndex)]?.CourseElement?.id

            if (!cardID) {
                return
            }
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
    const course_main_line_index = Number((courseData?.name || "").match(/\[(.*?)\]/)?.[1]) - 1

    return (
        <Box {...props}>


            <Stack direction={"row"} spacing={1}>
                <Image courseData={courseData} courseID={courseID}
                       HEIGHT_OF_COURSE_MACRO_VIEW={200}/>
                <Box>
                    <Title courseData={courseData}/>
                    <Author courseData={courseData}/>
                </Box>
            </Stack>

            <Box sx={{
                width: (CARD_WIDTH + CARD_PADDING) * NUMBER_OF_CARD + ADDITIONAL_SPACE,
                overflow: "auto",
                p: 1
            }}>
                <Stack sx={{width: (CARD_WIDTH + CARD_PADDING) * NUMBER_OF_CARD}} spacing={1}>
                    {courseData.course_data?.map((line, index) => (
                        <CardRow key={index} index={index} activePage={activePage} courseData={courseData}
                                 CARD_WIDTH={CARD_WIDTH} course_main_line_index={course_main_line_index}
                                 positionData={positionData} courseID={courseID} viewedCardIDs={viewedCardIDs}/>
                    ))}
                </Stack>
            </Box>
            <Stepper activePage={activePage} setActivePage={setActivePage}
                     courseData={courseData}/>

        </Box>
    )
}
