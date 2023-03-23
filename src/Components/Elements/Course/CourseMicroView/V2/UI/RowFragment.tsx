import React, {useState} from 'react';
import {Box, IconButton, Popover, Stack} from "@mui/material";
import CardMicroView from "../../../../Cards/CardView/CardMicroView";
import {observer} from "mobx-react";
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {useNavigate} from "react-router-dom";

import NoiseControlOffIcon from '@mui/icons-material/NoiseControlOff';
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";

import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import Looks6Icon from '@mui/icons-material/Looks6';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import ThemeStoreObject from "../../../../../../global-theme";
import {alpha} from "@mui/material/styles";

interface RowFragmentI {
    CRI: number,
    courseStore: CourseMicroStoreByID
}

const RowFragment = observer(({CRI, courseStore}: RowFragmentI) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredItemID, setHoveredItemID] = useState<string | undefined>(undefined)
    const [hoverItemLevel, setHoveredItemLevel] = useState<number>(0)
    const navigate = useNavigate();
    const isMobile = isMobileHook()

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <div style={{width: 610}}>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                style={{marginTop: 34 * (4 - hoverItemLevel) + 26,}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}

                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <div>

                    {hoveredItemID && String(hoveredItemID)?.split(",")?.map((cardID) =>
                        <CardMicroView cardID={Number(cardID)}/>)}
                </div>

            </Popover>
            <Box
                sx={{bgcolor: Number(CRI) === courseStore?.mainLineIndex ? alpha(ThemeStoreObject.primaryColor, 0.3) : "inherit"}}>
                <Stack direction={"row"}>
                    {courseStore.courseData[CRI]
                        .SameLine[courseStore.position.activePage - 1]
                        ?.CourseFragment?.map((element, eIndex) => {
                            const number_of_elements = String(element?.CourseElement?.id)?.split(",").length || 1
                            //@ts-ignore
                            const is_course_link_cell = element?.CourseElement?.type === "course-link"

                            // @ts-ignore
                            const course_link = element?.CourseElement.course_link
                            const is_can_click_to_link = is_course_link_cell && !!course_link

                            return (
                                <IconButton size="small"
                                            onMouseEnter={(e) => {
                                                if (!isMobile && !is_course_link_cell) {
                                                    setHoveredItemID(String(element?.CourseElement?.id))
                                                    if (CRI) {
                                                        setHoveredItemLevel(CRI)
                                                    } else {
                                                        setHoveredItemLevel(0)
                                                    }
                                                    handlePopoverOpen(e)
                                                }
                                            }}
                                            onMouseLeave={handlePopoverClose}
                                            edge="start"
                                            key={eIndex + "CourseFragment" + "RowFragment" + CRI + "NavigationRow"}
                                            onClick={() => {
                                                if (is_can_click_to_link) {
                                                    navigate(course_link.replace(/^.*\/\/[^\/]+/, ''))
                                                } else {
                                                    courseStore.positionData = {
                                                        activePage: courseStore.positionData.activePage,
                                                        selectedPage: courseStore.positionData.activePage,
                                                        selectedRow: CRI,
                                                        selectedIndex: eIndex
                                                    }
                                                    courseStore.isPositionChanged = true
                                                    if (!courseStore.isIgnoreRouteAfterSelect) {
                                                        navigate("/course?" + "id=" + courseStore.id +
                                                            "&activePage=" + courseStore.positionData.activePage +
                                                            "&selectedPage=" + courseStore.positionData.activePage +
                                                            "&selectedRow=" + CRI +
                                                            "&selectedIndex=" + eIndex)
                                                    }
                                                }
                                            }}
                                            sx={{
                                                opacity: !!element?.CourseElement?.id || is_can_click_to_link ? "100%" : "0%",
                                            }}
                                            disabled={!element?.CourseElement?.id && !is_can_click_to_link}
                                            color={
                                                courseStore.position &&
                                                courseStore.position.selectedRow === CRI &&
                                                courseStore.position.selectedPage === courseStore.position.activePage &&
                                                courseStore.position.selectedIndex === eIndex ?
                                                    "secondary" :
                                                    element?.CourseElement?.id && courseStore.viewedCardIDs.has(element?.CourseElement?.id) ?
                                                        "inherit" :
                                                        "primary"}
                                >

                                    {/*<NoiseControlOffIcon/>*/}
                                    {
                                        is_course_link_cell ?
                                            <ForkRightIcon/> :
                                            number_of_elements === 1 ?
                                                <NoiseControlOffIcon/> :
                                                number_of_elements === 2 ?
                                                    <LooksTwoIcon/> :
                                                    number_of_elements === 3 ?
                                                        <Looks3Icon/> :
                                                        number_of_elements === 4 ?
                                                            <Looks4Icon/> :
                                                            number_of_elements === 5 ?
                                                                <Looks5Icon/> :
                                                                <Looks6Icon/>}


                                    {/*}*/}
                                    {/*<Looks6Icon/>*/}
                                </IconButton>
                            )
                        })}
                </Stack>
            </Box>
        </div>
    )
})

export default RowFragment
