import { Box, Button, Stack, SwipeableDrawer } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import React, { useEffect, useState } from "react";
import { UserStorage } from "../../../Shared/Store/UserStore/UserStore";
import { loadRecentCardsThunk } from "../../RecentCards/Store/async-actions";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../App/ReduxStore/RootStore";
import CardMicroView from "../../Cards/CardMicroView";
import { useNavigate } from "react-router-dom";
import HistoryIcon from "@mui/icons-material/History";
import { isMobileHook } from "../../../Shared/CustomHooks/isMobileHook";

type ICardHistoryDrawerProps = BoxProps;

export default function CardHistoryDrawer({
  ...props
}: ICardHistoryDrawerProps) {
  const dispatch = useAppDispatch();

  const recent_card_id_array = useAppSelector(
    (state) => state.recentCards.recent_card_id_array,
  );
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = isMobileHook();

  const navigate = useNavigate();

  function openHistoryDrawer() {
    setIsOpen(true);
  }

  function closeHistoryDrawer() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (UserStorage.isLogin) {
      dispatch(loadRecentCardsThunk());
    }
  }, [UserStorage.isLogin]);

  useEffect(() => {
    dispatch(loadRecentCardsThunk());
  }, []);

  return (
    <Box>
      <Button
        onClick={openHistoryDrawer}
        variant={"contained"}
        startIcon={<HistoryIcon />}
      >
        История
      </Button>
      <SwipeableDrawer
        open={isOpen}
        onOpen={openHistoryDrawer}
        onClose={closeHistoryDrawer}
        anchor={isMobile ? "bottom" : "right"}
        sx={{ width: { xs: 300, md: 340 } }}
      >
        <Stack
          direction={"column"}
          spacing={1}
          sx={{ mt: { md: 8 }, width: { xs: 300, md: 340 } }}
        >
          {recent_card_id_array?.map((card_id, index) => (
            <CardMicroView
              cardID={card_id}
              key={`${card_id}____${index}`}
              onClick={() => {
                navigate(`/card/${card_id}`);
                closeHistoryDrawer();
              }}
            />
          ))}
        </Stack>
      </SwipeableDrawer>
    </Box>
  );
}
