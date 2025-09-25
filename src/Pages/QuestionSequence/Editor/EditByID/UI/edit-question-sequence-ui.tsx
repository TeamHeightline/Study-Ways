import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import {
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";
import editQSStore from "../store/edit-question-sequence-sore";
import UIQSName from "./ui-qs-name";
import UIQSDescription from "./ui-qs-description";
import UILinks from "./ui-links";
import UiSelectedQuestions from "./ui-selected-questions";
import UIAllQuestions from "./ui-all-questions";
import UIAuthorSelector from "./ui-author-selector";
import UIThemeSearch from "./ui-theme-search";
import UICheckQuestion from "./ui-check-question";
import UIDownloadExcelButton from "./ui-download-excel-button";

interface IEditQuestionSequenceUIProps extends PaperProps {
  qsID: string;
  onChange: any;
}

const EditQuestionSequenceUI = observer(
  ({ qsID, ...props }: IEditQuestionSequenceUIProps) => {
    const isMobile = isMobileHook();

    useEffect(() => {
      editQSStore.loadAllQuestions();
      editQSStore.loadQuestionAuthors();
    }, []);

    useEffect(() => {
      editQSStore.changeQuestionSequenceID(qsID);
    }, [qsID]);

    if (!editQSStore.qsDataLoaded) {
      return (
        <Stack alignItems={"center"}>
          <CircularProgress />
        </Stack>
      );
    }

    return (
      <Paper elevation={0} sx={{ pl: 4 }}>
        <Stack alignItems={"center"} sx={{ pt: 2 }}>
          <Typography variant="h4">Редактор серии вопросов</Typography>
        </Stack>
        <Stack sx={{ pl: 2, pt: 4, pr: 2 }}>
          <Button
            disabled={!editQSStore.saveStatus}
            sx={{
              p: 1,
              minWidth: isMobile ? undefined : 300,
              maxWidth: isMobile ? undefined : 400,
            }}
            variant="outlined"
            color="primary"
            onClick={() => {
              props.onChange("goBack");
            }}
          >
            Назад
          </Button>

          <UICheckQuestion />

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={4}
            sx={{ pt: 2, width: "100%" }}
          >
            <Stack
              direction={"column"}
              spacing={2}
              sx={{ minWidth: isMobile ? undefined : 400 }}
            >
              <UIQSName />
              <UIQSDescription />
            </Stack>
            <UILinks />
            <UIDownloadExcelButton />
          </Stack>

          <UiSelectedQuestions />

          <Divider sx={{ pt: 2, pb: 2 }}>Все вопросы</Divider>

          <Stack direction={"row"} spacing={2}>
            <UIAuthorSelector />
            <UIThemeSearch />
          </Stack>

          <UIAllQuestions />
        </Stack>
      </Paper>
    );
  },
);

export default EditQuestionSequenceUI;
