import {Box, CircularProgress, Stack, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import VisibilityIcon from '@mui/icons-material/Visibility';
import axiosClient from "../../../../ServerLayer/QueryLayer/config";
import {useEffect, useState} from "react";

interface ICardViewsProps extends BoxProps {
    card_id?: number
}


export default function CardViews({card_id, ...props}: ICardViewsProps) {
    const [views, setViews] = useState<null | number>(null);
    useEffect(() => {
        if (card_id) {
            axiosClient.get('/page/card-page/card-views/' + card_id)
                .then((response) => {
                    if (response.data) {
                        setViews(response.data)
                    }
                })
                .catch(() => {
                })
        }
    }, [card_id])


    if (views === null) {
        return <Box/>
    }

    return (
        <Box {...props}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <VisibilityIcon/>
                <Typography>
                    {views}
                </Typography>
            </Stack>
        </Box>
    )
}
