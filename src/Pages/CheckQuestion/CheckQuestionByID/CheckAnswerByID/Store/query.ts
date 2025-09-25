import { gql } from "@apollo/client";

export const AnswerDataByID = gql`
  query AnswerDataByID($answerID: ID!) {
    answerById(id: $answerID) {
      text
      helpTextv1
      helpTextv2
      helpTextv3
      isTrue
      id
    }
  }
`;
