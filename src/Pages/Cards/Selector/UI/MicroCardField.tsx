import Grid from "@mui/material/Grid/Grid";
import { observer } from "mobx-react";
import React from "react";
import { CSSObject } from "../Store/CardSelectorStore";
import CardMicroView from "../../CardMicroView";
import { CreateCard } from "./CreateCard";
import { Box } from "@mui/material";

interface IMicroCardFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  showCreateNewCard?: boolean;
}

export const MicroCardField = observer(
  ({ showCreateNewCard, ...props }: IMicroCardFieldProps) => (
    <Box {...props} sx={{ overflow: "auto" }}>
      <Grid container spacing={2} justifyContent="center">
        {showCreateNewCard && (
          <Grid item xs={12} sm={6} md={"auto"}>
            <CreateCard />
          </Grid>
        )}
        {CSSObject.cards_id_array_for_selector?.map((card_id) => (
          <Grid
            key={`${card_id}CardMicroView`}
            item
            xs={12}
            sm={6}
            md={"auto"}
            onClick={() => {
              CSSObject.selectCard(card_id);
            }}
          >
            <CardMicroView cardID={Number(card_id)} onChange={() => void 0} />
          </Grid>
        ))}
      </Grid>
    </Box>
  ),
);
