import { gql } from '@apollo/client';

export const ADD_TO_BOOKMARK = gql`
  mutation ADD_TO_BOOKMARK($id: Int!) {
    addCardToBookmark(cardId: $id) {
      ok
    }
  }
`;

export const REMOVE_CARD_FROM_BOOKMARK = gql`
  mutation REMOVE_CARD_FROM_BOOKMARK($id: Int!) {
    removeCardFromBookmark(cardId: $id) {
      ok
    }
  }
`;

export const SET_RATING = gql`
  mutation SET_RATING($id: Int!, $rating: Float!) {
    setCardRating(cardId: $id, rating: $rating) {
      ok
    }
  }
`;
