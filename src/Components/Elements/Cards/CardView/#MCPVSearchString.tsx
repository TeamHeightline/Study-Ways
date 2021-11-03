import {Grid, TextField} from "@material-ui/core";
import {CardPageStorage} from "../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import React from "react";
import {observer} from "mobx-react";

export const MCPVSearchString = observer(() => {
    return(
        <div>
            <Grid container justify="center" style={{marginTop:6}}>
                <Grid item xs={12} md={8}>
                    <TextField
                        value={CardPageStorage.searchString}
                        onChange={async (e) => CardPageStorage.changeSearchString(e.target.value)}
                        fullWidth label="Умный поиск по названию и тексту карточки" variant="filled" />
                </Grid>
            </Grid>
        </div>
    )
})