import {Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {useEffect} from "react";
import {loadCardBookmarks} from "../Store/async-actions";
import {useAppDispatch, useAppSelector} from "../../../ReduxStore/RootStore";
import CardMicroView from "../../Cards/CardView/CardMicroView";
import {useNavigate} from "react-router-dom";

interface ICardBookmarksPageProps extends BoxProps {

}

export default function CardBookmarksPage({...props}: ICardBookmarksPageProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const is_loading_card_bookmarks = useAppSelector(state => state.cardBookmarks.is_loading_card_bookmarks)
    const card_bookmarks_id_array = useAppSelector(state => state.cardBookmarks.card_bookmarks_id_array)


    useEffect(() => {
        if (UserStorage.isLogin) {
            dispatch(loadCardBookmarks())
        }
    }, [UserStorage.isLogin])

    useEffect(() => {
        dispatch(loadCardBookmarks())
    }, [])

    if (is_loading_card_bookmarks) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }

    return (
        <Box {...props}>
            <Stack alignItems={"center"}>
                <Typography variant={"h3"} sx={{mt: 3}}>
                    Карточки, добавленные в закладки
                </Typography>
            </Stack>
            <Grid container spacing={2} justifyContent={"space-around"}>
                {card_bookmarks_id_array?.map((card_id, index) => {
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
