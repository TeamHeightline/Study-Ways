import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";
import { useSelector } from "react-redux";
import { IBasicUserInformation } from "../../../Shared/ServerLayer/Types/user.types";
import UIUserProfileHead from "./ui-user-tablse-head";
import UIUserStatusCell from "./ui-user-status-cell";
import { RootState, useAppDispatch } from "../../../App/ReduxStore/RootStore";
import { changeSelectedUser } from "../redux-store/StatusEditorSlice";

type IUIAllUsersProps = PaperProps;

export default function UIAllUsers({ ...props }: IUIAllUsersProps) {
  const users = useSelector((state: RootState) => state.statusEditor.users);
  const dispatch = useAppDispatch();

  const selectUser = (userID: number) => () => {
    dispatch(changeSelectedUser(userID));
  };

  return (
    <Paper elevation={0} {...props}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <UIUserProfileHead />
          <TableBody>
            {users.map((user: IBasicUserInformation) => (
              <TableRow key={user.id} hover onClick={selectUser(user.id)}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {user?.users_userprofile?.firstname || "Не указано"}
                </TableCell>
                <TableCell>
                  {user?.users_userprofile?.lastname || "Не указано"}
                </TableCell>
                <TableCell>{user?.username}</TableCell>
                <TableCell>
                  {user?.users_userprofile?.users_educationorganization
                    ?.organization_name || "Не указано"}
                </TableCell>
                <UIUserStatusCell user={user} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
