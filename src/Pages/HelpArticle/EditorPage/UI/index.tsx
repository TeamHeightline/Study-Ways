import { useAppDispatch } from "../../../../App/ReduxStore/RootStore";
import { Button, Typography } from "@mui/material";
import { openCreateDialog } from "../redux-store";
import CreateHelpArticleDialog from "./CreateOrUpdateDialog";
import AddIcon from "@mui/icons-material/Add";
import HelpArticleList from "./ArticleList";
import { getArticles } from "../../HelpArticleByURL/redux-store/async-actions";
import { useEffect } from "react";

export default function HelpArticleEditPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getArticles());
  }, []);

  function handleOpenCreateDialog() {
    dispatch(openCreateDialog());
  }

  return (
    <div>
      <Typography variant={"h3"} textAlign={"center"}>
        Редактор справок
      </Typography>
      <Button
        onClick={handleOpenCreateDialog}
        variant={"contained"}
        startIcon={<AddIcon />}
      >
        Создать справку
      </Button>
      <HelpArticleList />
      <CreateHelpArticleDialog />
    </div>
  );
}
