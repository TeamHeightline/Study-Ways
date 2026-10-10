import React from 'react';
import { Button } from '@mui/material';
import { ArrowBack, PersonSearchOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ThemeIllustration } from '../../../Shared/Theme/ThemeIllustration';

export default function AuthorNotFound({
  failed = false,
  onRetry,
}: {
  failed?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className="sw-author-page">
      <Helmet>
        <title>
          {failed ? 'Страница автора недоступна' : 'Автор не найден'} — Study
          Ways
        </title>
      </Helmet>
      <div
        className="sw-empty sw-author-unavailable"
        role={failed ? 'alert' : 'status'}
      >
        <ThemeIllustration
          variant="thinker"
          className="sw-empty-mascot"
          fallback={<PersonSearchOutlined />}
        />
        <h1>{failed ? 'Не удалось загрузить автора' : 'Автор не найден'}</h1>
        <p>
          {failed
            ? 'Попробуйте ещё раз — возможно, соединение прервалось.'
            : 'Возможно, ссылка устарела. Другие авторы и их материалы ждут вас в каталоге.'}
        </p>
        <div>
          {failed && (
            <Button variant="contained" disableElevation onClick={onRetry}>
              Повторить
            </Button>
          )}
          <Button component={Link} to="/courses" startIcon={<ArrowBack />}>
            К каталогу курсов
          </Button>
        </div>
      </div>
    </div>
  );
}
