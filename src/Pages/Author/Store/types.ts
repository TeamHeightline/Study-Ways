export interface AuthorData {
    id: number
    password: string
    last_login: any
    is_superuser: boolean
    username: string
    first_name: string
    last_name: string
    is_staff: boolean
    is_active: boolean
    date_joined: string
    email: string
    user_access_level: string
    users_userprofile: UsersUserprofile
    cards_card: CardsCard[]
    usertests_question: UsertestsQuestion[]
    cards_cardcourse: CardsCardcourse[]
}

export interface UsersUserprofile {
    user_id: number
    firstname: string
    lastname: string
    avatar_src: string
    study_in_id: number
    group: any
}

export interface CardsCard {
    id: number
}

export interface UsertestsQuestion {
    id: number
}

export interface CardsCardcourse {
    id: number
}
