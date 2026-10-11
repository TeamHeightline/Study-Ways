import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const allowedTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);
const maxBytes = 10 * 1024 * 1024;

export function ImageUpload({
  imageUrl,
  onUpload,
  disabled = false,
}: {
  imageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const dragDepth = useRef(0);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [failedFile, setFailedFile] = useState<File | null>(null);
  const upload = async (file: File) => {
    if (busy.current || disabled) return;
    setError('');
    setSuccess(false);
    setFailedFile(null);
    if (
      !allowedTypes.has(file.type) &&
      (file.type || !/\.(png|jpe?g|webp|gif)$/i.test(file.name))
    ) {
      setError('Выберите изображение PNG, JPEG, WebP или GIF.');
      return;
    }
    if (!file.size || file.size > maxBytes) {
      setError(
        file.size
          ? 'Размер изображения не должен превышать 10 МБ.'
          : 'Этот файл пуст. Выберите другое изображение.',
      );
      return;
    }
    busy.current = true;
    setUploading(true);
    try {
      await onUpload(file);
      setSuccess(true);
    } catch (cause) {
      setFailedFile(file);
      setError(
        (cause as { data?: { message?: string } })?.data?.message ||
          'Не удалось загрузить изображение. Попробуйте ещё раз.',
      );
    } finally {
      busy.current = false;
      setUploading(false);
    }
  };
  return (
    <Stack
      spacing={1.5}
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
    >
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        aria-label="Выбрать изображение карточки"
        hidden
        disabled={disabled || uploading}
        onChange={event => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) void upload(file);
        }}
      />
      <ButtonBase
        className="sw-image-upload"
        disabled={disabled || uploading}
        aria-label={imageUrl ? 'Заменить изображение' : 'Добавить изображение'}
        aria-busy={uploading}
        onClick={() => input.current?.click()}
        onDragEnter={event => {
          event.preventDefault();
          dragDepth.current++;
          setDragging(true);
        }}
        onDragOver={event => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={event => {
          event.preventDefault();
          if (--dragDepth.current <= 0) setDragging(false);
        }}
        onDrop={event => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          const files = event.dataTransfer.files;
          if (busy.current || disabled) return;
          if (files.length > 1) {
            setError('Выберите одно изображение.');
            return;
          }
          if (files[0]) void upload(files[0]);
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          p: 3,
          border: '1px dashed',
          borderColor: dragging
            ? 'var(--sw-accent)'
            : 'var(--sw-border-strong)',
          borderRadius: 'var(--sw-radius-12)',
          background: dragging
            ? 'var(--sw-accent-100)'
            : 'var(--sw-surface-subtle)',
          '&:hover': { borderColor: 'var(--sw-accent)' },
          '&.Mui-focusVisible': {
            outline: '3px solid var(--sw-focus)',
            outlineOffset: 3,
          },
          '&.Mui-disabled': { opacity: 0.7 },
        }}
      >
        {imageUrl ? (
          <Box component="img" src={imageUrl} alt="Изображение карточки" />
        ) : (
          <span className="sw-cedit-upload-icon">
            <AddPhotoAlternateOutlinedIcon />
          </span>
        )}
        {uploading ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <CircularProgress size={20} aria-label="Загрузка изображения" />
            <Typography component="span" role="status">
              Загружаем изображение…
            </Typography>
          </Stack>
        ) : (
          <strong>
            {imageUrl ? 'Заменить изображение' : 'Добавить изображение'}
          </strong>
        )}
        <Typography
          component="span"
          sx={{
            mt: 1,
            color: 'var(--sw-secondary)',
            fontSize: 'var(--sw-font-size-12)',
          }}
        >
          Перетащите файл или нажмите, чтобы выбрать. PNG, JPEG, WebP или GIF,
          до 10 МБ.
        </Typography>
      </ButtonBase>
      {error && (
        <Alert
          severity="error"
          action={
            failedFile ? (
              <Button color="inherit" onClick={() => void upload(failedFile)}>
                Повторить
              </Button>
            ) : undefined
          }
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Изображение загружено.
        </Alert>
      )}
    </Stack>
  );
}
