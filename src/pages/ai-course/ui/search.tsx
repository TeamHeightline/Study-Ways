import { Box, Fade, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAICourse } from '../model/store';
import { useCardPreviewMap } from '../../cards/card-micro-view/store/api';
export const Search = () => {
  const course = useAICourse();
  const card_hash_map = useCardPreviewMap();
  const isCardsNotLoaded = Object.keys(card_hash_map).length === 0;
  const searchString = course.searchString;
  const setSearchString = e => {
    course.setSearchString(e.target.value);
  };
  return (
    <Fade in timeout={1000}>
      <Box
        sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <Paper
          component="form"
          onSubmit={event => {
            event.preventDefault();
            if (isCardsNotLoaded) {
              return;
            }
            course.onSearch();
          }}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: 700,
            width: '100%',
            flexShrink: 0,
            borderRadius: 30,
            height: 45,
          }}
          className="sw-ai-course-search"
        >
          <InputBase
            onChange={setSearchString}
            value={searchString}
            sx={{
              ml: 1,
              flex: 1,
              input: {
                '&::placeholder': {
                  opacity: 0.7,
                },
              },
            }}
            placeholder="О чем будет курс?"
          />
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="search"
            disabled={isCardsNotLoaded}
            onClick={() => {
              course.onSearch();
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    </Fade>
  );
};
