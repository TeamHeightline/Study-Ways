import { observer } from 'mobx-react';
import { Typography } from '@mui/material';

export const AnimatedTitle = observer(() => (
  <Typography
    className="sw-ai-course-title"
    variant={'h2'}
    sx={{
      fontWeight: 'bold',
    }}
  >
    AI курс
  </Typography>
));
