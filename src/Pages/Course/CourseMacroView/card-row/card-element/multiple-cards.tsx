import {Box, Stack} from "@mui/material";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import Looks6Icon from "@mui/icons-material/Looks6";
import React from "react";


interface IProps {
    numberOfElements: number
    size: {
        width: number,
        height: number
    },
}

export default function MultipleCards(props: IProps) {
    const {numberOfElements, size} = props
    return (
        <Stack justifyContent={"center"} alignItems={"center"} sx={size}>
            {numberOfElements > 1 &&
                <Box>
                    {numberOfElements === 2 ?
                        <LooksTwoIcon sx={{fontSize: 60}}/> :
                        numberOfElements === 3 ?
                            <Looks3Icon sx={{fontSize: 60}}/> :
                            numberOfElements === 4 ?
                                <Looks4Icon sx={{fontSize: 60}}/> :
                                numberOfElements === 5 ?
                                    <Looks5Icon sx={{fontSize: 60}}/> :
                                    <Looks6Icon sx={{fontSize: 60}}/>}
                </Box>}
        </Stack>
    )
}