import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Collapse, Grid, Paper, Stack } from "@mui/material";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";
import { isMobileHook } from "../../../../../../Shared/CustomHooks/isMobileHook";
import AnswerText from "./answer-text";
import AnswerHelpTextV1 from "./answer-help-text-v1";
import AnswerVideoURL from "./answer-video-url";
import AnswerCheckQueue from "./answer-check-queue";
import AnswerImage from "./answer-image";
import AnswerHelpTextV2 from "./answer-help-text-v2";
import AnswerHelpTextV3 from "./answer-help-text-v3";
import AnswerHardLevel from "./answer-hard-level";
import AnswerIsTrue from "./answer-is-true";
import AnswerIsRequired from "./answer-is-required";
import AnswerOnlyInExam from "./answer-only-in-exam";
import AnswerStateOfSave from "./answer-state-of-save";

interface IAnswerContentProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}

const AnswerContent = observer(
  ({ answer_object, ...props }: IAnswerContentProps) => {
    const isMobile = isMobileHook();

    return (
      <Paper elevation={0} {...props}>
        <Collapse in={answer_object.isOpenForEdit} unmountOnExit>
          <Grid
            sx={{ pt: 2 }}
            container
            spacing={isMobile ? 0 : 8}
            justifyContent="space-around"
          >
            <Grid item md={6} xs={12}>
              <Stack direction={"column"} spacing={1}>
                <AnswerText answer_object={answer_object} />
                <AnswerHelpTextV1 answer_object={answer_object} />
                <AnswerVideoURL answer_object={answer_object} />
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <AnswerCheckQueue answer_object={answer_object} />
                  <AnswerImage answer_object={answer_object} />
                </Stack>
              </Stack>
            </Grid>
            <Grid item md={6} xs={12}>
              <Stack direction={"column"} spacing={1}>
                <AnswerHelpTextV2 answer_object={answer_object} />
                <AnswerHelpTextV3 answer_object={answer_object} />
                <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                  <AnswerHardLevel answer_object={answer_object} />
                  <AnswerIsTrue answer_object={answer_object} />
                </Stack>
                <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                  <AnswerIsRequired answer_object={answer_object} />
                  <Stack direction={"column"} spacing={1}>
                    <AnswerOnlyInExam answer_object={answer_object} />
                    <AnswerStateOfSave answer_object={answer_object} />
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>
    );
  },
);

export default AnswerContent;
