import React from 'react';
import {
  Autocomplete,
  Grid,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { useAISearch } from '../store/AISearch';
import SearchIcon from '@mui/icons-material/Search';
import AIHardLevelFilter from './AIHardLevelFilter';
import AIThemeFilter from './AIThemeFilter';
import { ContentType } from './AIContentTypeFilter';
import AIAuthorSelector from './AIAutohorSelector';
export const AISearchString = ({
  onThemeChange,
}: {
  onThemeChange?: (id?: number) => void;
}) => {
  const search = useAISearch({ suggestions: true });
  function changeHandler(event, value) {
    search.changeAISearchString(value);
  }
  return (
    <Grid
      className="sw-search-panel"
      container
      sx={{
        justifyContent: 'center',
      }}
    >
      <Grid
        sx={{ pb: 2, p: { xs: 1, md: 0 } }}
        size={{
          xs: 12,
          md: 8,
        }}
      >
        <Stack
          direction={'row'}
          spacing={2}
          sx={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Autocomplete
            id="card-search"
            freeSolo
            options={search.cardDataForAutocomplete}
            filterOptions={x => x}
            // autoComplete
            onChange={search.onSelectCardInAutocomplete}
            // value={AISObject.AISearchString || ""}
            inputValue={search.AISearchString || ''}
            onInputChange={changeHandler}
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                className="sw-search-input"
                label="AI поиск"
                variant="outlined"
              />
            )}
          />
          <div>
            <IconButton
              className="sw-search-submit"
              size={'large'}
              aria-label="search cards"
              onClick={() => search.getAISearchResult()}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Stack>
        <Stack
          className="sw-search-filters"
          direction={{ xs: 'column', lg: 'row' }}
          sx={{ mt: 2, width: '100%' }}
          spacing={{ xs: 2 }}
        >
          <AIThemeFilter onThemeChange={onThemeChange} />
          <AIAuthorSelector />
          <AIHardLevelFilter />
          <ContentType />
        </Stack>
      </Grid>
    </Grid>
  );
};
