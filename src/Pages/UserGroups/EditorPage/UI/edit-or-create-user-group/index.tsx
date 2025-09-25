import { Box } from "@mui/material";
import { useAppSelector } from "../../../../../App/ReduxStore/RootStore";

export default function EditOrCreateUserGroupDialog() {
  const data = useAppSelector(
    (state) => state.userGroupEditor.create_or_update_dialog.data,
  );
  return <Box></Box>;
}
