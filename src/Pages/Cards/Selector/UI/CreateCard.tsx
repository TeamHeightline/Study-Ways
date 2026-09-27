import { observer } from 'mobx-react';
import React from 'react';
import { CardActionArea } from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Card from '@mui/material/Card';
import { CSSObject } from '../Store/CardSelectorStore';

type ICreateCardProps = React.HTMLAttributes<HTMLDivElement>;

export const CreateCard = observer(({ ...props }: ICreateCardProps) => (
  <div {...props}>
    <Card
      variant="outlined"
      className="sw-create-material"
    >
      <CardActionArea className="sw-create-material-action" onClick={() => CSSObject.createNewCard()}>
        <span className="sw-create-material-icon"><AddRounded /></span>
        <strong>Новая карточка</strong>
        <span className="sw-create-material-description">Добавьте материал, который поможет разобраться в теме.</span>
        <span className="sw-create-material-footer">Создать карточку <ArrowForwardRounded /></span>
      </CardActionArea>
    </Card>
  </div>
));
