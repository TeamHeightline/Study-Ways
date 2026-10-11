import React, { useMemo } from 'react';
import { Breadcrumbs, Link as MuiLink, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ConnectedTheme, getThemePaths, themeSearchUrl } from './model';
import { useGetConnectedThemesQuery } from './api';
import { ThemeLoadError } from './ThemeLoadError';

export function ThemeBreadcrumbs({
  selected,
  wrap = true,
}: {
  selected: ConnectedTheme[];
  wrap?: boolean;
}) {
  const themes = useGetConnectedThemesQuery(undefined, {
    skip: !selected.length,
  });
  const paths = useMemo(
    () => getThemePaths(themes.data ?? [], selected),
    [themes.data, selected],
  );
  if (!paths.length) return null;
  return (
    <Stack
      direction={wrap ? 'column' : 'row'}
      spacing={wrap ? 0.5 : 2}
      sx={{ minWidth: wrap ? 0 : 'max-content', overflowWrap: 'anywhere' }}
    >
      {paths.map(path => (
        <Breadcrumbs
          key={path[path.length - 1].id}
          aria-label="Иерархия темы"
          maxItems={Number.MAX_SAFE_INTEGER}
          sx={{
            fontSize: 'inherit',
            '& .MuiBreadcrumbs-ol': {
              flexWrap: wrap ? 'wrap' : 'nowrap',
              rowGap: 0.5,
            },
            '& .MuiBreadcrumbs-li': { minWidth: 0 },
            whiteSpace: wrap ? 'normal' : 'nowrap',
          }}
        >
          {path.map(theme => (
            <MuiLink
              component={Link}
              to={themeSearchUrl(theme.id)}
              key={theme.id}
              underline="hover"
              color="inherit"
              sx={{ fontSize: 'inherit' }}
            >
              {theme.text}
            </MuiLink>
          ))}
        </Breadcrumbs>
      ))}
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </Stack>
  );
}
