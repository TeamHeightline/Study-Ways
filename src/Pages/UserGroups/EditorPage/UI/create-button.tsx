import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { openCreateDialog } from "../store";
import { useAppDispatch } from "../../../../App/ReduxStore/RootStore";

export default function CreateButton() {
  const dispatch = useAppDispatch();

  function handleOpenCreateDialog() {
    dispatch(openCreateDialog());
  }

  return (
    <Button
      onClick={handleOpenCreateDialog}
      variant={"contained"}
      startIcon={<AddIcon />}
    >
      Создать группу студентов
    </Button>
  );
}
