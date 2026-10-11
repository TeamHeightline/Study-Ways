import {
  useGetCardSelectorPageQuery,
  cardSelectorApi,
} from '../Store/card-selector-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { MicroCardField } from './MicroCardField';
import { CleverSearching } from './CleverSearching';
import { CSSObject } from '../Store/CardSelectorStore';
import { Alert, Button, Skeleton, Box, Stack } from '@mui/material';
import { HardLevel } from './HardLevel';
import { ContentType } from './ContentType';
import { ConnectedThemes } from './ConnectedThemes';
import { Pages } from './Pages';
import { loadAllCardsData } from '../../CardMicroView/store/async-actions';
import { useAppDispatch } from '../../../../App/ReduxStore/RootStore';
import { AuthorFilter } from '../../../../Shared/Authors/AuthorFilter';

interface ICardSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  onThemeChange?: (id?: number) => void;
  mode?: 'onlyCreatedByMe' | 'standard';
  onCardSelect: (card_id: number) => void;
  showCreateNewCard?: boolean;
}

export const CardSelector = observer(
  ({
    onCardSelect,
    mode = 'standard',
    showCreateNewCard,
    onThemeChange,
    ...props
  }: ICardSelectorProps) => {
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState(CSSObject.searching_string);
    useEffect(() => {
      const timer = setTimeout(
        () => setSearch(CSSObject.searching_string),
        300,
      );
      return () => clearTimeout(timer);
    }, [CSSObject.searching_string]);
    const mine = mode === 'onlyCreatedByMe';
    const query = useGetCardSelectorPageQuery(
      mine && !UserStorage.user_data?.id
        ? skipToken
        : {
            page: CSSObject.activePage,
            search,
            authorId: mine ? undefined : CSSObject.authorID,
            themeId: CSSObject.cardConnectedTheme,
            hardLevel:
              CSSObject.hardLevel === 'undefined'
                ? undefined
                : Number(CSSObject.hardLevel.slice(2)),
            contentType:
              CSSObject.contentType === 'undefined'
                ? undefined
                : Number(CSSObject.contentType.slice(2)),
            mine,
            userId: mine ? UserStorage.user_data?.id : undefined,
          },
    );
    useEffect(() => {
      CSSObject.refreshResults = () =>
        dispatch(cardSelectorApi.util.invalidateTags(['CardList']));
      return () => {
        CSSObject.refreshResults = undefined;
      };
    }, [dispatch]);

    useEffect(() => {
      dispatch(loadAllCardsData());
    }, []);

    useEffect(() => CSSObject.setMode(mode), [mode]);
    useEffect(() => {
      if (CSSObject.selectedCardID) {
        onCardSelect(Number(CSSObject.selectedCardID));
        CSSObject.selectedCardID = undefined;
      }
    }, [CSSObject.selectedCardID]);
    return (
      <div {...props}>
        <CleverSearching />
        <Stack
          className="sw-search-filters"
          data-author-filter={mode === 'standard'}
          sx={{ pt: 2, pr: 4, pl: 4, mb: 2 }}
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1, md: 4 }}
        >
          <ConnectedThemes onThemeChange={onThemeChange} />
          {mode === 'standard' && (
            <AuthorFilter
              scope="cards"
              value={CSSObject.authorID}
              onChange={CSSObject.changeAuthor}
            />
          )}
          <HardLevel />
          <ContentType />
        </Stack>
        <Box sx={{ mt: 2 }}>
          {query.isError && (
            <Alert
              severity="error"
              action={
                <Button onClick={() => query.refetch()}>Повторить</Button>
              }
            >
              Не удалось загрузить карточки.
            </Alert>
          )}
          {query.isFetching && !query.currentData ? (
            <Skeleton height={200} aria-label="Загрузка карточек" />
          ) : (
            <MicroCardField
              showCreateNewCard={showCreateNewCard}
              cardIds={query.currentData?.IDs ?? []}
            />
          )}
          {query.currentData?.IDs.length === 0 && (
            <Alert severity="info">По выбранным фильтрам карточек нет.</Alert>
          )}
        </Box>
        <Pages
          activePage={query.currentData?.activePage ?? CSSObject.activePage}
          count={query.currentData?.numPages ?? 1}
        />
      </div>
    );
  },
);
