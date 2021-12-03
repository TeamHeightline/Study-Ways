import React, {useState} from 'react';
import {IconButton, Popover} from "@mui/material";
import './RowFragment.css'
import StopSharpIcon from '@mui/icons-material/StopSharp';
import CardMicroView from "../../Cards/CardView/#CardMicroView";

export default function RowFragment({rowFragment, ...props}: any) {
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
        <>
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
            {rowFragment?.CourseFragment?.map((element, eIndex) => {
                return (
                    <IconButton size="small"

                                onMouseEnter={(e) => {
                                    setHoveredItemID(element?.CourseElement?.id)
                                    if(props.CRI){
                                        setHoveredItemLevel(props.CRI)
                                    }else{
                                        setHoveredItemLevel(0)
                                    }
                                    handlePopoverOpen(e)
                                }}
                                onMouseLeave={handlePopoverClose}
                                edge="start"
                                key={eIndex + "CourseFragment" + props.rIndex + "RowFragment" + props.CRI + "NavigationRow"}
                                onClick={() => {
                                    props.buttonClick(eIndex)
                                }}
                                style={{color: !element?.CourseElement?.id ? "#0A1929" : ''}}
                                disabled={!element?.CourseElement?.id}
                                color={
                                    // !element?.CourseElement?.id? "inherit" :
                                    props.cardPositionData && props.cardPositionData.row === props.CRI && props.cardPositionData.fragment === props.rIndex
                                    && eIndex === props.cardPositionData.buttonIndex ?
                                        "secondary" :
                                        "primary"}
                    >
                        <StopSharpIcon/>
                    </IconButton>
                )
            })}
        </>
    )
}