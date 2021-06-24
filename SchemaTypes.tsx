export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    /**
     * The `GenericScalar` scalar type represents a generic
     * GraphQL scalar value that could be:
     * String, Boolean, Int, Float, List or Object.
     */
    GenericScalar: any
    /**
     * The `DateTime` scalar type represents a DateTime
     * value as specified by
     * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
     */
    DateTime: any
    /**
     * Errors messages and codes mapped to
     * fields or non fields errors.
     * Example:
     * {
     * field_name: [
     * {
     * "message": "error message",
     * "code": "error_code"
     *             }
     * ],
     * other_field: [
     * {
     * "message": "error message",
     * "code": "error_code"
     *             }
     * ],
     * nonFieldErrors: [
     * {
     * "message": "error message",
     * "code": "error_code"
     *             }
     * ]
     * }
     */
    ExpectedErrorType: any
}

/** An object with an ID */
export type Node = {
    /** The ID of the object. */
    id: Scalars["ID"]
}

export type AnswerMutationPayload = {
    __typename?: "AnswerMutationPayload"
    answer?: Maybe<AnswerNode>
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
}

export type AnswerNode = {
    __typename?: "AnswerNode"
    checkQueue: Scalars["Int"]
    hardLevelOfAnswer: AnswerHardLevelOfAnswer
    helpTextv1?: Maybe<Scalars["String"]>
    helpTextv2?: Maybe<Scalars["String"]>
    helpTextv3?: Maybe<Scalars["String"]>
    id: Scalars["ID"]
    isTrue: Scalars["Boolean"]
    question: QuestionNode
    text: Scalars["String"]
    videoUrl?: Maybe<Scalars["String"]>
}

/**
 * Archive account and revoke refresh tokens.
 *
 * User must be verified and confirm password.
 */
export type ArchiveAccount = {
    __typename?: "ArchiveAccount"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

export type CardAuthorMutationPayload = {
    __typename?: "CardAuthorMutationPayload"
    cardAuthor?: Maybe<CardAuthorNode>
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
}

export type CardAuthorNode = {
    __typename?: "CardAuthorNode"
    cardSet: Array<CardNode>
    id: Scalars["ID"]
    name: Scalars["String"]
}

export type CardCourseNode = {
    __typename?: "CardCourseNode"
    courseData?: Maybe<Scalars["GenericScalar"]>
    id: Scalars["ID"]
    name?: Maybe<Scalars["String"]>
}

export type CardMutationPayload = {
    __typename?: "CardMutationPayload"
    card?: Maybe<CardNode>
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
}

export type CardNode = {
    __typename?: "CardNode"
    additionalText?: Maybe<Scalars["String"]>
    author: Array<CardAuthorNode>
    cardContentType: CardCardContentType
    id: Scalars["ID"]
    isCardUseAdditionalText: Scalars["Boolean"]
    isCardUseMainContent: Scalars["Boolean"]
    isCardUseMainText: Scalars["Boolean"]
    isCardUseTestBeforeCard: Scalars["Boolean"]
    isCardUseTestInCard: Scalars["Boolean"]
    siteUrl?: Maybe<Scalars["String"]>
    subTheme: Array<CardSubThemeNode>
    testBeforeCard?: Maybe<QuestionNode>
    testInCard?: Maybe<QuestionNode>
    text?: Maybe<Scalars["String"]>
    title: Scalars["String"]
    videoUrl?: Maybe<Scalars["String"]>
}

export type CardSubThemeMutationPayload = {
    __typename?: "CardSubThemeMutationPayload"
    cardSubTheme?: Maybe<CardSubThemeNode>
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
}

export type CardSubThemeNode = {
    __typename?: "CardSubThemeNode"
    cardSet: Array<CardNode>
    id: Scalars["ID"]
    name: Scalars["String"]
    theme?: Maybe<CardThemeNode>
}

export type CardThemeMutationPayload = {
    __typename?: "CardThemeMutationPayload"
    cardTheme?: Maybe<CardThemeNode>
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
}

export type CardThemeNode = {
    __typename?: "CardThemeNode"
    cardsubthemeSet: Array<CardSubThemeNode>
    globalTheme?: Maybe<GlobalCardThemeNode>
    id: Scalars["ID"]
    name: Scalars["String"]
}

export type CreateCardCoursePayload = {
    __typename?: "CreateCardCoursePayload"
    clientMutationId?: Maybe<Scalars["String"]>
    course?: Maybe<CardCourseNode>
}

/**
 * Delete account permanently or make `user.is_active=False`.
 *
 * The behavior is defined on settings.
 * Anyway user refresh tokens are revoked.
 *
 * User must be verified and confirm password.
 */
export type DeleteAccount = {
    __typename?: "DeleteAccount"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

export type ErrorType = {
    __typename?: "ErrorType"
    field: Scalars["String"]
    messages: Array<Scalars["String"]>
}

export type GlobalCardThemeMutationPayload = {
    __typename?: "GlobalCardThemeMutationPayload"
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
    globalCardTheme?: Maybe<GlobalCardThemeNode>
}

export type GlobalCardThemeNode = {
    __typename?: "GlobalCardThemeNode"
    cardthemeSet: Array<CardThemeNode>
    id: Scalars["ID"]
    name: Scalars["String"]
}

export type Mutation = {
    __typename?: "Mutation"
    /**
     * Archive account and revoke refresh tokens.
     *
     * User must be verified and confirm password.
     */
    archiveAccount?: Maybe<ArchiveAccount>
    card?: Maybe<CardMutationPayload>
    cardAuthor?: Maybe<CardAuthorMutationPayload>
    cardSubTheme?: Maybe<CardSubThemeMutationPayload>
    cardTheme?: Maybe<CardThemeMutationPayload>
    createAnswer?: Maybe<AnswerMutationPayload>
    createCardCourse?: Maybe<CreateCardCoursePayload>
    createQuestion?: Maybe<QuestionMutationPayload>
    createQuestionAuthor?: Maybe<QuestionAuthorMutationPayload>
    createQuestionThemes?: Maybe<QuestionThemesMutationPayload>
    /**
     * Delete account permanently or make `user.is_active=False`.
     *
     * The behavior is defined on settings.
     * Anyway user refresh tokens are revoked.
     *
     * User must be verified and confirm password.
     */
    deleteAccount?: Maybe<DeleteAccount>
    globalCardTheme?: Maybe<GlobalCardThemeMutationPayload>
    /**
     * Change account password when user knows the old password.
     *
     * A new token and refresh token are sent. User must be verified.
     */
    passwordChange?: Maybe<PasswordChange>
    /**
     * Change user password without old password.
     *
     * Receive the token that was sent by email.
     *
     * If token and new passwords are valid, update
     * user password and in case of using refresh
     * tokens, revoke all of them.
     *
     * Also, if user has not been verified yet, verify it.
     */
    passwordReset?: Maybe<PasswordReset>
    /**
     * Set user password - for passwordless registration
     *
     * Receive the token that was sent by email.
     *
     * If token and new passwords are valid, set
     * user password and in case of using refresh
     * tokens, revoke all of them.
     *
     * Also, if user has not been verified yet, verify it.
     */
    passwordSet?: Maybe<PasswordSet>
    /** Same as `grapgql_jwt` implementation, with standard output. */
    refreshToken?: Maybe<RefreshToken>
    /**
     * Register user with fields defined in the settings.
     *
     * If the email field of the user model is part of the
     * registration fields (default), check if there is
     * no user with that email or as a secondary email.
     *
     * If it exists, it does not register the user,
     * even if the email field is not defined as unique
     * (default of the default django user model).
     *
     * When creating the user, it also creates a `UserStatus`
     * related to that user, making it possible to track
     * if the user is archived, verified and has a secondary
     * email.
     *
     * Send account verification email.
     *
     * If allowed to not verified users login, return token.
     */
    register?: Maybe<Register>
    /**
     * Sends activation email.
     *
     * It is called resend because theoretically
     * the first activation email was sent when
     * the user registered.
     *
     * If there is no user with the requested email,
     * a successful response is returned.
     */
    resendActivationEmail?: Maybe<ResendActivationEmail>
    /** Same as `grapgql_jwt` implementation, with standard output. */
    revokeToken?: Maybe<RevokeToken>
    /**
     * Send password reset email.
     *
     * For non verified users, send an activation
     * email instead.
     *
     * Accepts both primary and secondary email.
     *
     * If there is no user with the requested email,
     * a successful response is returned.
     */
    sendPasswordResetEmail?: Maybe<SendPasswordResetEmail>
    /**
     * Send activation to secondary email.
     *
     * User must be verified and confirm password.
     */
    sendSecondaryEmailActivation?: Maybe<SendSecondaryEmailActivation>
    statistic?: Maybe<StatisticMutationPayload>
    /**
     * Swap between primary and secondary emails.
     *
     * Require password confirmation.
     */
    swapEmails?: Maybe<SwapEmails>
    /**
     * Obtain JSON web token for given user.
     *
     * Allow to perform login with different fields,
     * and secondary email if set. The fields are
     * defined on settings.
     *
     * Not verified users can login by default. This
     * can be changes on settings.
     *
     * If user is archived, make it unarchive and
     * return `unarchiving=True` on output.
     */
    tokenAuth?: Maybe<ObtainJsonWebToken>
    /**
     * Update user model fields, defined on settings.
     *
     * User must be verified.
     */
    updateAccount?: Maybe<UpdateAccount>
    updateAnswer?: Maybe<AnswerMutationPayload>
    updateCardCourse?: Maybe<UpdateCardCoursePayload>
    updateQuestion?: Maybe<QuestionMutationPayload>
    updateQuestionAuthor?: Maybe<QuestionAuthorMutationPayload>
    updateQuestionThemes?: Maybe<QuestionThemesMutationPayload>
    /**
     * Verify user account.
     *
     * Receive the token that was sent by email.
     * If the token is valid, make the user verified
     * by making the `user.status.verified` field true.
     */
    verifyAccount?: Maybe<VerifyAccount>
    /**
     * Verify user secondary email.
     *
     * Receive the token that was sent by email.
     * User is already verified when using this mutation.
     *
     * If the token is valid, add the secondary email
     * to `user.status.secondary_email` field.
     *
     * Note that until the secondary email is verified,
     * it has not been saved anywhere beyond the token,
     * so it can still be used to create a new account.
     * After being verified, it will no longer be available.
     */
    verifySecondaryEmail?: Maybe<VerifySecondaryEmail>
    /** Same as `grapgql_jwt` implementation, with standard output. */
    verifyToken?: Maybe<VerifyToken>
}

export type MutationArchiveAccountArgs = {
    password: Scalars["String"]
}

export type MutationCardArgs = {
    input: CardMutationInput
}

export type MutationCardAuthorArgs = {
    input: CardAuthorMutationInput
}

export type MutationCardSubThemeArgs = {
    input: CardSubThemeMutationInput
}

export type MutationCardThemeArgs = {
    input: CardThemeMutationInput
}

export type MutationCreateAnswerArgs = {
    input: AnswerMutationInput
}

export type MutationCreateCardCourseArgs = {
    input: CreateCardCourseInput
}

export type MutationCreateQuestionArgs = {
    input: QuestionMutationInput
}

export type MutationCreateQuestionAuthorArgs = {
    input: QuestionAuthorMutationInput
}

export type MutationCreateQuestionThemesArgs = {
    input: QuestionThemesMutationInput
}

export type MutationDeleteAccountArgs = {
    password: Scalars["String"]
}

export type MutationGlobalCardThemeArgs = {
    input: GlobalCardThemeMutationInput
}

export type MutationPasswordChangeArgs = {
    newPassword1: Scalars["String"]
    newPassword2: Scalars["String"]
    oldPassword: Scalars["String"]
}

export type MutationPasswordResetArgs = {
    newPassword1: Scalars["String"]
    newPassword2: Scalars["String"]
    token: Scalars["String"]
}

export type MutationPasswordSetArgs = {
    newPassword1: Scalars["String"]
    newPassword2: Scalars["String"]
    token: Scalars["String"]
}

export type MutationRefreshTokenArgs = {
    refreshToken: Scalars["String"]
}

export type MutationRegisterArgs = {
    email: Scalars["String"]
    password1: Scalars["String"]
    password2: Scalars["String"]
    username: Scalars["String"]
}

export type MutationResendActivationEmailArgs = {
    email: Scalars["String"]
}

export type MutationRevokeTokenArgs = {
    refreshToken: Scalars["String"]
}

export type MutationSendPasswordResetEmailArgs = {
    email: Scalars["String"]
}

export type MutationSendSecondaryEmailActivationArgs = {
    email: Scalars["String"]
    password: Scalars["String"]
}

export type MutationStatisticArgs = {
    input: StatisticMutationInput
}

export type MutationSwapEmailsArgs = {
    password: Scalars["String"]
}

export type MutationTokenAuthArgs = {
    email?: Maybe<Scalars["String"]>
    password: Scalars["String"]
    username?: Maybe<Scalars["String"]>
}

export type MutationUpdateAccountArgs = {
    firstName?: Maybe<Scalars["String"]>
    lastName?: Maybe<Scalars["String"]>
}

export type MutationUpdateAnswerArgs = {
    input: AnswerMutationInput
}

export type MutationUpdateCardCourseArgs = {
    input: UpdateCardCourseInput
}

export type MutationUpdateQuestionArgs = {
    input: QuestionMutationInput
}

export type MutationUpdateQuestionAuthorArgs = {
    input: QuestionAuthorMutationInput
}

export type MutationUpdateQuestionThemesArgs = {
    input: QuestionThemesMutationInput
}

export type MutationVerifyAccountArgs = {
    token: Scalars["String"]
}

export type MutationVerifySecondaryEmailArgs = {
    token: Scalars["String"]
}

export type MutationVerifyTokenArgs = {
    token: Scalars["String"]
}

/**
 * Obtain JSON web token for given user.
 *
 * Allow to perform login with different fields,
 * and secondary email if set. The fields are
 * defined on settings.
 *
 * Not verified users can login by default. This
 * can be changes on settings.
 *
 * If user is archived, make it unarchive and
 * return `unarchiving=True` on output.
 */
export type ObtainJsonWebToken = {
    __typename?: "ObtainJSONWebToken"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    refreshToken?: Maybe<Scalars["String"]>
    success?: Maybe<Scalars["Boolean"]>
    token?: Maybe<Scalars["String"]>
    unarchiving?: Maybe<Scalars["Boolean"]>
    user?: Maybe<UserNode>
}

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
    __typename?: "PageInfo"
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars["String"]>
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars["Boolean"]
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars["Boolean"]
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars["String"]>
}

/**
 * Change account password when user knows the old password.
 *
 * A new token and refresh token are sent. User must be verified.
 */
export type PasswordChange = {
    __typename?: "PasswordChange"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    refreshToken?: Maybe<Scalars["String"]>
    success?: Maybe<Scalars["Boolean"]>
    token?: Maybe<Scalars["String"]>
}

/**
 * Change user password without old password.
 *
 * Receive the token that was sent by email.
 *
 * If token and new passwords are valid, update
 * user password and in case of using refresh
 * tokens, revoke all of them.
 *
 * Also, if user has not been verified yet, verify it.
 */
export type PasswordReset = {
    __typename?: "PasswordReset"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

/**
 * Set user password - for passwordless registration
 *
 * Receive the token that was sent by email.
 *
 * If token and new passwords are valid, set
 * user password and in case of using refresh
 * tokens, revoke all of them.
 *
 * Also, if user has not been verified yet, verify it.
 */
export type PasswordSet = {
    __typename?: "PasswordSet"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

export type Query = {
    __typename?: "Query"
    answer?: Maybe<Array<Maybe<AnswerNode>>>
    answersInRandomPositions?: Maybe<Array<Maybe<AnswerNode>>>
    card?: Maybe<Array<Maybe<CardNode>>>
    cardAuthor?: Maybe<Array<Maybe<CardAuthorNode>>>
    cardById?: Maybe<CardNode>
    cardCourse?: Maybe<Array<Maybe<CardCourseNode>>>
    cardCourseById?: Maybe<CardCourseNode>
    cardGlobalTheme?: Maybe<Array<Maybe<GlobalCardThemeNode>>>
    cardSubTheme?: Maybe<Array<Maybe<CardSubThemeNode>>>
    cardTheme?: Maybe<Array<Maybe<CardThemeNode>>>
    me?: Maybe<UserNode>
    question?: Maybe<Array<Maybe<QuestionNode>>>
    questionAuthor?: Maybe<Array<Maybe<QuestionAuthorNode>>>
    questionById?: Maybe<QuestionNode>
    questionThemes?: Maybe<Array<Maybe<QuestionThemesNode>>>
    /** The ID of the object */
    user?: Maybe<UserNode>
    users?: Maybe<UserNodeConnection>
}

export type QueryCardByIdArgs = {
    id?: Maybe<Scalars["ID"]>
}

export type QueryCardCourseByIdArgs = {
    id?: Maybe<Scalars["ID"]>
}

export type QueryQuestionByIdArgs = {
    id?: Maybe<Scalars["ID"]>
}

export type QueryUserArgs = {
    id: Scalars["ID"]
}

export type QueryUsersArgs = {
    after?: Maybe<Scalars["String"]>
    before?: Maybe<Scalars["String"]>
    email?: Maybe<Scalars["String"]>
    first?: Maybe<Scalars["Int"]>
    isActive?: Maybe<Scalars["Boolean"]>
    last?: Maybe<Scalars["Int"]>
    offset?: Maybe<Scalars["Int"]>
    status_Archived?: Maybe<Scalars["Boolean"]>
    status_SecondaryEmail?: Maybe<Scalars["String"]>
    status_Verified?: Maybe<Scalars["Boolean"]>
    username?: Maybe<Scalars["String"]>
    username_Icontains?: Maybe<Scalars["String"]>
    username_Istartswith?: Maybe<Scalars["String"]>
}

export type QuestionAuthorMutationPayload = {
    __typename?: "QuestionAuthorMutationPayload"
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
    questionAuthor?: Maybe<QuestionAuthorNode>
}

export type QuestionAuthorNode = {
    __typename?: "QuestionAuthorNode"
    id: Scalars["ID"]
    name: Scalars["String"]
    questionAuthors: Array<QuestionNode>
}

export type QuestionMutationPayload = {
    __typename?: "QuestionMutationPayload"
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
    question?: Maybe<QuestionNode>
}

export type QuestionNode = {
    __typename?: "QuestionNode"
    answers: Array<AnswerNode>
    author: Array<QuestionAuthorNode>
    cardTestBeforeCardSet: Array<CardNode>
    cardTestInCardSet: Array<CardNode>
    id: Scalars["ID"]
    isImageQuestion: Scalars["Boolean"]
    questionstatistic?: Maybe<QuestionStatisticNode>
    text: Scalars["String"]
    theme: Array<QuestionThemesNode>
    videoUrl?: Maybe<Scalars["String"]>
}

export type QuestionStatisticNode = {
    __typename?: "QuestionStatisticNode"
    id: Scalars["ID"]
    numberOfPasses: Scalars["Int"]
    question?: Maybe<QuestionNode>
    sumOfAllAttempts: Scalars["Int"]
}

export type QuestionThemesMutationPayload = {
    __typename?: "QuestionThemesMutationPayload"
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
    questionThemes?: Maybe<QuestionThemesNode>
}

export type QuestionThemesNode = {
    __typename?: "QuestionThemesNode"
    description?: Maybe<Scalars["String"]>
    id: Scalars["ID"]
    name: Scalars["String"]
    questionThemes: Array<QuestionNode>
}

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RefreshToken = {
    __typename?: "RefreshToken"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    payload?: Maybe<Scalars["GenericScalar"]>
    refreshToken?: Maybe<Scalars["String"]>
    success?: Maybe<Scalars["Boolean"]>
    token?: Maybe<Scalars["String"]>
}

/**
 * Register user with fields defined in the settings.
 *
 * If the email field of the user model is part of the
 * registration fields (default), check if there is
 * no user with that email or as a secondary email.
 *
 * If it exists, it does not register the user,
 * even if the email field is not defined as unique
 * (default of the default django user model).
 *
 * When creating the user, it also creates a `UserStatus`
 * related to that user, making it possible to track
 * if the user is archived, verified and has a secondary
 * email.
 *
 * Send account verification email.
 *
 * If allowed to not verified users login, return token.
 */
export type Register = {
    __typename?: "Register"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    refreshToken?: Maybe<Scalars["String"]>
    success?: Maybe<Scalars["Boolean"]>
    token?: Maybe<Scalars["String"]>
}

/**
 * Sends activation email.
 *
 * It is called resend because theoretically
 * the first activation email was sent when
 * the user registered.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type ResendActivationEmail = {
    __typename?: "ResendActivationEmail"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RevokeToken = {
    __typename?: "RevokeToken"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    revoked?: Maybe<Scalars["Int"]>
    success?: Maybe<Scalars["Boolean"]>
}

/**
 * Send password reset email.
 *
 * For non verified users, send an activation
 * email instead.
 *
 * Accepts both primary and secondary email.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type SendPasswordResetEmail = {
    __typename?: "SendPasswordResetEmail"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

/**
 * Send activation to secondary email.
 *
 * User must be verified and confirm password.
 */
export type SendSecondaryEmailActivation = {
    __typename?: "SendSecondaryEmailActivation"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

export type StatisticMutationPayload = {
    __typename?: "StatisticMutationPayload"
    clientMutationId?: Maybe<Scalars["String"]>
    errors?: Maybe<Array<Maybe<ErrorType>>>
    questionStatistic?: Maybe<QuestionStatisticNode>
    statistic?: Maybe<QuestionStatisticNode>
}

/**
 * Swap between primary and secondary emails.
 *
 * Require password confirmation.
 */
export type SwapEmails = {
    __typename?: "SwapEmails"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

/**
 * Update user model fields, defined on settings.
 *
 * User must be verified.
 */
export type UpdateAccount = {
    __typename?: "UpdateAccount"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

export type UpdateCardCoursePayload = {
    __typename?: "UpdateCardCoursePayload"
    clientMutationId?: Maybe<Scalars["String"]>
    course?: Maybe<CardCourseNode>
}

export type UserNode = Node & {
    __typename?: "UserNode"
    answerSet: Array<AnswerNode>
    archived?: Maybe<Scalars["Boolean"]>
    cardSet: Array<CardNode>
    cardauthorSet: Array<CardAuthorNode>
    cardcourseSet: Array<CardCourseNode>
    cardsubthemeSet: Array<CardSubThemeNode>
    cardthemeSet: Array<CardThemeNode>
    dateJoined: Scalars["DateTime"]
    email: Scalars["String"]
    firstName: Scalars["String"]
    globalcardthemeSet: Array<GlobalCardThemeNode>
    /** The ID of the object. */
    id: Scalars["ID"]
    /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
    isActive: Scalars["Boolean"]
    /** Designates whether the user can log into this admin site. */
    isStaff: Scalars["Boolean"]
    lastLogin?: Maybe<Scalars["DateTime"]>
    lastName: Scalars["String"]
    pk?: Maybe<Scalars["Int"]>
    questionSet: Array<QuestionNode>
    questionauthorSet: Array<QuestionAuthorNode>
    questionthemesSet: Array<QuestionThemesNode>
    secondaryEmail?: Maybe<Scalars["String"]>
    userAccessLevel: CustomUserUserAccessLevel
    /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
    username: Scalars["String"]
    verified?: Maybe<Scalars["Boolean"]>
}

export type UserNodeConnection = {
    __typename?: "UserNodeConnection"
    /** Contains the nodes in this connection. */
    edges: Array<Maybe<UserNodeEdge>>
    /** Pagination data for this connection. */
    pageInfo: PageInfo
}

/** A Relay edge containing a `UserNode` and its cursor. */
export type UserNodeEdge = {
    __typename?: "UserNodeEdge"
    /** A cursor for use in pagination */
    cursor: Scalars["String"]
    /** The item at the end of the edge */
    node?: Maybe<UserNode>
}

/**
 * Verify user account.
 *
 * Receive the token that was sent by email.
 * If the token is valid, make the user verified
 * by making the `user.status.verified` field true.
 */
export type VerifyAccount = {
    __typename?: "VerifyAccount"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

/**
 * Verify user secondary email.
 *
 * Receive the token that was sent by email.
 * User is already verified when using this mutation.
 *
 * If the token is valid, add the secondary email
 * to `user.status.secondary_email` field.
 *
 * Note that until the secondary email is verified,
 * it has not been saved anywhere beyond the token,
 * so it can still be used to create a new account.
 * After being verified, it will no longer be available.
 */
export type VerifySecondaryEmail = {
    __typename?: "VerifySecondaryEmail"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    success?: Maybe<Scalars["Boolean"]>
}

/** Same as `grapgql_jwt` implementation, with standard output. */
export type VerifyToken = {
    __typename?: "VerifyToken"
    errors?: Maybe<Scalars["ExpectedErrorType"]>
    payload?: Maybe<Scalars["GenericScalar"]>
    success?: Maybe<Scalars["Boolean"]>
}

/** An enumeration. */
export enum AnswerHardLevelOfAnswer {
    /** Очевидный */
    Easy = "EASY",
    /** Каверзный */
    Hard = "HARD",
    /** Обычный */
    Medium = "MEDIUM"
}

/** An enumeration. */
export enum CardCardContentType {
    /** youtube видео */
    A_0 = "A_0",
    /** ссылка на внешний ресурс */
    A_1 = "A_1",
    /** просто изображение */
    A_2 = "A_2"
}

/** An enumeration. */
export enum CustomUserUserAccessLevel {
    /** Admin */
    Admin = "ADMIN",
    /** Student */
    Student = "STUDENT",
    /** Teacher */
    Teacher = "TEACHER"
}

export type AnswerMutationInput = {
    checkQueue: Scalars["Int"]
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    hardLevelOfAnswer: Scalars["String"]
    helpTextv1?: Maybe<Scalars["String"]>
    helpTextv2?: Maybe<Scalars["String"]>
    helpTextv3?: Maybe<Scalars["String"]>
    id?: Maybe<Scalars["ID"]>
    isTrue?: Maybe<Scalars["Boolean"]>
    question: Scalars["ID"]
    text?: Maybe<Scalars["String"]>
    videoUrl?: Maybe<Scalars["String"]>
}

export type CardAuthorMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    name: Scalars["String"]
}

export type CardMutationInput = {
    additionalText?: Maybe<Scalars["String"]>
    author?: Maybe<Array<Maybe<Scalars["ID"]>>>
    cardContentType: Scalars["String"]
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    isCardUseAdditionalText?: Maybe<Scalars["Boolean"]>
    isCardUseMainContent?: Maybe<Scalars["Boolean"]>
    isCardUseMainText?: Maybe<Scalars["Boolean"]>
    isCardUseTestBeforeCard?: Maybe<Scalars["Boolean"]>
    isCardUseTestInCard?: Maybe<Scalars["Boolean"]>
    siteUrl?: Maybe<Scalars["String"]>
    subTheme?: Maybe<Array<Maybe<Scalars["ID"]>>>
    testBeforeCard?: Maybe<Scalars["ID"]>
    testInCard?: Maybe<Scalars["ID"]>
    text?: Maybe<Scalars["String"]>
    title: Scalars["String"]
    videoUrl?: Maybe<Scalars["String"]>
}

export type CardSubThemeMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    name: Scalars["String"]
    theme: Scalars["ID"]
}

export type CardThemeMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    globalTheme: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    name: Scalars["String"]
}

export type CreateCardCourseInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    courseData?: Maybe<Scalars["GenericScalar"]>
    createdBy?: Maybe<Scalars["ID"]>
}

export type GlobalCardThemeMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    name: Scalars["String"]
}

export type QuestionAuthorMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    name: Scalars["String"]
}

export type QuestionMutationInput = {
    author: Array<Maybe<Scalars["ID"]>>
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    id?: Maybe<Scalars["ID"]>
    isImageQuestion?: Maybe<Scalars["Boolean"]>
    text: Scalars["String"]
    theme: Array<Maybe<Scalars["ID"]>>
    videoUrl?: Maybe<Scalars["String"]>
}

export type QuestionThemesMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    createdBy: Scalars["ID"]
    description?: Maybe<Scalars["String"]>
    id?: Maybe<Scalars["ID"]>
    name: Scalars["String"]
}

export type StatisticMutationInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    id?: Maybe<Scalars["ID"]>
    numberOfPasses: Scalars["Int"]
    question: Scalars["ID"]
    sumOfAllAttempts: Scalars["Int"]
}

export type UpdateCardCourseInput = {
    clientMutationId?: Maybe<Scalars["String"]>
    courseData?: Maybe<Scalars["GenericScalar"]>
    courseId: Scalars["ID"]
    name?: Maybe<Scalars["String"]>
}

export type All_Card_ThemesQueryVariables = Exact<{ [key: string]: never }>

export type All_Card_ThemesQuery = { __typename?: "Query" } & {
    cardGlobalTheme?: Maybe<
        Array<
            Maybe<
                { __typename?: "GlobalCardThemeNode" } & Pick<
                GlobalCardThemeNode,
                "id" | "name"
                > & {
                cardthemeSet: Array<
                    { __typename?: "CardThemeNode" } & Pick<
                    CardThemeNode,
                    "id" | "name"
                    > & {
                    cardsubthemeSet: Array<
                        { __typename?: "CardSubThemeNode" } & Pick<
                        CardSubThemeNode,
                        "id" | "name"
                        >
                        >
                }
                    >
            }
                >
            >
        >
}
