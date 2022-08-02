import {observer} from "mobx-react";
import React from 'react';
import {CircularProgress, Collapse, Grid, Stack} from "@mui/material";
import {UiCloseButton} from "./ui-close-button";
import {ID} from "./ui-id";
import {UiCMenu} from "./ui-c-menu";
import {UiTitle} from "./ui-title";
import {HardLevel} from "./ui-hard-level";
import {UiConnectedThemeSelector} from "./ui-connected-theme-selector";
import {UiCopyRight} from "./ui-copy-right";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {UiYoutubeVideo} from "./ui-youtube-video";
import {UiUploadImage} from "./ui-upload-image";
import {UiRichTextEditor} from "./ui-rich-text-editor";
import {UiTagField} from "./ui-tag-field";
import {UiArrowNavigation} from "./ui-arrow-navigation";
import {UiTestInCard} from "./ui-test-in-card";
import {UiTestBeforeCard} from "./ui-test-before-card";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

interface IEditCardUIProps extends React.HTMLAttributes<HTMLDivElement> {

}

const EditCardUI = observer(({...props}: IEditCardUIProps) => {
    const isMobile = isMobileHook()
    if (!CESObject.cardDataLoaded) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <div {...props}>
            <Grid container item sx={{pl: isMobile ? 0 : 8, pr: isMobile ? 0 : 8, pt: isMobile ? 0 : 1}}
                  rowSpacing={2} spacing={4}>

                <Grid item xs={12}>
                    <UiCloseButton/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <ID/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <UiCMenu/>
                </Grid>

                <Grid item xs={12} md={6}>
                    <UiTitle/>
                </Grid>
                <Grid xs={12} md={6} item container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <HardLevel/>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <UiConnectedThemeSelector/>
                </Grid>
                <Grid item xs={12} md={6} container
                      spacing={4}>
                    {/*<Grid item xs={12} md={6}>*/}
                    {/*    <UiAuthorSelector/>*/}
                    {/*</Grid>*/}
                    <Grid item xs={12} md={6}>
                        <UiCopyRight/>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Collapse in={CESObject.getField("cardContentType", "A_0") === "A_0"}>
                        <UiYoutubeVideo/>
                    </Collapse>
                    <Collapse in={!(CESObject.getField("cardContentType", "A_0") === "A_0")}>
                        <UiUploadImage/>
                    </Collapse>
                </Grid>
                <Grid item xs={12} md={6}>
                    <UiRichTextEditor/>
                </Grid>
                <Grid item xs={12}>
                    <UiTagField/>
                </Grid>

                <Grid item xs={12} md={6}>
                    <UiArrowNavigation/>
                </Grid>
                <Grid item container xs={12} md={6} spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Collapse in={CESObject.getField("isCardUseTestInCard", false)}>
                            <UiTestInCard/>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Collapse in={CESObject.getField("isCardUseTestBeforeCard", false)}>
                            <UiTestBeforeCard/>
                        </Collapse>
                    </Grid>

                </Grid>


            </Grid>
        </div>
    )
})

export default EditCardUI
