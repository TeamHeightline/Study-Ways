import {observer} from "mobx-react";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import React, {useEffect} from "react";
import {CircularProgress, Grid} from "@mui/material";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {Title} from "./#Title";
import {HardLevel} from "./#HardLeve";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {CMenu} from "./#CMenu";
import {ID} from "./#ID";
import {YouTubeVideo} from "./YouTubeVideo";

export const EditCardByID = observer(({id= 1826}) => {
    useEffect(() => CESObject.loadCardDataFromServer(id), [id, UserStorage.userAccessLevel])
    const isMobile = isMobileHook()

    if(!CESObject.cardDataLoaded){
        return (
            <Grid container justifyContent="center" style={{marginTop: 12}}>
                <Grid item>
                    <CircularProgress />
                </Grid>
            </Grid>
        )
    }
    return(
        <div>
            <Grid container style={{paddingLeft: isMobile ? 0 : 48}} rowSpacing={2} spacing={4}>

                <Grid item xs={12} md={6}>
                    <ID/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CMenu/>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Title/>
                </Grid>
                <Grid xs={12} md={6} item container >
                    <Grid item xs={12} md={6}>
                        <HardLevel/>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    {CESObject.getField("cardContentType", "A_0") === "A_0" &&
                        <YouTubeVideo/>}
                </Grid>


            </Grid>
        </div>
    )
})