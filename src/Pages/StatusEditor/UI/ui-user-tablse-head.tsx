import { TableCell, TableHead, TableRow } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";

type IUIUserProfileHeadProps = PaperProps;

export default function UIUserProfileHead({
  ...props
}: IUIUserProfileHeadProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>№</TableCell>
        <TableCell>Имя</TableCell>
        <TableCell>Фамилия</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Учебное заведение</TableCell>
        <TableCell>Статус</TableCell>
      </TableRow>
    </TableHead>
  );
}
