import React from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'react-router-dom';
import { useGetAuthorQuery } from '../Store/author-api';
import AuthorNotFound from './author-not-found';
import Loading from './loading';
import { AuthorPage } from './author-page';

export function Author() {
  const { id = '' } = useParams();
  const authorID = Number(id);
  const validID =
    /^\d+$/.test(id) && Number.isSafeInteger(authorID) && authorID > 0;
  const { currentData, error, isFetching, refetch } = useGetAuthorQuery(
    validID ? authorID : skipToken,
  );

  if (!validID) return <AuthorNotFound />;
  if (isFetching && !currentData) return <Loading />;
  if (error && !currentData) {
    const notFound = 'status' in error && error.status === 404;
    return <AuthorNotFound failed={!notFound} onRetry={refetch} />;
  }
  if (!currentData) return <AuthorNotFound />;
  return <AuthorPage key={authorID} author={currentData} />;
}
