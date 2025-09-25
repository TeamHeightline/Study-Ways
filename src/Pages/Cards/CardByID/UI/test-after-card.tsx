import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import {
  Alert,
  AlertTitle,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { QuestionByID } from "../../../Question/QuestionByID/UI/QuestionByID";
import { CardByIDStore } from "../Store/CardByIDStore";
import { useNavigate } from "react-router-dom";

interface ITestAfterCardProps extends PaperProps {
  card_store: CardByIDStore;
}

const TestAfterCard = observer(
  ({ card_store, ...props }: ITestAfterCardProps) => {
    const testAfterCardID = card_store.card_data?.test_in_card_id;
    const navigate = useNavigate();
    const onGoToTest = () => {
      navigate(`/iq/${testAfterCardID}`);
    };

    const isCardHaveTestAfterCard =
      testAfterCardID && card_store.card_data?.test_in_card_id;

    if (!isCardHaveTestAfterCard) {
      return null;
    }

    return (
      <Paper elevation={0} {...props}>
        <Alert severity={"error"} variant="outlined">
          <AlertTitle>
            <Typography variant={"h5"}>Тест после карточки</Typography>
          </AlertTitle>
          <Typography variant={"subtitle1"}>
            После просмотра содержания карточки, рекомендуем Вам пройти тест для
            закрепления материала
          </Typography>
          <Stack direction={"row"} spacing={"2"} sx={{ mt: 2 }}>
            <Button variant={"contained"} onClick={onGoToTest}>
              Пройти тест
            </Button>
          </Stack>
        </Alert>
      </Paper>
    );
  },
);

export default TestAfterCard;
