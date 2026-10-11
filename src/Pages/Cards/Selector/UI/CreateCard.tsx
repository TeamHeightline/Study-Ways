import { observer } from 'mobx-react';
import React from 'react';
import { useCreateCardMutation } from '../../../../Shared/ServerLayer/QueryLayer/write-api';
import { Alert } from '@mui/material';
import { CardActionArea } from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import Card from '@mui/material/Card';
import { CSSObject } from '../Store/CardSelectorStore';

type ICreateCardProps = React.HTMLAttributes<HTMLDivElement>;

export const CreateCard = observer(({ ...props }: ICreateCardProps) => {
  const [createCard, { isLoading, isError }] = useCreateCardMutation();
  const create = async () => {
    try {
      const card = await createCard().unwrap();
      CSSObject.selectCard(card.id);
    } catch {}
  };
  return (
    <div {...props}>
      <Card variant="outlined" className="sw-create-material">
        <CardActionArea
          className="sw-create-material-action"
          disabled={isLoading}
          onClick={create}
        >
          <span className="sw-create-material-icon">
            <AddRounded />
          </span>
          <strong>Новая карточка</strong>
          <span className="sw-create-material-description">
            Добавьте материал, который поможет разобраться в теме.
          </span>
          <span className="sw-create-material-footer">
            Создать карточку <ArrowForwardRounded />
          </span>
        </CardActionArea>
      </Card>
      {isError && (
        <Alert severity="error">
          Не удалось создать карточку. Попробуйте ещё раз.
        </Alert>
      )}
    </div>
  );
});
