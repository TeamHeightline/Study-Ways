import { Box, Card, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import React from 'react';
import { CoursePageCard } from '../../../course-materials-api';
import urlParser from 'js-video-url-parser';
import CardMedia from '@mui/material/CardMedia';
import { positionDataI } from '../../../CourseMicroView/V2/Store/CourseMicroStoreByID';
import { useNavigate } from 'react-router-dom';
import MultipleCards from './multiple-cards';
import NotLoaded from './not-loaded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';

interface ISingleCardProps extends BoxProps {
  cardData?: CoursePageCard;
  loading: boolean;
  card_id: string;
  size: {
    width: number;
    height: number;
  };
  itemIndex: number;
  rowIndex: number;
  positionData: positionDataI;
  activePage: number;
  courseID: number;
  viewedCardIDs: any;
}

export default function CardItem({
  card_id,
  cardData,
  loading,
  size,
  itemIndex,
  rowIndex,
  positionData,
  activePage,
  courseID,
  viewedCardIDs,
  ...props
}: ISingleCardProps) {
  const navigate = useNavigate();

  function handleNavigateToItem() {
    navigate(
      '/course?' +
        `id=${courseID}&activePage=${activePage}&selectedPage=${
          activePage
        }&selectedRow=${rowIndex}&selectedIndex=${itemIndex}`,
    );
  }

  const isSelected =
    positionData.selectedRow === rowIndex &&
    positionData.selectedIndex === itemIndex &&
    positionData.selectedPage === activePage;

  const isViewed = viewedCardIDs.has(card_id);

  const numberOfElements = card_id?.split(',').length;

  const video = urlParser.parse(cardData?.video_url || '');
  const imageSrc =
    cardData?.card_content_type === 0 && video?.provider === 'youtube'
      ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      : cardData?.cards_cardimage?.image
        ? `https://storage.googleapis.com/study-ways-files/${cardData.cards_cardimage.image}`
        : '';

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigateToItem();
        }
      }}
      className={`sw-material ${isSelected ? 'is-selected' : ''} ${isViewed ? 'is-viewed' : ''}`}
      sx={{ width: size.width }}
      onClick={handleNavigateToItem}
    >
      <Card variant={'outlined'} className="sw-material-card">
        {numberOfElements > 1 ? (
          <MultipleCards numberOfElements={numberOfElements} size={size} />
        ) : !cardData ? (
          <NotLoaded size={size} />
        ) : !imageSrc ? (
          <Box
            sx={{
              ...size,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--sw-sage-100)',
              color: 'var(--sw-accent-500)',
            }}
          >
            <PlayCircleOutlineRoundedIcon sx={{ fontSize: 42 }} />
          </Box>
        ) : (
          <CardMedia
            image={imageSrc}
            sx={{
              ...size,
              cacheControl: 'public,max-age=31536000,immutable',
              loading: 'lazy',
              decoding: 'async',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
            }}
          />
        )}
      </Card>
      <Typography className="sw-course-material-title" variant={'caption'}>
        {numberOfElements > 1
          ? `Подборка · ${numberOfElements} материалов`
          : cardData?.title ||
            (loading ? 'Загрузка материала…' : 'Материал недоступен')}
      </Typography>
      <span className="sw-material-state">
        {isSelected
          ? 'Сейчас изучаете'
          : isViewed
            ? 'Просмотрено'
            : 'Открыть материал'}
      </span>
    </Box>
  );
}
