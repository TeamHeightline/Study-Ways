import {observer} from "mobx-react";
import {Box, Fade, IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {AICourseStore} from "../model/store";
import {useAppSelector} from "../../../ReduxStore/RootStore";

export const Search = observer(() => {
    const card_hash_map = useAppSelector(state => state.cardMicroView.card_hash_map)

    const isCardsNotLoaded = Object.keys(card_hash_map).length === 0

    const searchString = AICourseStore.searchString

    const setSearchString = (e) => {
        AICourseStore.setSearchString(e.target.value)
    }
    return (
        <Fade in timeout={1000}>
            <Box sx={{px: 1, width: '100%'}}>
                <Paper
                    component="form"
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (isCardsNotLoaded) {
                            return
                        }
                        AICourseStore.onSearch()
                    }}
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: 700,
                        width: '100%',
                        flexShrink: 0,
                        borderRadius: 30,
                        height: 45,
                        background: 'linear-gradient(to right, rgb(9, 48, 255), rgb(204, 5, 254))'
                    }}
                >

                    <InputBase
                        onChange={setSearchString}
                        value={searchString}
                        sx={{
                            ml: 1, flex: 1,
                            'input': {
                                '&::placeholder': {
                                    opacity: 0.7
                                }
                            }
                        }}
                        placeholder="О чем будет курс?"

                    />
                    <IconButton type="button" sx={{p: '10px'}} aria-label="search"
                                disabled={isCardsNotLoaded}
                                onClick={() => {
                                    AICourseStore.onSearch()
                                }}>
                        <SearchIcon/>
                    </IconButton>
                </Paper>
            </Box>
        </Fade>

    )

})