import { observer } from "mobx-react";
import React from "react";
import { CircularProgress, Collapse, Grid, Stack } from "@mui/material";
import { UiCloseButton } from "./ui-close-button";
import { ID } from "./ui-id";
import { UiCMenu } from "./ui-c-menu";
import { UiTitle } from "./ui-title";
import { HardLevel } from "./ui-hard-level";
import { UiConnectedThemeSelector } from "./ui-connected-theme-selector";
import { UiCopyRight } from "./ui-copy-right";
import { CESObject } from "../Store/CardEditorStorage";
import { UiVideo } from "./ui-video";
import { UiUploadImage } from "./ui-upload-image";
import { UiRichTextEditor } from "./ui-rich-text-editor";
import { UiArrowNavigation } from "./ui-arrow-navigation";
import { UiTestInCard } from "./ui-test-in-card";
import { UiTestBeforeCard } from "./ui-test-before-card";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";
import UICreateButton from "./ui-create-copy-button";
import UICreateCopyDialog from "./ui-create-copy-dialog";
import { SaveNotification } from "./save-notification";

type IEditCardUIProps = React.HTMLAttributes<HTMLDivElement>;

const EditCardUI = observer(({ ...props }: IEditCardUIProps) => {
  const isMobile = isMobileHook();
  if (!CESObject.cardDataLoaded) {
    return (
      <Stack alignItems={"center"}>
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <div {...props}>
      <Grid
        container
        item
        sx={{
          pl: isMobile ? 0 : 8,
          pr: isMobile ? 0 : 8,
          pt: isMobile ? 0 : 1,
        }}
        rowSpacing={2}
        spacing={4}
      >
        <UICreateCopyDialog />

        <Grid item xs={12}>
          <UiCloseButton />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <ID />
            <SaveNotification />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction={"row"} spacing={2}>
            <UiCMenu />
            <UICreateButton />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <UiTitle />
        </Grid>
        <Grid xs={12} md={6} item container spacing={4}>
          <Grid item xs={12} md={6}>
            <HardLevel />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <UiConnectedThemeSelector />
        </Grid>
        <Grid item xs={12} md={6} container spacing={4}>
          {/* <Grid item xs={12} md={6}>*/}
          {/*    <UiAuthorSelector/>*/}
          {/* </Grid>*/}
          <Grid item xs={12} md={6}>
            <UiCopyRight />
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Collapse in={CESObject.getField("card_content_type", 0) === 0}>
            <UiVideo />
          </Collapse>
          <Collapse in={!(CESObject.getField("card_content_type", 0) === 0)}>
            <UiUploadImage />
          </Collapse>
        </Grid>
        <Grid item xs={12} md={6}>
          <UiRichTextEditor />
        </Grid>

        <Grid item xs={12} md={6}>
          <UiArrowNavigation />
        </Grid>
        <Grid item container xs={12} md={6} spacing={4}>
          <Grid item xs={12} md={6}>
            <Collapse in={CESObject.getField("test_in_card_id", false)}>
              <UiTestInCard />
            </Collapse>
          </Grid>
          <Grid item xs={12} md={6}>
            <Collapse in={CESObject.getField("test_before_card_id", false)}>
              <UiTestBeforeCard />
            </Collapse>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});

export default EditCardUI;
