import { observer } from "mobx-react";
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type ICloseButtonProps = React.HTMLAttributes<HTMLDivElement>;

export const CloseButton = observer(({ ...props }: ICloseButtonProps) => {
  const navigate = useNavigate();
  return (
    <div {...props}>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={() => {
          navigate(-1);
        }}
      >
        Вернуться к выбору серии вопросов
      </Button>
    </div>
  );
});
