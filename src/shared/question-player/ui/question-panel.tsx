import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from '@mui/material';

export interface QuestionPanelProps {
  text: string;
  imageUrl?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}
export default function QuestionPanel({
  text,
  imageUrl,
  actions,
  children,
}: QuestionPanelProps) {
  return (
    <Paper className="sw-question-panel" elevation={0}>
      <Card
        className="sw-question-panel-card"
        variant="outlined"
        sx={{ padding: 0, minHeight: { xs: '100%', md: 510 }, width: '100%' }}
      >
        <Grid
          className="sw-question-player-grid"
          container
          sx={{ justifyContent: 'center' }}
        >
          {imageUrl && (
            <Grid className="sw-question-media-cell" size={{ xs: 12, md: 7 }}>
              <CardMedia
                className="sw-question-media"
                style={{
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
                image={imageUrl}
              />
            </Grid>
          )}
          <Grid
            className="sw-question-copy-cell"
            size={{ xs: 12, md: imageUrl ? 5 : 12 }}
          >
            <CardContent className="sw-question-copy" sx={{ height: '100%' }}>
              <div style={{ width: '100%', minWidth: 0 }}>
                <Typography
                  className="sw-question-copy-title"
                  component="h5"
                  variant="h5"
                >
                  Вопрос
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                  className="sw-question-copy-text"
                >
                  {text}
                </Typography>
                {actions}
                {children}
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Paper>
  );
}
