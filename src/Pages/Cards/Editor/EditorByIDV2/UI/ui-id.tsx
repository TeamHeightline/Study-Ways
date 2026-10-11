import React from 'react';
import Typography from '@mui/material/Typography';
import { useCardEditor } from '../model/use-card-editor';

type IIDProps = React.HTMLAttributes<HTMLDivElement>;

export const ID = ({ ...props }: IIDProps) => {
  const editor = useCardEditor();
  return (
    <div {...props}>
      <Typography variant="h5" color="textPrimary" style={{ marginTop: 12 }}>
        {`ID: ${editor.draft.id ?? ''}`}
      </Typography>
    </div>
  );
};
