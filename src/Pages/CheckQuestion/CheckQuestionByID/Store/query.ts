import { gql } from "@apollo/client";

export const LoadAnswersIDArrayByQuestionID = gql`
  query LoadAnswersIDArrayByQuestionID($questionId: Int!) {
    answersId(questionId: $questionId) {
      IDs
      ownerQuestionId
    }
  }
`;
