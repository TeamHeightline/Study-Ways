export interface ICardByID {
    id: number
    title: string
    text: string
    video_url: string
    vk_video_url: string
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
    // не используются
    arrow_before: any
    arrow_down: any
    arrow_next: any
    arrow_up: any
    //
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
    cards_cardimage: CardsCardimage
}

export interface CardsCardConnectedTheme {
    unstructuredtheme_id: number
}

export interface CardsCardimage {
    id: number
    image: string
    card_id: number
}


export interface ICardDataInStore extends ICardByID {
    connectedTheme: number[]
}