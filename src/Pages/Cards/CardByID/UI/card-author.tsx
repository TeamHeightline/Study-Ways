import { observer } from "mobx-react";
import { useAppSelector } from "../../../../App/ReduxStore/RootStore";
import { CardType } from "../../CardMicroView/store/type";
import { CardByIDStore } from "../Store/CardByIDStore";
import { toJS } from "mobx";
import { Box, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  card_store: CardByIDStore;
}

export const CardAuthor = observer((props: Props) => {
  const navigate = useNavigate();

  const { card_store } = props;
  const cardID = toJS(card_store.id);

  const card_hash_map = useAppSelector(
    (state) => state.cardMicroView.card_hash_map,
  );

  const card_data = card_hash_map[String(cardID)] || (null as CardType | null);

  const profile = card_data?.users_customuser?.users_userprofile;

  function handleAuthorClick() {
    navigate(`/author/${profile.user_id}`);
  }

  return (
    <Box>
      {profile && (
        <Typography
          variant="body1"
          onClick={handleAuthorClick}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <OpenInNewIcon fontSize={"small"} sx={{ mr: 1 }} />
          {profile?.firstname || ""} {profile?.lastname || ""}
        </Typography>
      )}
    </Box>
  );
});
