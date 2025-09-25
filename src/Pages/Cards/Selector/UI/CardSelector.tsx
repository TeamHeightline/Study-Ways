import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { MicroCardField } from "./MicroCardField";
import { CleverSearching } from "./CleverSearching";
import { CSSObject } from "../Store/CardSelectorStore";
import { Box, Stack } from "@mui/material";
import { HardLevel } from "./HardLevel";
import { ContentType } from "./ContentType";
import { ConnectedThemes } from "./ConnectedThemes";
import { Pages } from "./Pages";
import { loadAllCardsData } from "../../CardMicroView/store/async-actions";
import { useAppDispatch } from "../../../../App/ReduxStore/RootStore";

interface ICardSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: "onlyCreatedByMe" | "standard";
  onCardSelect: (card_id: number) => void;
  showCreateNewCard?: boolean;
}

export const CardSelector = observer(
  ({
    onCardSelect,
    mode = "standard",
    showCreateNewCard,
    ...props
  }: ICardSelectorProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(loadAllCardsData());
    }, []);

    useEffect(() => CSSObject.setMode(mode), [mode]);
    useEffect(() => {
      if (CSSObject.selectedCardID) {
        onCardSelect(Number(CSSObject.selectedCardID));
        CSSObject.selectedCardID = undefined;
      }
    }, [CSSObject.selectedCardID]);
    useEffect(() => {
      CSSObject.loadCardConnectedThemes();
    }, []);
    return (
      <div {...props}>
        <CleverSearching />
        <Stack
          sx={{ pt: 2, pr: 4, pl: 4, mb: 2 }}
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1, md: 4 }}
        >
          <ConnectedThemes />
          <HardLevel />
          <ContentType />
        </Stack>
        <Box sx={{ mt: 2 }}>
          <MicroCardField showCreateNewCard={showCreateNewCard} />
        </Box>
        <Pages />
      </div>
    );
  },
);
