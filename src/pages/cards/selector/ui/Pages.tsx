import React from 'react';
import { Pagination, Stack } from '@mui/material';
import { useCardSelector } from '../store/CardSelectorStore';
type IPagesProps = React.HTMLAttributes<HTMLDivElement> & {
  activePage: number;
  count: number;
};
export const Pages = ({ activePage, count, ...props }: IPagesProps) => {
  const selector = useCardSelector();
  return (
    <div {...props}>
      <Stack
        sx={{
          alignItems: 'center',
        }}
      >
        <Pagination
          page={activePage}
          count={count}
          onChange={selector.changeActivePage}
        />
      </Stack>
    </div>
  );
};
