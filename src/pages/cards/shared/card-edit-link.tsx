import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useUserSession } from '../../../shared/store/user-store/user-session';
import './card-preview.css';

export const cardEditorHref = (id: number | string) =>
  `/editor/card2/card/${id}`;

export function CardEditLink({
  id,
  ownerId,
  className = '',
  style,
}: {
  id: number;
  ownerId?: number | null;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { user, role } = useUserSession();
  const allowed =
    !!user &&
    (role === 'ADMIN' ||
      (['TEACHER', 'CARD_EDITOR'].includes(role) && ownerId === user.id));
  if (!allowed || !Number.isInteger(id) || id < 1) return null;
  return (
    <Tooltip title="Редактировать карточку в новой вкладке">
      <IconButton
        component="a"
        href={cardEditorHref(id)}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        style={style}
        className={`sw-card-edit-link ${className}`}
        aria-label={`Редактировать карточку ${id}`}
        onClick={event => event.stopPropagation()}
        onKeyDown={event => event.stopPropagation()}
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
