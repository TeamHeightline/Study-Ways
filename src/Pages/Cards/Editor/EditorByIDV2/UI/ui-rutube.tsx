import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";
import { observer } from "mobx-react";
import React from "react";
import { Stack, Typography } from "@mui/material";
import { Alert } from "@mui/lab";

export const UiRutube = observer(() => {
  const isMobile = isMobileHook();

  return (
    <div
      style={{
        height: isMobile ? (window.innerWidth / 16) * 9 : 456,
        display: "flex",
      }}
    >
      <Stack alignItems={"center"} justifyContent={"center"} sx={{ flex: 1 }}>
        <Alert severity={"warning"}>В разработке</Alert>
      </Stack>
    </div>
  );
});
