import React, { useId, useState } from 'react';
import {
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { observer } from 'mobx-react';
import ThemeStoreObject from '../../global-theme';
import { ThemeStore } from './theme-store';
import { ThemeIllustration } from './ThemeIllustration';

export const ThemeSelector = observer(
  ({ store = ThemeStoreObject }: { store?: ThemeStore }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const menuId = useId();
    return (
      <>
        <Tooltip title={`Тема: ${store.definition.label}`}>
          <IconButton
            className="sw-theme-trigger"
            aria-label="Выбрать тему"
            aria-haspopup="menu"
            aria-expanded={Boolean(anchor)}
            aria-controls={anchor ? menuId : undefined}
            onClick={event => setAnchor(event.currentTarget)}
          >
            <PaletteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          id={menuId}
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ className: 'sw-theme-menu' }}
          MenuListProps={{
            'aria-label': 'Оформление',
            subheader: <ListSubheader disableSticky>Оформление</ListSubheader>,
          }}
        >
          {store.availableThemes.map(theme => (
            <MenuItem
              key={theme.id}
              role="menuitemradio"
              aria-checked={store.id === theme.id}
              selected={store.id === theme.id}
              onClick={() => {
                store.setTheme(theme.id);
                setAnchor(null);
              }}
            >
              <span
                className="sw-theme-swatch"
                aria-hidden="true"
                style={{
                  background: theme.colors.canvas,
                  borderColor: theme.colors.border,
                }}
              >
                <span style={{ background: theme.colors.sidebar }} />
                <i style={{ background: theme.colors.accent }} />
                <ThemeIllustration
                  variant="portrait"
                  pack={theme.illustrations || 'none'}
                />
              </span>
              <span className="sw-theme-name">
                {theme.label}
                <small>
                  {theme.accessibility === 'enhanced'
                    ? 'Крупный шрифт'
                    : theme.mode === 'dark'
                      ? 'Тёмная тема'
                      : 'Светлая тема'}
                </small>
              </span>
              {store.id === theme.id && (
                <CheckRoundedIcon className="sw-theme-check" fontSize="small" />
              )}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  },
);
