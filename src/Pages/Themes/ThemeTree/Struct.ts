import { gql } from "graphql.macro";

export const GET_ALL_UNSTRUCTURED_THEME = gql`
  query GET_ALL_UNSTRUCTURED_THEME {
    unstructuredTheme {
      id
      text
      parent {
        id
      }
    }
  }
`;
export const SAVE_NEW_THEMES_SEQUENCE = gql`
  mutation SAVE_NEW_THEMES_SEQUENCE($sequence: String!) {
    usThemeSequence(input: { sequence: $sequence, createdBy: 0 }) {
      errors {
        field
        messages
      }
      uSThemeSequence {
        id
        sequence
      }
    }
  }
`;
export const GET_US_THEME_SEQUENCE = gql`
  query GET_US_THEME_SEQUENCE {
    usThemeSequence {
      id
      sequence
    }
  }
`;

export const UpdateTheme = gql`
  mutation UpdateTheme($text: String!, $id: ID!, $parent: ID) {
    updateUnstructuredTheme(input: { text: $text, id: $id, parent: $parent }) {
      clientMutationId
      theme {
        id
      }
    }
  }
`;

export const CreateTheme = gql`
  mutation CreateTheme($text: String!, $parent: ID!) {
    unstructuredTheme(input: { text: $text, parent: $parent }) {
      clientMutationId
      theme {
        id
        text
      }
    }
  }
`;
