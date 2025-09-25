import { Grid, Paper } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import UITitle from "./ui-title";
import UIAllUsers from "./ui-all-users";
import UIUserSearch from "./ui-user-search";
import { loadAllUsersAsync } from "../redux-store/AsyncActions";
import UIStatusEditDialog from "./ui-status-edit-dialog";
import UILoadUsersFail from "./ui_load_users_error";

type IStatusEditorPageProps = PaperProps;

export default function StatusEditorPage({ ...props }: IStatusEditorPageProps) {
  const dispatch: any = useDispatch();
  useEffect(() => {
    dispatch(loadAllUsersAsync());
  }, []);
  return (
    <Paper elevation={0} {...props}>
      <Paper elevation={0} sx={{ pl: 4 }}>
        <UITitle />
        <UIStatusEditDialog />
        <Grid container justifyContent={"center"}>
          <Grid item xs={12} md={10}>
            <UIUserSearch />
            <UIAllUsers sx={{ mt: 2 }} />
            <UILoadUsersFail />
          </Grid>
        </Grid>
      </Paper>
    </Paper>
  );
}
