import React, { useMemo } from 'react';
import {
  Autocomplete,
  Avatar,
  Button,
  CircularProgress,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { useGetAuthorsQuery, AuthorScope } from './api';
import { AuthorSummary, getAuthorName } from './types';

interface AuthorOption {
  id: string;
  label: string;
  author?: AuthorSummary;
}

interface AuthorFilterProps {
  scope: AuthorScope;
  value: string | number | null | undefined;
  onChange: (id: string | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  specialOptions?: { id: string; label: string }[];
}

const filterOptions = createFilterOptions<AuthorOption>({
  stringify: option => `${option.label} ${option.author?.username || ''}`,
});

export function AuthorFilter({
  scope,
  value,
  onChange,
  label = 'Автор',
  placeholder,
  className,
  specialOptions = [],
}: AuthorFilterProps) {
  const {
    data: authors = [],
    isFetching,
    isError,
    refetch,
  } = useGetAuthorsQuery(scope);
  const options: AuthorOption[] = [
    ...specialOptions,
    ...useMemo(
      () =>
        authors.map(author => ({
          id: String(author.id),
          label: getAuthorName(author),
          author,
        })),
      [authors],
    ),
  ];
  const selectedID = value == null ? null : String(value);
  const matchingAuthor = options.find(
    option => option.author && option.id === selectedID,
  );
  const specialLabel = specialOptions.find(
    option => option.id === selectedID,
  )?.label;
  const selected = useMemo(
    () =>
      selectedID === null
        ? null
        : matchingAuthor || {
            id: selectedID,
            label: specialLabel || `Автор №${selectedID}`,
          },
    [selectedID, matchingAuthor, specialLabel],
  );
  if (selected && !options.some(option => option.id === selected.id))
    options.push(selected);

  return (
    <Autocomplete<AuthorOption>
      className={className}
      fullWidth
      size="small"
      options={options}
      value={selected}
      isOptionEqualToValue={(option, selectedOption) =>
        option.id === selectedOption.id
      }
      getOptionLabel={option => option.label}
      filterOptions={filterOptions}
      onChange={(_, option) => onChange(option?.id ?? null)}
      loading={isFetching}
      loadingText="Загружаем авторов…"
      noOptionsText={
        isError ? 'Не удалось загрузить авторов' : 'Авторы не найдены'
      }
      clearText="Сбросить автора"
      openText="Выбрать автора"
      closeText="Закрыть список авторов"
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <span className="sw-author-option">
            {option.author && (
              <Avatar
                src={option.author.users_userprofile?.avatar_src || undefined}
                className="sw-author-option-avatar"
                aria-hidden="true"
              >
                {option.label.charAt(0)}
              </Avatar>
            )}
            <span>
              <strong>{option.label}</strong>
              {option.author?.username &&
                option.author.username !== option.label && (
                  <small>{option.author.username}</small>
                )}
            </span>
          </span>
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={isError}
          helperText={
            isError ? (
              <>
                Не удалось загрузить авторов.{' '}
                <Button
                  color="inherit"
                  size="small"
                  disabled={isFetching}
                  onClick={() => refetch()}
                >
                  Повторить
                </Button>
              </>
            ) : undefined
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching && <CircularProgress size={16} color="inherit" />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
