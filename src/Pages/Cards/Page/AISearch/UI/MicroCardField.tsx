import { observer } from "mobx-react";
import React from "react";
import { Box, Grid } from "@mui/material";
import CardMicroView from "../../../CardMicroView";

interface IMicoCardsFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  cards_id: number[] | string[];
  onCardSelect: (card_id: number) => void;
}

export const MicoCardsField = observer(
  ({ cards_id, onCardSelect, ...props }: IMicoCardsFieldProps) => (
    <Box {...props} sx={{ overflow: "auto" }}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ p: { xs: 1, md: 0 } }}
      >
        {cards_id?.map((card_id) => (
          <Grid
            item
            key={`${card_id}CardKey`}
            xs={12}
            sm={6}
            md={"auto"}
            onClick={() => {
              onCardSelect(card_id);
            }}
          >
            <CardMicroView cardID={Number(card_id)} onChange={() => void 0} />
          </Grid>
        ))}
      </Grid>
    </Box>
  ),
);
