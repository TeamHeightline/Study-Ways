import { Search } from './search';
import { Flow } from './map';
import {
  Alert,
  Button,
  Box,
  CircularProgress,
  Fade,
  Stack,
} from '@mui/material';
import CardByID from '../../cards/card-by-id/ui/card-by-id';
import { useAICourse } from '../model/store';
import { AnimatedTitle } from './animated-title';
import { CardsNotLoadedIndicator } from './cards-not-loaded-indicator';
export const AiCourse = () => {
  const course = useAICourse();
  const cardID = course.selectedCardId;
  const isSearchButtonClicked = course.isSearchButtonClicked;
  const isDefaultCardsLoaded = course.isDefaultCardsLoaded;
  if (!isSearchButtonClicked) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '80dvh',
        }}
      >
        <AnimatedTitle />
        <Search />
        <CardsNotLoadedIndicator />
      </Stack>
    );
  }
  if (!isDefaultCardsLoaded) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '90dvh',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <Box className="sw-ai-workspace" sx={{ overflowX: 'hidden' }}>
      <Stack
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          p: 1,
        }}
      >
        <Search />
      </Stack>
      {course.error && (
        <Alert
          severity="error"
          action={<Button onClick={course.onSearch}>Повторить поиск</Button>}
        >
          Не удалось загрузить рекомендации. Для продолжения маршрута нажмите
          выбранную карточку ещё раз.
        </Alert>
      )}
      <Fade in timeout={1000}>
        <div>
          <Flow />
        </div>
      </Fade>
      {cardID && (
        <CardByID
          card_id={cardID}
          is_hidden_navigation={true}
          is_hidden_similar_cards={true}
          is_hidden_go_back_button={true}
        />
      )}
    </Box>
  );
};
