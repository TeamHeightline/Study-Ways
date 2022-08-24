import {Box, Button, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React, {useEffect, useState} from "react";
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import {loadRecentCardsThunk} from "../../RecentCards/Store/async-actions";
import {useAppDispatch, useAppSelector} from "../../../../root-redux-store/RootStore";
import CardMicroView from "../../Cards/CardView/CardMicroView";
import Drawer from "@mui/material/Drawer";
import {useNavigate} from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";

interface ICardHistoryDrawerProps extends BoxProps {

}

export default function CardHistoryDrawer({...props}: ICardHistoryDrawerProps) {
    const dispatch = useAppDispatch()

    const recent_card_id_array = useAppSelector(state => state.recentCards.recent_card_id_array)
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate()

    function openHistoryDrawer() {
        setIsOpen(true)
    }

    function closeHistoryDrawer() {
        setIsOpen(false)
    }

    useEffect(() => {
        if (UserStorage.isLogin) {
            dispatch(loadRecentCardsThunk())
        }
    }, [UserStorage.isLogin])

    useEffect(() => {
        dispatch(loadRecentCardsThunk())
    }, [])

    return (
        <Box>
            <Button onClick={openHistoryDrawer} variant={"contained"}
                    sx={{transform: "rotate(90deg)"}} startIcon={<HistoryIcon/>}>
                История
            </Button>
            <Drawer open={isOpen} onClose={closeHistoryDrawer} anchor={"right"}>
                <Stack direction={"column"} spacing={1} sx={{mt: 8}}>
                    {recent_card_id_array?.map((card_id) =>
                        <CardMicroView cardID={card_id} key={card_id} onClick={() => {
                            navigate("/card/" + card_id)
                            closeHistoryDrawer()
                        }}/>
                    )}
                </Stack>
            </Drawer>
        </Box>
    )
}
