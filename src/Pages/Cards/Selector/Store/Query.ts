import { gql } from '@apollo/client';

export const CREATE_NEW_CARD = gql`
  mutation CREATE_NEW_CARD {
    card(
      input: {
        cardContentType: "0"
        isCardUseMainContent: true
        isCardUseMainText: true
        title: "Название карточки по умолчанию"
        createdBy: 0
        text: "Описание карточки"
      }
    ) {
      errors {
        field
      }
      card {
        id
      }
    }
  }
`;
