import {observer} from "mobx-react";
import React from 'react';
import {Button, ButtonGroup} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";

interface IArrowNavigationProps extends React.HTMLAttributes<HTMLDivElement>{
    courseStore: CourseMicroStoreByID
}

const ArrowNavigation = observer(({courseStore, ...props}: IArrowNavigationProps) =>{
    return(
        <div {...props}>
            <ButtonGroup id={"course-btn-group"} size="large" color="primary" aria-label="group" className="mt-2">
                <Button
                    onClick={ () => courseStore.arrowClick("Back")}
                    disabled={!courseStore.getCardIDByArrow("Back")}
                >
                    <KeyboardArrowLeftOutlinedIcon/>
                </Button>
                <Button
                    onClick={ () => courseStore.arrowClick("Down")}
                    disabled={!courseStore.getCardIDByArrow("Down")}
                >
                    <KeyboardArrowDownOutlinedIcon/>
                </Button>
                <Button
                    onClick={ () => courseStore.arrowClick("Up")}
                    disabled={!courseStore.getCardIDByArrow("Up")}
                >
                    <KeyboardArrowUpOutlinedIcon/>
                </Button>
                <Button
                    onClick={ () => courseStore.arrowClick("Next")}
                    disabled={!courseStore.getCardIDByArrow("Next")}
                >
                    <KeyboardArrowRightOutlinedIcon/>
                </Button>
            </ButtonGroup>
        </div>
    )
})

export default ArrowNavigation