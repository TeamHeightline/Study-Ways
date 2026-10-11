import { Grid } from '@mui/material';
import { PaperProps } from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import React from 'react';
import { isMobileHook } from '../../../../../shared/custom-hooks/isMobileHook';
import { useSelector } from 'react-redux';
import { FILE_URL } from '../../../../../settings';
import { RootState } from '../../../../../app/redux-store/RootStore';

type IUIQuestionImageProps = PaperProps;

export default function UIQuestionImage({ ...props }: IUIQuestionImageProps) {
  const isMobile = isMobileHook();
  const questionImageURL = useSelector(
    (state: RootState) =>
      state?.examPlayer?.selected_question_data?.usertests_questionimage?.image,
  );

  if (!questionImageURL) {
    return <div />;
  }

  return (
    <Grid
      size={{
        xs: 12,
        md: 6,
      }}
    >
      <CardMedia
        style={{
          height: isMobile ? window.innerWidth - 100 : 500,
          backgroundSize: 'contain',
          maxHeight: isMobile ? window.innerWidth : 500,
          overflowY: 'auto',
          width: '100%',
        }}
        image={`${FILE_URL}/${questionImageURL}`}
      />
    </Grid>
  );
}
