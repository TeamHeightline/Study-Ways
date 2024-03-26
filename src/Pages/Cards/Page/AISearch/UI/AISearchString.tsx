import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {Autocomplete, Grid, IconButton, Stack, TextField} from "@mui/material";
import {AISObject} from "../Store/AISearch";
import SearchIcon from '@mui/icons-material/Search';
import AIHardLevelFilter from "./AIHardLevelFilter";
import AIThemeFilter from "./AIThemeFilter";
import {ContentType} from "./AIContentTypeFilter";
import AIAuthorSelector from "./AIAutohorSelector";


export const AISearchString = observer(() => {

    useEffect(() => {
        AISObject.loadCardConnectedThemes()
        AISObject.getAISearchResult()
        AISObject.loadAutocompleteDefaultData()
    }, [])

    function changeHandler(event, value) {
        AISObject.changeAISearchString(value)
    }


    return (
        <Grid container justifyContent={"center"}>
            <Grid item xs={12} md={6} sx={{pb: 2, p: {xs: 1, md: 0}}}>
                <Stack direction={"row"} spacing={2} sx={{width: "100%"}} alignItems={"center"}>
                    <Autocomplete
                        id="card-search"
                        freeSolo
                        options={AISObject.cardDataForAutocomplete}
                        filterOptions={(x) => x}
                        // autoComplete
                        onChange={AISObject.onSelectCardInAutocomplete}
                        // value={AISObject.AISearchString || ""}
                        inputValue={AISObject.AISearchString || ""}
                        onInputChange={changeHandler}
                        fullWidth
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                fullWidth
                                label="Поиск на основе личных предпочтений"
                                variant="outlined"/>}
                    />
                    <div>
                        <IconButton
                            size={'large'}
                            aria-label="search cards"
                            onClick={() => AISObject.getAISearchResult()}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </div>
                </Stack>
                <Stack direction={{xs: "column", lg: "row"}} sx={{mt: 2, width: "100%"}} spacing={{xs: 2}}>
                    <AIThemeFilter/>
                    <AIAuthorSelector/>
                    <AIHardLevelFilter/>
                    <ContentType/>
                </Stack>
            </Grid>
        </Grid>
    )
})
