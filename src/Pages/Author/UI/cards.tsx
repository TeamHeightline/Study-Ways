import { observer } from "mobx-react";
import { Box, Stack, Typography } from "@mui/material";
import { toJS } from "mobx";
import { authorPageStore } from "../Store/store";
import CardMicroView from "../../Cards/CardMicroView";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Cards = observer(() => {
  const navigate = useNavigate();

  const authorCards = toJS(authorPageStore.pageData?.cards_card) || [];

  const onCardClick = (cardID) => () => {
    window.scrollTo(0, 0);
    navigate(`/card/${cardID}`);
  };

  const cardIDArray = authorCards.map((obj) => obj.id);

  if (cardIDArray.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant={"h4"}>Карточки автора</Typography>

      <Stack direction={"row"} spacing={2} sx={{ overflowX: "auto", mt: 1 }}>
        {cardIDArray.map((id) => (
          <Box key={id} sx={{ minWidth: { xs: 300, md: "initial" } }}>
            <CardMicroView cardID={id} onClick={onCardClick(id)} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
});
