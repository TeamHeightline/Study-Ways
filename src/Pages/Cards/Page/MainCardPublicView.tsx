import { ThemeManulNote } from '../../../Shared/Theme/ThemeManulNote';
import React, { useEffect, useRef, useState } from 'react';
import { runInAction } from 'mobx';
import { CSSObject } from '../Selector/Store/CardSelectorStore';
import { AISObject } from './AISearch/Store/AISearch';
import { parseThemeId } from '../../../Shared/ConnectedThemes/model';

import { Helmet } from 'react-helmet';

import { observer } from 'mobx-react';
import { CardSelector } from '../Selector/UI/CardSelector';
import { useNavigate } from 'react-router-dom';
import { AIRoutes } from './AISwitch';
import { AICardSelector } from './AISearch/UI/AICardSelector';
import useQueryParams from '../../../Shared/CustomHooks/useQueryParams';
import { Box } from '@mui/material';

export const MainCardPublicView = observer(() => {
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const themeId = parseThemeId(queryParams.get('theme'));
  const [themeReady, setThemeReady] = useState(false);
  const firstTheme = useRef(true);
  useEffect(() => {
    runInAction(() => {
      if (firstTheme.current && themeId !== undefined) {
        CSSObject.searching_string = '';
        CSSObject.authorID = undefined;
        CSSObject.hardLevel = 'undefined';
        CSSObject.contentType = 'undefined';
        AISObject.AISearchString = '';
        AISObject.selectedCardAuthor = undefined;
        AISObject.hardLevel = '-1';
        AISObject.contentType = 'undefined';
      }
      CSSObject.cardConnectedTheme = themeId;
      if (AISObject.cardConnectedTheme !== themeId) {
        AISObject.setThemeFilter(
          themeId,
          themeId === undefined ? [] : [String(themeId)],
        );
      }
      firstTheme.current = false;
    });
    setThemeReady(true);
  }, [themeId]);
  const changeTheme = (id?: number) => {
    const params = new URLSearchParams(queryParams);
    if (id === undefined) params.delete('theme');
    else params.set('theme', String(id));
    navigate({ search: params.toString() });
  };

  return (
    <div>
      <Helmet>
        <title>Ресурсы</title>
      </Helmet>
      <AIRoutes />
      <ThemeManulNote context="library" />
      <Box sx={{ mt: 1 }}>
        {themeReady &&
          (queryParams.get('searchType') == 'AISearch' ? (
            <AICardSelector
              onThemeChange={changeTheme}
              onCardSelect={card_id => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(`/card/${card_id}`);
              }}
            />
          ) : (
            <CardSelector
              onThemeChange={changeTheme}
              onCardSelect={card_id => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(`/card/${card_id}`);
              }}
            />
          ))}
      </Box>
    </div>
  );
});
