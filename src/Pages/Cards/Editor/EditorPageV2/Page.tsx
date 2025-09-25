import Paper from "@mui/material/Paper/Paper";
import { observer } from "mobx-react";
import React from "react";
import { CardSelector } from "../../Selector/UI/CardSelector";
import { Route, Routes, useNavigate } from "react-router-dom";
import { EditCardByUrl } from "./EditCardByUrl";

type IEditorPageProps = React.HTMLAttributes<HTMLDivElement>;

export const EditorPage = observer(({ ...props }: IEditorPageProps) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{ pl: { md: 4 }, px: { xs: 1, md: 0 } }}
      {...props}
    >
      <Routes>
        <Route path={"/card/:id"} element={<EditCardByUrl {...props} />} />

        <Route
          path={"/*"}
          element={
            <CardSelector
              showCreateNewCard={true}
              mode={"onlyCreatedByMe"}
              onCardSelect={(card_id) => navigate(`card/${card_id}`)}
            />
          }
        />
      </Routes>
    </Paper>
  );
});
