import { Box, Stack, Typography } from '@mui/material';
import CardByID from '../../cards/card-by-id/ui/card-by-id';
import CardMicroView from '../../cards/card-micro-view';
const MainPage = () => {
  return (
    <Box>
      <Typography
        variant={'h3'}
        sx={{
          textAlign: 'center',
        }}
      >
        Добро пожаловать в{' '}
        <span
          style={{
            color: '#2196f3',
            textShadow: `rgb(75 135 184 / 22%) 1px 1px 10px`,
          }}
        >
          StudyWays
        </span>
      </Typography>
      <CardMicroView cardID={2677} />
      <Stack direction={'row'}></Stack>
    </Box>
  );
};
export default MainPage;
