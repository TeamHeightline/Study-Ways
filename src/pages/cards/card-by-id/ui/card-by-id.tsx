import { useUserSession } from '../../../../shared/store/user-store/user-session';
import React, { useEffect } from 'react';
import { useCardView } from '../store/CardByIDStore';
import GoBackButton from './go-back-button';
import TitleAndNavigation from './title-and-navigation';
import { PaperProps } from '@mui/material/Paper';
import CardContentAndDescription from './card-content-and-description';
import CourseMicroView from '../../../course/course-micro-view/v2/ui/CourseMicroView';
import SimilarCards from './similar-cards';
import CardBrowserIndexing from './card-browser-indexing';
import useWindowDimensions from '../../../../shared/custom-hooks/useWindowDimensions';
import { Alert, Button, Box, Skeleton } from '@mui/material';
import { useGetCardQuery } from '../api/card-api';
import { skipToken } from '@reduxjs/toolkit/query';
import recombeeClient from '../../../../shared/store/recombee-client/recombee-client';
import recombee from 'recombee-js-api-client';
import TestAfterCard from './test-after-card';
interface ICardByIDProps extends PaperProps {
  card_id?: number;
  course_navigation?: ReturnType<typeof CourseMicroView>;
  is_hidden_go_back_button?: boolean;
  is_hidden_navigation?: boolean;
  is_hidden_similar_cards?: boolean;
}
const CardByID = ({
  card_id,
  course_navigation,
  is_hidden_go_back_button = false,
  is_hidden_navigation = false,
  is_hidden_similar_cards = false,
  ...props
}: ICardByIDProps) => {
  const session = useUserSession();
  const { width } = useWindowDimensions();
  const query = useGetCardQuery(
    card_id && Number.isInteger(card_id) && card_id > 0 ? card_id : skipToken,
  );
  const userId = session.recommendationUserId;
  const cardStorage = useCardView(
    card_id,
    query.currentData ?? undefined,
    query.refetch,
  );
  useEffect(() => {
    if (query.currentData?.id && userId) {
      recombeeClient.send(
        new recombee.AddDetailView(
          String(userId),
          String(query.currentData.id),
          { cascadeCreate: true },
        ),
      );
    }
  }, [query.currentData?.id, userId]);
  if (query.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить материал.
      </Alert>
    );
  if (query.currentData === null)
    return <Alert severity="info">Материал не найден.</Alert>;
  if (!card_id || cardStorage.card_data?.id !== card_id)
    return <Skeleton height={300} aria-label="Загрузка материала" />;
  return (
    <Box
      className="sw-card-page"
      sx={{
        pt: 3,
        pl: { xs: 1.5, md: 3 },
        pr: { xs: 1.5, md: 3 },
        maxWidth: width,
      }}
      {...props}
    >
      <CardBrowserIndexing card_store={cardStorage} />
      {!is_hidden_go_back_button && <GoBackButton sx={{ pb: 1 }} />}
      <TitleAndNavigation
        is_hidden_navigation={is_hidden_navigation}
        sx={{ pt: 1 }}
        card_store={cardStorage}
        course_navigation={course_navigation}
      />
      <CardContentAndDescription card_store={cardStorage} sx={{ pt: 1 }} />
      <TestAfterCard card_store={cardStorage} />

      {!is_hidden_similar_cards && (
        <SimilarCards card_store={cardStorage} sx={{ pt: 1 }} />
      )}
    </Box>
  );
};
export default CardByID;
