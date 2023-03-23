import {Box, Popover} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import CardMicroView from "../../../Cards/CardView/CardMicroView";
import React from "react";

interface ICardPopoverProps extends BoxProps {
    hoveredItemID: string | undefined,
    open: boolean,
    anchorEl: any,
    handlePopoverClose: () => void
}

export default function CardPopover({open, anchorEl, handlePopoverClose, hoveredItemID, ...props}: ICardPopoverProps) {
    return (
        <Box {...props}>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                style={{marginTop: 100}}
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
        </Box>
    )
}
