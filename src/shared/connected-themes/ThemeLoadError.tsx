import React from 'react';
import { Alert, Button } from '@mui/material';

export function ThemeLoadError({
  isError,
  refetch,
}: {
  isError: boolean;
  refetch: () => unknown;
}) {
  if (!isError) return null;
  return (
    <Alert
      severity="error"
      sx={{ mt: 1 }}
      action={<Button onClick={() => refetch()}>Повторить</Button>}
    >
      Не удалось загрузить темы.
    </Alert>
  );
}
