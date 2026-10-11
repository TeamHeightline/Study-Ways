import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import type { ConnectedTheme } from './model';
import {
  buildThemeOptions,
  ThemeOption,
  visibleThemeOptions,
} from './theme-options';

const ThemePopper = styled(Popper)({
  zIndex: 1400,
  minWidth: 'min(440px, calc(100vw - 32px))',
  maxWidth: 'calc(100vw - 24px)',
  '& .MuiAutocomplete-paper': {
    background: 'var(--sw-surface)',
    color: 'var(--sw-ink)',
    border: '1px solid var(--sw-border-strong)',
    borderRadius: 'var(--sw-radius-12)',
    boxShadow: '0 12px 32px rgb(var(--sw-shadow-rgb) / 0.16)',
  },
  '& .MuiAutocomplete-listbox': {
    maxHeight: 'min(480px, 60vh)',
    padding: '8px',
    fontSize: 'var(--sw-font-size-13)',
  },
  '& .MuiAutocomplete-option': {
    minHeight: 44,
    borderRadius: 'var(--sw-radius-8)',
    overflowWrap: 'anywhere',
    '&.Mui-focused': { backgroundColor: 'var(--sw-accent-100)' },
    '&[aria-selected="true"], &[aria-selected="true"].Mui-focused': {
      backgroundColor: 'var(--sw-accent-150)',
      color: 'var(--sw-accent-700)',
    },
  },
});

interface ThemeSelectProps {
  id?: string;
  themes: readonly ConnectedTheme[];
  selectedIds: readonly string[];
  onChange: (ids: string[]) => void;
  label: string;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export function ThemeSelect({
  id,
  themes,
  selectedIds,
  onChange,
  label,
  placeholder,
  multiple = false,
  disabled,
  loading,
}: ThemeSelectProps) {
  const selectedKey = selectedIds.join(',');
  const model = useMemo(() => {
    const known = new Set(themes.map(theme => String(theme.id)));
    const missing = selectedKey
      .split(',')
      .filter(value => value && !known.has(value));
    return buildThemeOptions([
      ...themes,
      ...missing.map(value => ({
        id: Number(value),
        text: `Тема №${value}`,
        parentId: null,
      })),
    ]);
  }, [themes, selectedKey]);
  const selected = useMemo(
    () =>
      selectedKey
        .split(',')
        .filter(Boolean)
        .map(value => model.byId.get(Number(value))!)
        .filter(Boolean),
    [model, selectedKey],
  );
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const highlighted = useRef<ThemeOption | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setExpanded(previous => {
      const next = new Set(previous);
      for (const option of selected) {
        let cursor =
          option.parentId === null
            ? undefined
            : model.byId.get(option.parentId);
        while (cursor && !next.has(cursor.id)) {
          next.add(cursor.id);
          cursor =
            cursor.parentId === null
              ? undefined
              : model.byId.get(cursor.parentId);
        }
      }
      return next.size === previous.size ? previous : next;
    });
  }, [selected, model]);
  const toggle = (
    option: ThemeOption,
    shouldExpand = !expanded.has(option.id),
  ) => {
    setExpanded(previous => {
      const next = new Set(previous);
      if (shouldExpand) next.add(option.id);
      else next.delete(option.id);
      return next;
    });
  };
  return (
    <Autocomplete<ThemeOption, boolean, false, false>
      id={id}
      className="sw-theme-select"
      fullWidth
      multiple={multiple}
      disableCloseOnSelect={multiple}
      openOnFocus
      open={open && !disabled}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={disabled}
      loading={loading}
      options={model.options}
      value={multiple ? selected : (selected[0] ?? null)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.text}
      filterOptions={() => visibleThemeOptions(model, expanded, search)}
      onInputChange={(_event, value, reason) =>
        setSearch(reason === 'input' ? value : '')
      }
      onChange={(_event, value) => {
        const options = Array.isArray(value) ? value : value ? [value] : [];
        onChange([...new Set(options.map(option => String(option.id)))]);
      }}
      onHighlightChange={(_event, option) => {
        highlighted.current = option;
      }}
      onKeyDown={event => {
        const option = highlighted.current;
        if (
          open &&
          !search &&
          option?.hasChildren &&
          ['ArrowRight', 'ArrowLeft'].includes(event.key)
        ) {
          event.preventDefault();
          (
            event as React.KeyboardEvent & { defaultMuiPrevented: boolean }
          ).defaultMuiPrevented = true;
          toggle(option, event.key === 'ArrowRight');
        }
      }}
      clearText="Сбросить тему"
      openText="Открыть темы"
      closeText="Закрыть темы"
      noOptionsText="Темы не найдены"
      loadingText="Загружаем темы…"
      renderValue={
        multiple
          ? (values, getItemProps) =>
              (Array.isArray(values) ? values : []).map((option, index) => {
                const { key, ...props } = {
                  key: option.id,
                  ...getItemProps({ index }),
                };
                return (
                  <Chip
                    key={key}
                    {...props}
                    label={option.text}
                    size="small"
                    sx={{
                      maxWidth: '100%',
                      bgcolor: 'var(--sw-accent-100)',
                      color: 'var(--sw-ink)',
                    }}
                  />
                );
              })
          : undefined
      }
      renderOption={(props, option, { selected: checked }) => (
        <li
          {...props}
          key={option.id}
          data-theme-id={option.id}
          style={{ paddingLeft: 8 + Math.min(option.depth, 10) * 14 }}
        >
          {option.hasChildren ? (
            <IconButton
              size="small"
              tabIndex={-1}
              aria-label={`${expanded.has(option.id) || search ? 'Свернуть' : 'Развернуть'} «${option.text}»`}
              aria-expanded={expanded.has(option.id) || !!search}
              onMouseDown={event => event.preventDefault()}
              onClick={event => {
                event.stopPropagation();
                toggle(option);
              }}
              sx={{ flexShrink: 0, color: 'var(--sw-secondary)', mr: 0.5 }}
            >
              {expanded.has(option.id) || search ? (
                <ExpandMoreRoundedIcon fontSize="small" />
              ) : (
                <ChevronRightRoundedIcon fontSize="small" />
              )}
            </IconButton>
          ) : (
            <Box component="span" sx={{ width: 34, flexShrink: 0 }} />
          )}
          {multiple && (
            <Checkbox
              checked={checked}
              tabIndex={-1}
              disableRipple
              size="small"
              sx={{ p: 0.5, mr: 0.5 }}
              slotProps={{
                input: { 'aria-hidden': true, readOnly: true },
              }}
            />
          )}
          <Box sx={{ minWidth: 0 }}>
            <Box component="span" data-theme-text>
              {option.text}
            </Box>
            {option.parentId !== null && (
              <Typography
                component="small"
                sx={{
                  display: 'block',
                  color: 'var(--sw-muted)',
                  fontSize: '0.8em',
                  lineHeight: 1.4,
                }}
              >
                {model.byId.get(option.parentId)?.text}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          slotProps={{
            ...params.slotProps,

            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading && (
                    <CircularProgress
                      color="inherit"
                      size={18}
                      aria-label="Загрузка тем"
                    />
                  )}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      sx={{
        minWidth: 0,
        '& .MuiOutlinedInput-root': {
          minHeight: 48,
          bgcolor: 'var(--sw-surface)',
          borderRadius: 'var(--sw-radius-10)',
          fontSize: 'var(--sw-font-size-13)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--sw-border-strong)',
        },
      }}
      slots={{
        popper: ThemePopper,
      }}
    />
  );
}
