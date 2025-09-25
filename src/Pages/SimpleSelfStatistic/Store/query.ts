import { gql } from "@apollo/client";

export const GET_SELF_STATISTIC_ID = gql`
  query GET_SELF_STATISTIC_ID($page: Int!) {
    selfStatisticIdArray(page: $page) {
      activePage
      numPages
      IDs
    }
  }
`;
