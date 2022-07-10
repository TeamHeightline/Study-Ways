import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, ButtonGroup, Paper} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CardByIDStore} from "../Store/CardByIDStore";
import {useHistory} from "react-router-dom";


interface ICardAuthorNavigationProps extends PaperProps {
    card_store: CardByIDStore

}

const CardAuthorNavigation = observer(({card_store, ...props}: ICardAuthorNavigationProps) => {
    const cardBeforeID = card_store.card_data?.cardBefore?.id
    const cardDownID = card_store.card_data?.cardDown?.id
    const cardUpID = card_store.card_data?.cardUp?.id
    const cardNextID = card_store.card_data?.cardNext?.id

    const isNavigationEnabled = card_store.card_data?.isCardUseArrowNavigation

    const isShowNavigation = isNavigationEnabled &&
        (cardNextID || cardNextID || cardDownID || cardBeforeID)

    const history = useHistory()

    const goToCard = (cardID) => {
        history.push("/card/" + cardID)
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
