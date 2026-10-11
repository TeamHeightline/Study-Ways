import React from 'react';
import { Grid, TextField } from '@mui/material';
import { useCardSelector } from '../store/CardSelectorStore';
type ICleverSearchingProps = React.HTMLAttributes<HTMLDivElement>;
export const CleverSearching = ({ ...props }: ICleverSearchingProps) => {
  const selector = useCardSelector();
  return (
    <div className="sw-search-panel sw-standard-search" {...props}>
      <Grid
        container
        sx={{
          justifyContent: 'center',
        }}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <TextField
            value={selector.searching_string}
            onChange={selector.changeSearchString}
            fullWidth
            className="sw-search-input"
            label="Поиск"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  );
};
