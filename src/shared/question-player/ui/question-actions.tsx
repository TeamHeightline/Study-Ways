import React, { useEffect, useRef, useState } from 'react';
import { Button, Stack } from '@mui/material';

interface QuestionActionsProps {
  onCheck: () => void;
  onGiveUp: () => void;
  disabled?: boolean;
}
export default function QuestionActions({
  onCheck,
  onGiveUp,
  disabled = false,
}: QuestionActionsProps) {
  const [checking, setChecking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
      <Button
        type="button"
        disabled={disabled || checking}
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          onCheck();
          setChecking(true);
          timer.current = setTimeout(() => setChecking(false), 1000);
        }}
      >
        Проверить
      </Button>
      <Button
        type="button"
        disabled={disabled}
        variant="outlined"
        color="secondary"
        onClick={onGiveUp}
        fullWidth
      >
        Сдаться
      </Button>
    </Stack>
  );
}
