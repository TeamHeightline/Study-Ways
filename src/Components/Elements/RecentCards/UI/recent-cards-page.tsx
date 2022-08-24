import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../root-redux-store/RootStore";
import CardMicroView from "../../Cards/CardView/CardMicroView";
import {useEffect} from "react";
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import {loadRecentCardsThunk} from "../Store/async-actions";
import UIIsHideDuplicates from "./ui-is-hide-duplicates";
import {useNavigate} from "react-router-dom";

interface IRecentCardsPageProps extends BoxProps {

}

export default function RecentCardsPage({...props}: IRecentCardsPageProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const is_loading_recent_card_id_array = useAppSelector(state => state.recentCards.is_loading_recent_card_id_array)
    const recent_card_id_array = useAppSelector(state => state.recentCards.recent_card_id_array)
    const unique_recent_card_id_array = useAppSelector(state => state.recentCards.unique_recent_card_id_array)
    const is_hide_duplicates = useAppSelector(state => state.recentCards.is_hide_duplicates)


    useEffect(() => {
        if (UserStorage.isLogin) {
            dispatch(loadRecentCardsThunk())
        }
    }, [UserStorage.isLogin])

    useEffect(() => {
        dispatch(loadRecentCardsThunk())
    }, [])

    if (is_loading_recent_card_id_array) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }

    const cards_id_array = is_hide_duplicates ? unique_recent_card_id_array : recent_card_id_array
    return (
        <Box {...props}>
            <Stack alignItems={"center"}>
                <Typography variant={"h3"} sx={{mt: 3}}>
                    Недавно просмотренные карточки
                </Typography>
            </Stack>
            <UIIsHideDuplicates/>
            <Grid container spacing={2} justifyContent={"space-around"}>
                {cards_id_array?.map((card_id, index) => {
                    return (
                        <Grid item key={index + "_" + card_id}>
                            <CardMicroView cardID={card_id} onClick={() => {
                                navigate("/card/" + card_id)
                            }}/>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
