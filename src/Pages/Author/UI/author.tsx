import React from 'react';
import { Avatar } from '@mui/material';
import {
  AutoStoriesOutlined,
  PersonOutlineRounded,
  SchoolOutlined,
} from '@mui/icons-material';
import { AuthorData, getAuthorName } from '../Store/types';
import { ThemeIllustration } from '../../../Shared/Theme/ThemeIllustration';

interface AuthorProps {
  author: AuthorData;
  courseCount: number;
  cardCount: number;
}

export function Author({ author, courseCount, cardCount }: AuthorProps) {
  const name = getAuthorName(author);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('');

  return (
    <header className="sw-author-hero">
      <div className="sw-author-identity">
        <Avatar
          src={author.users_userprofile?.avatar_src?.trim() || undefined}
          alt={name}
          className="sw-author-photo"
        >
          {initials || <PersonOutlineRounded />}
        </Avatar>
        <div className="sw-author-intro">
          <span className="sw-eyebrow">АВТОР STUDY WAYS</span>
          <h1>{name}</h1>
          <span className="sw-author-badge">
            <SchoolOutlined /> Автор материалов
          </span>
          <p>Курсы, учебные материалы и вопросы автора — в одном месте.</p>
        </div>
      </div>
      <div className="sw-author-art" aria-hidden="true">
        <span className="sw-author-art-orbit" />
        <ThemeIllustration
          variant="manuscript"
          fallback={<AutoStoriesOutlined />}
        />
        <span>Знания, которыми делятся</span>
      </div>
      <dl className="sw-author-stats">
        <div>
          <dt>Курсы</dt>
          <dd>{courseCount}</dd>
        </div>
        <div>
          <dt>Учебные карточки</dt>
          <dd>{cardCount}</dd>
        </div>
        <div>
          <dt>Вопросы</dt>
          <dd>
            {new Set(author.usertests_question?.map(item => item.id)).size}
          </dd>
        </div>
      </dl>
    </header>
  );
}
