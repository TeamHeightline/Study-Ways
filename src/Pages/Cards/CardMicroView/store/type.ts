export interface CardType {
    id: number;
    title: string;
    text: string;
    video_url: string;
    site_url: string | null;
    created_by_id: number;
    additional_text: string;
    card_content_type: number;
    is_card_use_additional_text: boolean;
    is_card_use_main_content: boolean;
    is_card_use_main_text: boolean;
    is_card_use_test_before_card: boolean;
    is_card_use_test_in_card: boolean;
    test_before_card_id: number | null;
    test_in_card_id: number | null;
    arrow_before: string | null;
    arrow_down: string | null;
    arrow_next: string | null;
    arrow_up: string | null;
    copyright: string | null;
    is_card_use_copyright: boolean;
    is_card_use_arrow_navigation: boolean;
    hard_level: number;
    card_before_id: number | null;
    card_down_id: number | null;
    card_next_id: number | null;
    card_up_id: number | null;
    tag_field: string;
    cards_card_connected_theme: ConnectedTheme[];
    users_customuser: CustomUser;
    cards_cardimage: CardImage | null;
}

interface CardImage {
    id: number;
    image: string;
    card_id: number;
}

interface ConnectedTheme {
    cards_unstructuredtheme: UnstructuredTheme;
}

interface UnstructuredTheme {
    id: number;
    text: string;
    created_by_id: number;
    parent_id: number | null;
}

interface CustomUser {
    users_userprofile: UserProfile;
}

interface UserProfile {
    user_id: number;
    firstname: string;
    lastname: string;
    avatar_src: string;
    study_in_id: number;
}

export type CardHashMap = { [key: string]: CardType };