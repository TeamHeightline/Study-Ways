import { observer } from 'mobx-react';
import React from 'react';
import { TextField } from '@mui/material';
import { SASObject } from '../Store/SelectAttemptStore';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

type IAfterTimeProps = React.HTMLAttributes<HTMLDivElement>;

export const AfterTime = observer(({ ...props }: IAfterTimeProps) => (
  <div {...props}>
    <DateTimePicker
      label="Результаты начиная с"
      value={SASObject.afterTime}
      onChange={SASObject.changeAfterTime}
      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
    />
  </div>
));
