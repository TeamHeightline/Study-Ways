import React, {useState} from 'react';
import {IconButton, Popover, Stack} from "@mui/material";
import {observer} from "mobx-react";

import NoiseControlOffIcon from '@mui/icons-material/NoiseControlOff';
import {CourseElement, ICoursePosition} from "./types";
import CardMicroView from "../../../../Cards/CardView/CardMicroView";


interface RowFragmentI {
    courseRow: any,
    activePage: number,
    courseID: number,
    rowIndex: number,
    positionData?: ICoursePosition,
    onChangePosition?: (elementPosition: ICoursePosition) => void,
}

const RowFragment = observer(({
                                  courseRow,
                                  activePage,
                                  rowIndex,
                                  courseID,
                                  positionData,
                                  onChangePosition
                              }: RowFragmentI) => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredItemID, setHoveredItemID] = useState<number | undefined>(undefined)
    const [hoverItemLevel, setHoveredItemLevel] = useState<number>(0)

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);


    return (
        <div>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    ml: 4,
                    mt: 6
                }}
                // style={{marginTop: 34 * (4 - hoverItemLevel) + 26,}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}

                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {hoveredItemID && String(hoveredItemID)?.split(",")?.map((cardID) =>
                    <CardMicroView cardID={Number(cardID)}/>)}
            </Popover>

            <Stack direction={"row"}>
                {courseRow.SameLine[activePage - 1]?.CourseFragment?.map((element: CourseElement, eIndex: number) => {
                    if (!element?.CourseElement?.id) {
                        return (
                            <div style={{height: 34, width: 34}} key={"EmptyCard" + activePage + " " + eIndex}/>
                        )
                    }
                    return (
                        <IconButton size="small"
                                    key={"RealCard" + activePage + " " + eIndex}
                                    sx={{backgroundColor: "transparent"}}
                                    edge="start"
                                    onMouseEnter={(e) => {
                                        setHoveredItemID(Number(element?.CourseElement?.id))
                                        if (rowIndex) {
                                            setHoveredItemLevel(rowIndex)
                                        } else {
                                            setHoveredItemLevel(0)
                                        }
                                        handlePopoverOpen(e)
                                    }}
                                    onMouseLeave={handlePopoverClose}
                                    onClick={() => {
                                        if (onChangePosition) {
                                            onChangePosition({
                                                activePage: activePage,
                                                selectedPage: activePage,
                                                selectedRow: rowIndex,
                                                selectedIndex: eIndex,
                                            })
                                        }
                                    }}
                                    style={{opacity: !element?.CourseElement?.id ? "0%" : '100%'}}
                                    disabled={!element?.CourseElement?.id}
                                    color={
                                        positionData &&
                                        positionData.selectedRow == rowIndex &&
                                        positionData.selectedPage == activePage &&
                                        positionData.selectedIndex == eIndex ?
                                            "secondary" :
                                            "primary"}
                        >
                            <NoiseControlOffIcon/>
                        </IconButton>
                    )
                })}
            </Stack>
        </div>
    )
})

export default RowFragment
