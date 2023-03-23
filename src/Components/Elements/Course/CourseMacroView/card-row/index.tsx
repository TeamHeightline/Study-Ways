import {Box, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import CardItem from "./card-element";
import React, {useState} from "react";
import EmptyElement from "./empty-element";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import CardPopover from "./card-popover";
import {positionDataI} from "../../CourseMicroView/V2/Store/CourseMicroStoreByID";
import LinkElement from "./link-element";

interface ICardRowProps extends BoxProps {
    courseData: any,
    activePage: number,
    index: number,
    CARD_WIDTH: number,
    course_main_line_index: number,
    positionData: positionDataI,
    courseID: number,
    viewedCardIDs: any,
}

interface ICourseElement {
    id: string,
    course_link: string,
    type: "course-link" | "card"
}

function isLinkItem(item) {
    return item.type === "course-link"
}

function isEmptyCardItem(item) {
    return !item?.id
}

export default function CardRow({
                                    courseData,
                                    activePage,
                                    index,
                                    CARD_WIDTH,
                                    course_main_line_index,
                                    positionData,
                                    courseID,
                                    viewedCardIDs,
                                    ...props
                                }: ICardRowProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredItemID, setHoveredItemID] = useState<string | undefined>(undefined)
    const isMobile = isMobileHook()

    function handlePopoverOpen(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    }


    function handlePopoverClose() {
        setAnchorEl(null);
    }

    function cardItemHandleMouseEnter(e, item) {
        if (!isMobile) {
            setHoveredItemID(String(item.id))
            handlePopoverOpen(e)
        }
    }

    const course_items: ICourseElement[] = courseData?.course_data[index]?.SameLine?.[activePage - 1]?.CourseFragment?.map(item => item?.CourseElement)

    const size = {
        width: CARD_WIDTH,
        height: CARD_WIDTH / 16 * 9
    }

    const open = Boolean(anchorEl);

    return (
        <Box {...props}>

            <CardPopover open={open} handlePopoverClose={handlePopoverClose} hoveredItemID={hoveredItemID}
                         anchorEl={anchorEl}/>

            <Stack direction={"row"} spacing={1} sx={{
                width: (CARD_WIDTH + 11.5) * 10,
                backgroundColor: index === course_main_line_index ? "rgba(33, 150, 243, 0.3)" : "none",
                border: index === course_main_line_index ? "1px solid rgb(33, 150, 243)" : "1px solid rgba(0, 0, 0, 0)",
                pt: 0.5, pb: 0.5
            }}>
                {course_items?.map((item, itemIndex) => {

                    if (isLinkItem(item)) {
                        return (
                            <Box>
                                <LinkElement size={size} courseLink={item.course_link}/>
                            </Box>
                        )
                    }

                    if (isEmptyCardItem(item)) {
                        return (
                            <Box>
                                <EmptyElement size={size}/>
                            </Box>
                        )
                    }

                    return (
                        <Box
                            onMouseEnter={(e) => {
                                cardItemHandleMouseEnter(e, item)
                            }}
                            onMouseLeave={handlePopoverClose}>
                            <CardItem card_id={item.id} size={size} rowIndex={index} itemIndex={itemIndex}
                                      positionData={positionData} activePage={activePage} courseID={courseID}
                                      viewedCardIDs={viewedCardIDs}/>
                        </Box>
                    )
                })}
            </Stack>
        </Box>
    )
}
