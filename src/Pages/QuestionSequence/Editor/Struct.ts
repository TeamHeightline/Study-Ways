import { gql } from 'graphql.macro';

export const one_question_struct = {
  question_id: null, // ID вопроса
};

export const question_sequence_struct = {
  sequence: [],
};

export const CREATE_QUESTION_SEQUENCE = gql`
  mutation CREATE_QUESTION_SEQUENCE($sequenceData: GenericScalar!) {
    createQuestionSequence(input: { sequenceData: $sequenceData }) {
      clientMutationId
      sequence {
        id
        name
        description
        sequenceData
      }
    }
  }
`;
