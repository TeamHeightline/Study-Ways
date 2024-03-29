import {observer} from "mobx-react";
import React from 'react';
import {Button, ButtonGroup} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CourseMicroStoreByID} from "../Store/CourseMicroStoreByID";
import {useLocation, useNavigate} from "react-router-dom";

interface IArrowNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
    courseStore: CourseMicroStoreByID
}

const ArrowNavigation = observer(({courseStore, ...props}: IArrowNavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToCardByArrow = (card_arrow: "Back" | "Down" | "Up" | "Next") => {
        const new_position = courseStore.getPositionByArrow(card_arrow)
        if (location.pathname === "/course") {
            navigate("/course?" + "id=" + courseStore.id +
                "&activePage=" + new_position.activePage +
                "&selectedPage=" + new_position.activePage +
                "&selectedRow=" + new_position.selectedRow +
                "&selectedIndex=" + new_position.selectedIndex, {replace: true})
        } else {
            navigate("/course?" + "id=" + courseStore.id +
                "&activePage=" + new_position.activePage +
                "&selectedPage=" + new_position.activePage +
                "&selectedRow=" + new_position.selectedRow +
                "&selectedIndex=" + new_position.selectedIndex)
        }
    }
    return (
        <div {...props}>
            <ButtonGroup id={"course-btn-group"} size="large" color="primary" aria-label="group" className="mt-2">
                <Button
                    onClick={() => goToCardByArrow("Back")}
                    disabled={!courseStore.getCardIDByArrow("Back")}
                >
                    <KeyboardArrowLeftOutlinedIcon/>
                </Button>
                <Button
                    onClick={() => goToCardByArrow("Down")}
                    disabled={!courseStore.getCardIDByArrow("Down")}
                >
                    <KeyboardArrowDownOutlinedIcon/>
                </Button>
                <Button
                    onClick={() => goToCardByArrow("Up")}
                    disabled={!courseStore.getCardIDByArrow("Up")}
                >
                    <KeyboardArrowUpOutlinedIcon/>
                </Button>
                <Button
                    onClick={() => goToCardByArrow("Next")}
                    disabled={!courseStore.getCardIDByArrow("Next")}
                >
                    <KeyboardArrowRightOutlinedIcon/>
                </Button>
            </ButtonGroup>
        </div>
    )
})

export default ArrowNavigation
