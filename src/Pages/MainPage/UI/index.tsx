import {observer} from "mobx-react";
import {Box, Stack, Typography} from "@mui/material";
import CardByID from "../../Cards/CardByID/UI/card-by-id";
import CardMicroView from "../../Cards/CardMicroView";

const MainPage = observer(() => {
    return (
        <Box>
            <Typography variant={'h3'} textAlign={"center"}>
                Добро пожаловать в <span
                style={{color: "#2196f3", textShadow: `rgb(75 135 184 / 22%) 1px 1px 10px`}}>StudyWays</span>
            </Typography>
            <CardMicroView cardID={2677}/>
            <Stack direction={"row"}>
                
            </Stack>
        </Box>
    )
})

export default MainPage