import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Button, Stack, Typography } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';

interface ICardResourceIframeProps extends PaperProps {
  card_store: CardByIDStore;
}

const CardGoToResource = observer(
  ({ card_store, ...props }: ICardResourceIframeProps) => {
    if (!card_store.card_data?.site_url) {
      return null;
    }
    const resourceUrl = card_store.card_data.site_url;
    let host = 'Внешний ресурс';
    try {
      host = new URL(resourceUrl).hostname.replace(/^www\./, '');
    } catch (_) {}
    return <div className="sw-resource-link">
      <div className="sw-resource-link-icon"><LanguageRoundedIcon /></div>
      <div className="sw-resource-link-copy"><span>ВНЕШНИЙ РЕСУРС</span><Typography component="strong">Материал продолжается на сайте</Typography><small>{host}</small></div>
      <Button aria-label={`Открыть ${host} в новой вкладке`} onClick={() => window.open(resourceUrl, '_blank', 'noopener,noreferrer')}><OpenInNewRoundedIcon /></Button>
    </div>;
  },
);

export default CardGoToResource;
