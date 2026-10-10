import { AuthorSummary } from '../../../Shared/Authors/types';

export { getAuthorName } from '../../../Shared/Authors/types';

export interface AuthorData extends AuthorSummary {
  date_joined?: string | null;
  cards_card?: { id: number }[] | null;
  usertests_question?: { id: number }[] | null;
  cards_cardcourse?: { id: number }[] | null;
}
