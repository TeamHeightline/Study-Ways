import { observer } from "mobx-react";
import React from "react";
import { Alert, Button, Stack } from "@mui/material";
import { CardByIDStore } from "../Store/CardByIDStore";
import { useNavigate } from "react-router-dom";

interface IProps {
  card_store: CardByIDStore;
}

const GoToTestDialog = observer(({ card_store }: IProps) => {
  const navigate = useNavigate();

  const onCloseButtonClick = () => {
    card_store.isOpenGoToTestDialogAfterVideo = false;
  };

  const onGoToTestButtonClick = () => {
    console.log("testing time");
    navigate(`/iq/${card_store.card_data?.test_in_card_id}`);
  };

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        width: "100%",
        height: { xs: 200, md: 540 },
        backgroundColor: "rgba(50, 50, 50, 0.96)",
      }}
    >
      <Alert variant={"filled"}>
        Вы просмотрели видеофрагмент, не хотите ли пройти тест по этому
        фрагменту?
      </Alert>
      <Stack direction={"row"} sx={{ mt: 1 }} spacing={2}>
        <Button
          variant={"outlined"}
          color={"error"}
          onClick={onCloseButtonClick}
        >
          Закрыть
        </Button>
        <Button
          variant={"contained"}
          color={"info"}
          onClick={onGoToTestButtonClick}
        >
          К тесту
        </Button>
      </Stack>
    </Stack>
  );
});

export default GoToTestDialog;
