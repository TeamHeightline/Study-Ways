import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import ThemeEditor from '../theme-tree/ThemeEditor';
import { isMobileHook } from '../../../shared/custom-hooks/isMobileHook';

export default function ThemesEditor({ ...props }: any) {
  const isMobile = isMobileHook();
  return (
    <div {...props} className="sw-themes-editor">
      <Stack
        direction={'column'}
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography variant={'h3'} sx={{ pt: 4, pb: 2 }}>
          Темы и разделы
        </Typography>
      </Stack>
      <p className="sw-themes-description">
        Выберите тему для редактирования. Перетаскивайте темы, чтобы изменить
        структуру.
      </p>
      <Grid
        container
        style={{ paddingLeft: isMobile ? 12 : 48 }}
        sx={{
          justifyContent: 'center',
        }}
      >
        <ThemeEditor />
      </Grid>
    </div>
  );
}
