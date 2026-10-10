import { TableCell, TableHead, TableRow } from '@mui/material';

export default function UIUserProfileHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Пользователь</TableCell>
        <TableCell>Учебное заведение</TableCell>
        <TableCell>Уровень доступа</TableCell>
        <TableCell>
          <span className="sw-access-visually-hidden">Действия</span>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
