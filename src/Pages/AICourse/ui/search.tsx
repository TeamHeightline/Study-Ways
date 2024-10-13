import {observer} from "mobx-react";
import {useQuery} from '@tanstack/react-query'
import {getCardsBySearch} from "../model/api";
import {IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useState} from "react";
import {AICourseStore} from "../model/store";

export const Search = observer(() => {
    const searchString = AICourseStore.searchString

    const setSearchString = (e) => {
        AICourseStore.setSearchString(e.target.value)
    }
    return (
        <div>
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 400,
                    borderRadius: 30,
                    height: 45,
                    background: 'linear-gradient(to right, rgb(9, 48, 255), rgb(204, 5, 254))'
                }}
            >

                <InputBase
                    onChange={setSearchString}
                    value={searchString}
                    sx={{ml: 1, flex: 1}}
                    placeholder="О чем будет курс?"
                />
                <IconButton type="button" sx={{p: '10px'}} aria-label="search" onClick={() => {
                    AICourseStore.onSearch()
                }}>
                    <SearchIcon/>
                </IconButton>
            </Paper>
        </div>
    )

})