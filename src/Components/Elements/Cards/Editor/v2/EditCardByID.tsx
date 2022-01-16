import {observer} from "mobx-react";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import React, {useEffect} from "react";
import {CircularProgress, Collapse, Grid} from "@mui/material";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {Title} from "./#Title";
import {HardLevel} from "./#HardLeve";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {CMenu} from "./#CMenu";
import {ID} from "./#ID";
import {YouTubeVideo} from "./YouTubeVideo";
import {RichTextEditor} from "./#RichTextEditor";
import {AuthorSelector} from "./#AuthorSelector";
import {CopyRight} from "./#CopyRight";
import {ArrowNavigation} from "./#ArrowNavigation";
import {UploadImage} from "./#UploadImage";
import {TagField} from "./#TagField";
import {ConnectedThemeSelector} from "./#ConnectedThemeSelector";
import {TestInCard} from "./#TestInCard";
import {TestBeforeCard} from "./#TestBeforeCard";

export const EditCardByID = observer(({id= 1825}) => {
    useEffect(() => {
        CESObject.loadCardDataFromServer(id)
        CESObject.loadCardAuthorsFromServer()
    }, [id, UserStorage.userAccessLevel])
    const isMobile = isMobileHook()

    if(!(CESObject.cardDataLoaded && CESObject.authorsDataLoaded)){
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
            <Grid container item  sx={{pl: isMobile ? 0 : 8, pr: isMobile ? 0 : 8}} rowSpacing={2} spacing={4}>

                <Grid item xs={12} md={6}>
                    <ID/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <CMenu/>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Title/>
                </Grid>
                <Grid xs={12} md={6} item container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <HardLevel/>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ConnectedThemeSelector/>
                </Grid>
                <Grid item xs={12} md={6} container
                      spacing={4}>
                    <Grid item xs={12} md={6}>
                        <AuthorSelector/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CopyRight/>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Collapse in={CESObject.getField("cardContentType", "A_0") === "A_0"}>
                        <YouTubeVideo/>
                    </Collapse>
                    <Collapse in={!(CESObject.getField("cardContentType", "A_0") === "A_0")}>
                        <UploadImage/>
                    </Collapse>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RichTextEditor/>
                </Grid>
                <Grid item xs={12}>
                    <TagField/>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ArrowNavigation/>
                </Grid>
                <Grid item container xs={12} md={6} spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Collapse in={CESObject.getField("isCardUseTestInCard", false)}>
                            <TestInCard/>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Collapse in={CESObject.getField("isCardUseTestBeforeCard", false)}>
                            <TestBeforeCard/>
                        </Collapse>
                    </Grid>

                </Grid>


            </Grid>
        </div>
    )
})