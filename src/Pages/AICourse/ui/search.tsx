import {observer} from "mobx-react";
import {Fade, IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {AICourseStore} from "../model/store";

export const Search = observer(() => {
    const searchString = AICourseStore.searchString

    const setSearchString = (e) => {
        AICourseStore.setSearchString(e.target.value)
    }
    return (
        <Fade in timeout={1000}>
            <Paper
                component="form"
                onSubmit={(event) => {
                    event.preventDefault()
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
                <IconButton type="button" sx={{p: '10px'}} aria-label="search" onClick={() => {
                    AICourseStore.onSearch()
                }}>
                    <SearchIcon/>
                </IconButton>
            </Paper>
        </Fade>

    )

})