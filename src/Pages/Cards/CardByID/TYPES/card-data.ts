export interface ICardData {
    id: number
    title: string
    text: string
    video_url: string
    site_url: string
    created_by_id: number
    additional_text: string
    card_content_type: number
    is_card_use_additional_text: boolean
    is_card_use_main_content: boolean
    is_card_use_main_text: boolean
    is_card_use_test_before_card: boolean
    is_card_use_test_in_card: boolean
    test_before_card_id: number
    test_in_card_id: number
    arrow_before: any
    arrow_down: any
    arrow_next: any
    arrow_up: any
    copyright: string
    is_card_use_copyright: boolean
    is_card_use_arrow_navigation: boolean
    hard_level: number
    card_before_id: number
    card_down_id: number
    card_next_id: number
    card_up_id: number
    tag_field: string
    cards_card_connected_theme: CardsCardConnectedTheme[]
    cards_card_author: any[]
}

export interface CardsCardConnectedTheme {
    id: number
    card_id: number
    unstructuredtheme_id: number
    cards_unstructuredtheme: CardsUnstructuredtheme
}

export interface CardsUnstructuredtheme {
    id: number
    text: string
    created_by_id: number
    parent_id: number
}
