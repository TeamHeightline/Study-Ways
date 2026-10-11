import { useUserSession } from '../../../../shared/store/user-store/user-session';
import { useGetCardSelectorPageQuery } from '../store/card-selector-api';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useEffect, useState } from 'react';
import { MicroCardField } from './MicroCardField';
import { CleverSearching } from './CleverSearching';
import { useCardSelector } from '../store/CardSelectorStore';
import { Alert, Button, Skeleton, Box, Stack } from '@mui/material';
import { HardLevel } from './HardLevel';
import { ContentType } from './ContentType';
import { ConnectedThemes } from './ConnectedThemes';
import { Pages } from './Pages';
import { useAppDispatch } from '../../../../app/redux-store/RootStore';
import { AuthorFilter } from '../../../../shared/authors/AuthorFilter';
interface ICardSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  onThemeChange?: (id?: number) => void;
  mode?: 'onlyCreatedByMe' | 'standard';
  onCardSelect: (card_id: number) => void;
  showCreateNewCard?: boolean;
}
export const CardSelector = ({
  onCardSelect,
  mode = 'standard',
  showCreateNewCard,
  onThemeChange,
  ...props
}: ICardSelectorProps) => {
  const selector = useCardSelector();
  const session = useUserSession();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState(selector.searching_string);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(selector.searching_string), 300);
    return () => clearTimeout(timer);
  }, [selector.searching_string]);
  const mine = mode === 'onlyCreatedByMe';
  const query = useGetCardSelectorPageQuery(
    mine && !session.user?.id
      ? skipToken
      : {
          page: selector.activePage,
          search,
          authorId: mine ? undefined : selector.authorID,
          themeId: selector.cardConnectedTheme,
          hardLevel:
            selector.hardLevel === 'undefined'
              ? undefined
              : Number(selector.hardLevel.slice(2)),
          contentType:
            selector.contentType === 'undefined'
              ? undefined
              : Number(selector.contentType.slice(2)),
          mine,
          userId: mine ? session.user?.id : undefined,
        },
  );
  useEffect(() => {
    selector.setMode(mode);
  }, [mode]);
  useEffect(() => {
    if (selector.selectedCardID) {
      onCardSelect(Number(selector.selectedCardID));
      selector.selectCard(undefined);
    }
  }, [selector.selectedCardID]);
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
            value={selector.authorID}
            onChange={selector.changeAuthor}
          />
        )}
        <HardLevel />
        <ContentType />
      </Stack>
      <Box sx={{ mt: 2 }}>
        {query.isError && (
          <Alert
            severity="error"
            action={<Button onClick={() => query.refetch()}>Повторить</Button>}
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
        activePage={query.currentData?.activePage ?? selector.activePage}
        count={query.currentData?.numPages ?? 1}
      />
    </div>
  );
};
