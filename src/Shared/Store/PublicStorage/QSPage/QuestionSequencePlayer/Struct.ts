import {gql} from 'graphql.macro';


export const GET_ENCRYPT_QUESTION_DATA_BY_ID = gql`
  query GET_ENCRYPT_QUESTION_DATA_BY_ID($id: ID!, $examMode: Boolean) {
    eqbi(id: $id, examMode: $examMode) {
      qbs
      abs
    }
  }
`;

