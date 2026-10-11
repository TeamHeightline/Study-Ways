import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import React from 'react';
import { QuestionPlayerStore } from '../store/QuestionPlayerStore';
interface IUISelectHardLevelProps extends BoxProps {
  questionStore: QuestionPlayerStore;
}
const UISelectHardLevel = ({
  questionStore,
  ...props
}: IUISelectHardLevelProps) => (
  <Box {...props}>
    <Grid
      container
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        height: { xs: '100% - 100px', md: '100% - 300px' },
      }}
    >
      <Grid
        size={{
          xs: 12,
          md: 3,
        }}
      >
        <Card variant="elevation" elevation={3} style={{ padding: 12 }}>
          <Typography align={'center'} variant="h5" component={'span'}>
            Перед началом вопроса выберите уровень сложности:
          </Typography>
          <Select
            style={{ marginTop: 12 }}
            defaultValue={'0'}
            fullWidth
            onChange={e =>
              questionStore?.changeHardLevelOfHelpText(e.target.value)
            }
            variant="outlined"
          >
            <MenuItem value={'0'}>Легкий</MenuItem>
            <MenuItem value={'1'}>Средний</MenuItem>
            <MenuItem value={'2'}>Сложный</MenuItem>
          </Select>
          <Button
            onClick={() => questionStore.startQuestion()}
            style={{ marginTop: 12 }}
            fullWidth
            variant="contained"
            color="primary"
          >
            Начать вопрос
          </Button>
        </Card>
      </Grid>
    </Grid>
  </Box>
);
export default UISelectHardLevel;
