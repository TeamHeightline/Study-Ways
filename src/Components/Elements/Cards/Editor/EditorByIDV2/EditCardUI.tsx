import {observer} from "mobx-react";
import React from 'react';
import {Collapse, Grid} from "@mui/material";
import {CloseButton} from "./CloseButton";
import {ID} from "./ID";
import {CMenu} from "./CMenu";
import {Title} from "./Title";
import {HardLevel} from "./HardLeve";
import {ConnectedThemeSelector} from "./ConnectedThemeSelector";
import {AuthorSelector} from "./AuthorSelector";
import {CopyRight} from "./CopyRight";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {YouTubeVideo} from "./YouTubeVideo";
import {UploadImage} from "./UploadImage";
import {RichTextEditor} from "./RichTextEditor";
import {TagField} from "./TagField";
import {ArrowNavigation} from "./ArrowNavigation";
import {TestInCard} from "./TestInCard";
import {TestBeforeCard} from "./TestBeforeCard";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

interface IEditCardUIProps extends React.HTMLAttributes<HTMLDivElement> {

}

const EditCardUI = observer(({...props}: IEditCardUIProps) => {
    const isMobile = isMobileHook()
    return (
        <div {...props}>
            <Grid container item sx={{pl: isMobile ? 0 : 8, pr: isMobile ? 0 : 8, pt: isMobile ? 0 : 1}}
                  rowSpacing={2} spacing={4}>

                <Grid item xs={12}>
                    <CloseButton/>
                </Grid>
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
                    {/*<Grid item xs={12} md={6}>*/}
                    {/*    <AuthorSelector/>*/}
                    {/*</Grid>*/}
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

export default EditCardUI