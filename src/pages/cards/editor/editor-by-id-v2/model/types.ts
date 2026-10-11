export interface CardFields {
  title: string;
  text: string | null;
  additional_text: string | null;
  video_url: string | null;
  vk_video_url: string | null;
  site_url: string | null;
  card_content_type: number;
  hard_level: number;
  copyright: string | null;
  tag_field: string | null;
  is_card_use_additional_text: boolean;
  is_card_use_main_content: boolean;
  is_card_use_main_text: boolean;
  is_card_use_test_before_card: boolean;
  is_card_use_test_in_card: boolean;
  is_card_use_copyright: boolean;
  test_before_card_id: number | null;
  test_in_card_id: number | null;
}

export interface CardEditorData extends CardFields {
  id: number;
  created_by_id: number;
  cards_card_connected_theme?: { unstructuredtheme_id: number }[];
  cards_cardimage?: { image: string } | null;
}

export interface CardDraft extends CardFields {
  id: number;
  created_by_id: number;
  connectedTheme: number[];
}

export const editableDefaults: CardFields = {
  title: '',
  text: null,
  additional_text: null,
  video_url: null,
  vk_video_url: null,
  site_url: null,
  card_content_type: 0,
  hard_level: 1,
  copyright: null,
  tag_field: null,
  is_card_use_additional_text: false,
  is_card_use_main_content: true,
  is_card_use_main_text: true,
  is_card_use_test_before_card: false,
  is_card_use_test_in_card: false,
  is_card_use_copyright: false,
  test_before_card_id: null,
  test_in_card_id: null,
};

export function toCardDraft(card: CardEditorData): CardDraft {
  const fields = Object.fromEntries(
    Object.keys(editableDefaults).map(key => [
      key,
      card[key as keyof CardFields] ??
        editableDefaults[key as keyof CardFields],
    ]),
  ) as unknown as CardFields;
  return {
    ...fields,
    id: card.id,
    created_by_id: card.created_by_id,
    connectedTheme: [
      ...new Set(
        card.cards_card_connected_theme?.map(
          theme => theme.unstructuredtheme_id,
        ) ?? [],
      ),
    ],
  };
}

export function cardWriteData(draft: CardDraft) {
  const { id, created_by_id, ...data } = draft;
  return data;
}
