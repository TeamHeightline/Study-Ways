import { gql } from "@apollo/client";

export const GET_CARD_DATA_BY_ID = gql`
  query GET_CARD_DATA_BY_ID($id: ID!) {
    cardById(id: $id) {
      id
      text
      connectedTheme {
        id
      }
      additionalText
      author {
        id
      }
      cardContentType
      copyright
      hardLevel
      isCardUseAdditionalText
      isCardUseArrowNavigation
      isCardUseCopyright
      isCardUseMainContent
      isCardUseMainText
      isCardUseTestBeforeCard
      isCardUseTestInCard
      siteUrl
      testBeforeCard {
        id
      }
      testInCard {
        id
      }
      text
      title
      videoUrl
      cardBefore {
        id
      }
      cardDown {
        id
      }
      cardNext {
        id
      }
      cardUp {
        id
      }
      tagField
    }
  }
`;

export const GET_MY_CARD_AUTHOR = gql`
  query GET_MY_CARD_AUTHOR {
    me {
      cardauthorSet {
        id
        name
      }
    }
  }
`;

export const GET_CONNECTED_THEMES = gql`
  query GET_CONNECTED_THEMES {
    unstructuredTheme {
      id
      text
      parent {
        id
      }
    }
  }
`;

export const GET_QUESTION_TEXT_BY_ID = gql`
  query GET_QUESTION_TEXT_BY_ID($id: ID!) {
    questionById(id: $id) {
      id
      text
    }
  }
`;

export const GET_QUESTION_TEXT_BY_ID2 = gql`
  query GET_QUESTION_TEXT_BY_ID2($id: ID!) {
    questionText(id: $id) {
      id
      text
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UPDATE_CARD(
    $id: ID
    $author: [ID]
    $additionalText: String
    $cardContentType: String!
    $title: String!
    $text: String
    $videoUrl: String
    $testInCard: ID
    $testBeforeCard: ID
    $siteUrl: String
    $isCardUseAdditionalText: Boolean
    $isCardUseMainContent: Boolean
    $isCardUseMainText: Boolean
    $isCardUseTestBeforeCard: Boolean
    $isCardUseTestInCard: Boolean
    $isCardUseCopyright: Boolean
    $copyright: String
    $isCardUseArrowNavigation: Boolean
    $hardLevel: String
    $cardBefore: ID
    $cardDown: ID
    $cardNext: ID
    $cardUp: ID
    $tagField: String
    $connectedTheme: [ID]
  ) {
    card(
      input: {
        id: $id
        author: $author
        additionalText: $additionalText
        cardContentType: $cardContentType
        createdBy: 0
        title: $title
        text: $text
        videoUrl: $videoUrl
        testInCard: $testInCard
        testBeforeCard: $testBeforeCard
        siteUrl: $siteUrl
        isCardUseAdditionalText: $isCardUseAdditionalText
        isCardUseMainContent: $isCardUseMainContent
        isCardUseMainText: $isCardUseMainText
        isCardUseTestBeforeCard: $isCardUseTestBeforeCard
        isCardUseTestInCard: $isCardUseTestInCard
        isCardUseCopyright: $isCardUseCopyright
        copyright: $copyright
        isCardUseArrowNavigation: $isCardUseArrowNavigation
        hardLevel: $hardLevel
        cardBefore: $cardBefore
        cardDown: $cardDown
        cardNext: $cardNext
        cardUp: $cardUp
        tagField: $tagField
        connectedTheme: $connectedTheme
      }
    ) {
      errors {
        field
        messages
      }
      card {
        id
        text
        connectedTheme {
          id
        }
        additionalText
        author {
          id
        }
        cardContentType
        copyright
        hardLevel
        isCardUseAdditionalText
        isCardUseArrowNavigation
        isCardUseCopyright
        isCardUseMainContent
        isCardUseMainText
        isCardUseTestBeforeCard
        isCardUseTestInCard
        siteUrl
        testBeforeCard {
          id
        }
        testInCard {
          id
        }
        text
        title
        videoUrl
        cardBefore {
          id
          text
        }
        cardDown {
          id
        }
        cardNext {
          id
        }
        cardUp {
          id
        }
        tagField
      }
    }
  }
`;
