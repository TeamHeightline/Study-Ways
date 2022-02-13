import React, {useState} from 'react';
import {IconButton, Popover} from "@mui/material";
import StopSharpIcon from '@mui/icons-material/StopSharp';
import CardMicroView from "../../../../Cards/CardView/#CardMicroView";
import {observer} from "mobx-react";
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {useHistory, useRouteMatch} from "react-router-dom";
import {backgroundColor} from "../../../../../../global-theme";

interface RowFragmentI{
    CRI: number,
    courseStore: CourseMicroStoreByID
}

const RowFragment = observer(({CRI, courseStore}: RowFragmentI) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredItemID, setHoveredItemID] = useState<number | undefined>(undefined)
    const [hoverItemLevel, setHoveredItemLevel] = useState<number>(0)
    const { path } = useRouteMatch();
    const history = useHistory()
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <div style={{width: 310}}>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                style={{marginTop: 34 * (4-hoverItemLevel) + 26,}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}

                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {hoveredItemID &&
                <CardMicroView cardID={hoveredItemID}/>}
            </Popover>
            {courseStore.courseData[CRI]
                .SameLine[courseStore.position.activePage - 1]
                ?.CourseFragment?.map((element, eIndex) => {
                return (
                    <IconButton size="small"
                                onMouseEnter={(e) => {
                                    setHoveredItemID(Number(element?.CourseElement?.id))
                                    if(CRI){
                                        setHoveredItemLevel(CRI)
                                    }else{
                                        setHoveredItemLevel(0)
                                    }
                                    handlePopoverOpen(e)
                                }}
                                onMouseLeave={handlePopoverClose}
                                edge="start"
                                key={eIndex + "CourseFragment" + "RowFragment" + CRI + "NavigationRow"}
                                onClick={() => {
                                    courseStore.positionData = {
                                        activePage: courseStore.positionData.activePage,
                                        selectedPage: courseStore.positionData.activePage,
                                        selectedRow: CRI,
                                        selectedIndex: eIndex
                                    }
                                    courseStore.isPositionChanged = true
                                    if(!courseStore.isIgnoreRouteAfterSelect){
                                        if(path == "/course"){
                                            history.replace("./course?" + "id=" + courseStore.id +
                                                "&activePage="+ courseStore.positionData.activePage +
                                                "&selectedPage=" + courseStore.positionData.activePage +
                                                "&selectedRow=" + CRI +
                                                "&selectedIndex=" + eIndex)
                                        } else {
                                            history.push("./course?" + "id=" + courseStore.id +
                                                "&activePage="+ courseStore.positionData.activePage +
                                                "&selectedPage=" + courseStore.positionData.activePage +
                                                "&selectedRow=" + CRI +
                                                "&selectedIndex=" + eIndex)
                                        }
                                    }
                                }}
                                style={{color: !element?.CourseElement?.id ? backgroundColor : ''}}
                                disabled={!element?.CourseElement?.id}
                                color={
                                    courseStore.position &&
                                    courseStore.position.selectedRow === CRI &&
                                    courseStore.position.selectedPage === courseStore.position.activePage &&
                                    courseStore.position.selectedIndex === eIndex  ?
                                        "secondary" :
                                        "primary"}
                    >
                        <StopSharpIcon/>
                    </IconButton>
                )
            })}
        </div>
    )
})

export default RowFragment