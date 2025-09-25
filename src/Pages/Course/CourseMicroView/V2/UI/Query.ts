import { gql } from "@apollo/client";

export const GET_COURSE_DATA_BY_ID = gql`
  query GET_COURSE_DATA_BY_ID($id: ID!) {
    cardCourseById(id: $id) {
      courseData
      id
      name
    }
  }
`;
