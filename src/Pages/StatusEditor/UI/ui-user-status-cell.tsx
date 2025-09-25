import { TableCell } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";
import { IBasicUserInformation } from "../../../Shared/ServerLayer/Types/user.types";

interface IUIUserStatusCellProps extends PaperProps {
  user: IBasicUserInformation;
}

export default function UIUserStatusCell({
  user,
  ...props
}: IUIUserStatusCellProps) {
  return (
    <TableCell>
      {user.user_access_level == "STUDENT" && "Студент"}
      {user.user_access_level == "CARD_EDITOR" &&
        "Студент с правом создания карточек"}
      {user.user_access_level == "TEACHER" && "Преподаватель"}
      {user.user_access_level == "ADMIN" && "Администратор"}
    </TableCell>
  );
}
