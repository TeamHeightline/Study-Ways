import {observer} from "mobx-react";
import {CESObject} from "../Store/CardEditorStorage";
import React, {useEffect} from "react";
import {CircularProgress, Collapse, Grid} from "@mui/material";
import {UserStorage} from "../../../../../../Store/UserStore/UserStore";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import EditCardUI from "./EditCardUI";
import UiCardSelectorForArrowNavigation from "./ui-card-selector-for-arrow-navigation";

export const EditCardByID = observer(({id}) => {
    useEffect(() => {
        CESObject.loadCardDataFromServer(id)
        CESObject.loadCardAuthorsFromServer()
    }, [id, UserStorage.userAccessLevel])
    const isMobile = isMobileHook()

    if (!(CESObject.cardDataLoaded && CESObject.authorsDataLoaded)) {
        return (
            <Grid container justifyContent="center" style={{marginTop: 12}}>
                <Grid item>
                    <CircularProgress/>
                </Grid>
            </Grid>
        )
    }
    return (
        <div>
            <Collapse in={CESObject.arrowForCardIsSelecting == ""}>
                <EditCardUI/>
            </Collapse>
            <Collapse in={!(CESObject.arrowForCardIsSelecting == "")}>
                <UiCardSelectorForArrowNavigation/>
            </Collapse>
        </div>
    )
})
