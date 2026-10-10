import { gql } from '@apollo/client';

export const GET_QUESTION_NANO_VIEW_BY_ID = gql`
  query GET_QUESTION_NANO_VIEW_BY_ID($id: Int!) {
    questionNanoViewById(id: $id) {
      id
      text
      questionImage
      ownerUsername
    }
  }
`;
