import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, ButtonGroup, Paper} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CardByIDStore} from "../Store/CardByIDStore";
import {useNavigate} from "react-router-dom";


interface ICardAuthorNavigationProps extends PaperProps {
    card_store: CardByIDStore

}

const CardAuthorNavigation = observer(({card_store, ...props}: ICardAuthorNavigationProps) => {
    const cardBeforeID = card_store.card_data?.card_before_id
    const cardDownID = card_store.card_data?.card_down_id
    const cardUpID = card_store.card_data?.card_up_id
    const cardNextID = card_store.card_data?.card_next_id

    const isNavigationEnabled = card_store.card_data?.is_card_use_arrow_navigation

    const isShowNavigation = isNavigationEnabled &&
        (cardNextID || cardNextID || cardDownID || cardBeforeID)

    const navigate = useNavigate()

    const goToCard = (cardID) => {
        navigate("/card/" + cardID)
    }
    if (!isShowNavigation) {
        return <div/>
    }

    return (
        <Paper elevation={0} {...props}>
            <ButtonGroup size="large" color="secondary" variant="outlined" id={"author-navigation"}>
                <Button disabled={!cardBeforeID}
                        onClick={() => {
                            goToCard(cardBeforeID)
                        }}>
                    <KeyboardArrowLeftOutlinedIcon/>
                </Button>
                <Button disabled={!cardDownID}
                        onClick={() => {
                            goToCard(cardDownID)
                        }}>
                    <KeyboardArrowDownOutlinedIcon/>
                </Button>
                <Button disabled={!cardUpID}
                        onClick={() => {
                            goToCard(cardUpID)
                        }}>
                    <KeyboardArrowUpOutlinedIcon/>
                </Button>
                <Button disabled={!cardNextID}
                        onClick={() => {
                            goToCard(cardNextID)
                        }}>
                    <KeyboardArrowRightOutlinedIcon/>
                </Button>
            </ButtonGroup>
        </Paper>
    )
})

export default CardAuthorNavigation
