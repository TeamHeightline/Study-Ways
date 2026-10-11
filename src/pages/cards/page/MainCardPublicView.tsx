import { ThemeManulNote } from '../../../shared/theme/ThemeManulNote';
import React, { useEffect, useRef, useState } from 'react';
import { cardSelectorActions } from '../selector/store/CardSelectorStore';
import { aiSearchActions } from './ai-search/store/AISearch';
import { parseThemeId } from '../../../shared/connected-themes/model';
import { Helmet } from 'react-helmet';
import { CardSelector } from '../selector/ui/CardSelector';
import { useNavigate } from 'react-router-dom';
import { AIRoutes } from './AISwitch';
import { AICardSelector } from './ai-search/ui/AICardSelector';
import useQueryParams from '../../../shared/custom-hooks/useQueryParams';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/redux-store/RootStore';
import { Box } from '@mui/material';
export const MainCardPublicView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentAITheme = useAppSelector(s => s.aiSearch.cardConnectedTheme);
  const queryParams = useQueryParams();
  const themeId = parseThemeId(queryParams.get('theme'));
  const [themeReady, setThemeReady] = useState(false);
  const firstTheme = useRef(true);
  useEffect(() => {
    if (firstTheme.current && themeId !== undefined) {
      dispatch(cardSelectorActions.resetFilters());
      dispatch(aiSearchActions.resetFilters());
    }
    dispatch(
      cardSelectorActions.filtersChanged({ cardConnectedTheme: themeId }),
    );
    if (firstTheme.current || currentAITheme !== themeId)
      dispatch(
        aiSearchActions.themeChanged({
          id: themeId,
          ids: themeId === undefined ? [] : [String(themeId)],
        }),
      );
    firstTheme.current = false;
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
};
