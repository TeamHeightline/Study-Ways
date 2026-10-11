import { observer } from 'mobx-react';
import React from 'react';
import { Pagination, Stack } from '@mui/material';
import { CSSObject } from '../Store/CardSelectorStore';

type IPagesProps = React.HTMLAttributes<HTMLDivElement> & {
  activePage: number;
  count: number;
};

export const Pages = observer(
  ({ activePage, count, ...props }: IPagesProps) => (
    <div {...props}>
      <Stack
        sx={{
          alignItems: 'center',
        }}
      >
        <Pagination
          page={activePage}
          count={count}
          onChange={CSSObject.changeActivePage}
        />
      </Stack>
    </div>
  ),
);
