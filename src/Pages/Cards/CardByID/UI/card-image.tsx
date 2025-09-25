import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Card, CardActionArea, Stack, Typography } from "@mui/material";
import { CardByIDStore } from "../Store/CardByIDStore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import WebIcon from "@mui/icons-material/Web";

interface ICardImageProps extends PaperProps {
  card_store: CardByIDStore;
}

const CardImage = observer(({ card_store, ...props }: ICardImageProps) => {
  const card_image = `url(${card_store.cardImageURLForUI})`;
  const isRemoteResourceContentType =
    card_store?.card_data?.card_content_type == 1;
  const remoteResourceURL = String(card_store.card_data?.site_url);

  const isClickableImage = isRemoteResourceContentType && remoteResourceURL;
  const goToRemoteResource = () => {
    window.open(remoteResourceURL, "_blank");
  };

  return (
    <Card
      elevation={0}
      {...props}
      sx={{
        backgroundSize: "cover",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: { md: "100%", xs: "95vw" },
        height: { xs: 200, md: 540 },
        // backgroundSize: "cover",
        backgroundImage: card_image,
        position: "relative",
      }}
    >
      {isClickableImage && (
        <CardActionArea
          sx={{
            width: "100%",
            height: "100%",
            backdropFilter: "brightness(40%)",
          }}
          onClick={goToRemoteResource}
        />
      )}
      {isClickableImage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <FileOpenIcon sx={{ fontSize: 80 }} />
          </Stack>
        </div>
      )}
    </Card>
  );
});

export default CardImage;
