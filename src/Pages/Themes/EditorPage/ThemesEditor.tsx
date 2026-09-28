import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import ThemeEditor from '../ThemeTree/ThemeEditor';
import { isMobileHook } from '../../../Shared/CustomHooks/isMobileHook';

export default function ThemesEditor({ ...props }: any) {
  const isMobile = isMobileHook();
  return (
    <div {...props} className="sw-themes-editor">
      <Stack direction={'column'} alignItems={'center'}>
        <Typography variant={'h3'} sx={{ pt: 4, pb: 2 }}>
          Темы и разделы
        </Typography>
      </Stack>
      <p className="sw-themes-description">Выберите тему для редактирования. Перетаскивайте темы, чтобы изменить структуру.</p>
      <Grid
        container
        justifyContent={'center'}
        style={{ paddingLeft: isMobile ? 12 : 48 }}
      >
        <ThemeEditor />
      </Grid>
    </div>
  );
}
