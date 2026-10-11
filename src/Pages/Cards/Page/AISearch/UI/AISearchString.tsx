import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  Autocomplete,
  Grid,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { AISObject } from '../Store/AISearch';
import SearchIcon from '@mui/icons-material/Search';
import AIHardLevelFilter from './AIHardLevelFilter';
import AIThemeFilter from './AIThemeFilter';
import { ContentType } from './AIContentTypeFilter';
import AIAuthorSelector from './AIAutohorSelector';

export const AISearchString = observer(
  ({ onThemeChange }: { onThemeChange?: (id?: number) => void }) => {
    useEffect(() => {
      AISObject.getAISearchResult();
      AISObject.loadAutocompleteDefaultData();
    }, []);

    function changeHandler(event, value) {
      AISObject.changeAISearchString(value);
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
              options={AISObject.cardDataForAutocomplete}
              filterOptions={x => x}
              // autoComplete
              onChange={AISObject.onSelectCardInAutocomplete}
              // value={AISObject.AISearchString || ""}
              inputValue={AISObject.AISearchString || ''}
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
                onClick={() => AISObject.getAISearchResult()}
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
  },
);
