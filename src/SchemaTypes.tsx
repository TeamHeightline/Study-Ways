export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /**
     * The `DateTime` scalar type represents a DateTime
     * value as specified by
     * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
     */
    DateTime: any;
    /**
     * The `GenericScalar` scalar type represents a generic
     * GraphQL scalar value that could be:
     * String, Boolean, Int, Float, List or Object.
     */
    GenericScalar: any;
};

/** An object with an ID */
export type Node = {
    /** The ID of the object. */
    id: Scalars['ID'];
};

export type AiSearchCardIdArray = {
    __typename?: 'AISearchCardIDArray';
    IDs?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AddCardToBookmark = {
    __typename?: 'AddCardToBookmark';
    ok?: Maybe<Scalars['Boolean']>;
};

export type AnswerMutationPayload = {
    __typename?: 'AnswerMutationPayload';
    answer?: Maybe<AnswerNode>;
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
};

export type AnswerNode = {
    __typename?: 'AnswerNode';
    checkQueue: Scalars['Int'];
    hardLevelOfAnswer: AnswerHardLevelOfAnswer;
    helpTextv1?: Maybe<Scalars['String']>;
    helpTextv2?: Maybe<Scalars['String']>;
    helpTextv3?: Maybe<Scalars['String']>;
    id: Scalars['ID'];
    isDeleted: Scalars['Boolean'];
    isImageDeleted: Scalars['Boolean'];
    isInvisible: Scalars['Boolean'];
    isRequired: Scalars['Boolean'];
    isTrue: Scalars['Boolean'];
    onlyForExam: Scalars['Boolean'];
    question: QuestionNode;
    text: Scalars['String'];
    videoUrl?: Maybe<Scalars['String']>;
};

export type CardAuthorMutationPayload = {
    __typename?: 'CardAuthorMutationPayload';
    cardAuthor?: Maybe<CardAuthorNode>;
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
};

export type CardAuthorNode = {
    __typename?: 'CardAuthorNode';
    cardSet: Array<CardNode>;
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type CardCourseNode = {
    __typename?: 'CardCourseNode';
    courseData?: Maybe<Scalars['GenericScalar']>;
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
};

export type CardDetailView = {
    __typename?: 'CardDetailView';
    ok?: Maybe<Scalars['Boolean']>;
};

export type CardIdResolverForSelector = {
    __typename?: 'CardIDResolverForSelector';
    IDs?: Maybe<Array<Maybe<Scalars['String']>>>;
    activePage?: Maybe<Scalars['Int']>;
    numPages?: Maybe<Scalars['Int']>;
};

export type CardMutationPayload = {
    __typename?: 'CardMutationPayload';
    card?: Maybe<CardNode>;
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
};

export type CardNode = {
    __typename?: 'CardNode';
    additionalText?: Maybe<Scalars['String']>;
    arrowBefore?: Maybe<Scalars['String']>;
    arrowDown?: Maybe<Scalars['String']>;
    arrowNext?: Maybe<Scalars['String']>;
    arrowUp?: Maybe<Scalars['String']>;
    author: Array<CardAuthorNode>;
    cardBefore?: Maybe<CardNode>;
    cardContentType: CardCardContentType;
    cardDown?: Maybe<CardNode>;
    cardNext?: Maybe<CardNode>;
    cardUp?: Maybe<CardNode>;
    connectedTheme: Array<UnstructuredThemesNode>;
    copyright?: Maybe<Scalars['String']>;
    hardLevel: CardHardLevel;
    id: Scalars['ID'];
    isBookmarked?: Maybe<Scalars['Boolean']>;
    isCardUseAdditionalText: Scalars['Boolean'];
    isCardUseArrowNavigation: Scalars['Boolean'];
    isCardUseCopyright: Scalars['Boolean'];
    isCardUseMainContent: Scalars['Boolean'];
    isCardUseMainText: Scalars['Boolean'];
    isCardUseTestBeforeCard: Scalars['Boolean'];
    isCardUseTestInCard: Scalars['Boolean'];
    isExistRating?: Maybe<Scalars['Boolean']>;
    rating?: Maybe<Scalars['Float']>;
    siteUrl?: Maybe<Scalars['String']>;
    subTheme: Array<CardSubThemeNode>;
    tagField?: Maybe<Scalars['String']>;
    testBeforeCard?: Maybe<QuestionNode>;
    testInCard?: Maybe<QuestionNode>;
    text?: Maybe<Scalars['String']>;
    title: Scalars['String'];
    videoUrl?: Maybe<Scalars['String']>;
};

export type CardSubThemeMutationPayload = {
    __typename?: 'CardSubThemeMutationPayload';
    cardSubTheme?: Maybe<CardSubThemeNode>;
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
};

export type CardSubThemeNode = {
    __typename?: 'CardSubThemeNode';
    cardSet: Array<CardNode>;
    id: Scalars['ID'];
    name: Scalars['String'];
    theme?: Maybe<CardThemeNode>;
};

export type CardThemeMutationPayload = {
    __typename?: 'CardThemeMutationPayload';
    cardTheme?: Maybe<CardThemeNode>;
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
};

export type CardThemeNode = {
    __typename?: 'CardThemeNode';
    cardsubthemeSet: Array<CardSubThemeNode>;
    globalTheme?: Maybe<GlobalCardThemeNode>;
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type CopyQuestionWithAnswers = {
    __typename?: 'CopyQuestionWithAnswers';
    newQuestionId?: Maybe<Scalars['ID']>;
    ok?: Maybe<Scalars['Boolean']>;
};

export type CreateCardCoursePayload = {
    __typename?: 'CreateCardCoursePayload';
    clientMutationId?: Maybe<Scalars['String']>;
    course?: Maybe<CardCourseNode>;
};

export type CreateDetailQuestionStatisticPayload = {
    __typename?: 'CreateDetailQuestionStatisticPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    detailStatistic?: Maybe<DetailQuestionStatisticNode>;
};

export type CreateQuestionSequencePayload = {
    __typename?: 'CreateQuestionSequencePayload';
    clientMutationId?: Maybe<Scalars['String']>;
    sequence?: Maybe<QuestionSequenceNode>;
};

export type CreateUsThemeSequencePayload = {
    __typename?: 'CreateUSThemeSequencePayload';
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
    uSThemeSequence?: Maybe<UsThemeSequenceNode>;
};

export type DetailArrayNames = {
    __typename?: 'DetailArrayNames';
    names?: Maybe<Scalars['String']>;
};

export type DetailQuestionStatisticNode = {
    __typename?: 'DetailQuestionStatisticNode';
    createdAt?: Maybe<Scalars['DateTime']>;
    id: Scalars['ID'];
    isLogin: Scalars['Boolean'];
    isUseexammode: Scalars['Boolean'];
    maxSumOfAnswersPoint?: Maybe<Scalars['Int']>;
    question?: Maybe<QuestionNode>;
    questionHasBeenCompleted: Scalars['Boolean'];
    questionSequence?: Maybe<QuestionSequenceNode>;
    statistic?: Maybe<Scalars['GenericScalar']>;
    userName?: Maybe<Scalars['String']>;
};

export type DetailStatIdArray = {
    __typename?: 'DetailStatIDArray';
    IDs?: Maybe<Array<Maybe<Scalars['String']>>>;
    activePage?: Maybe<Scalars['Int']>;
    numPages?: Maybe<Scalars['Int']>;
};

export type EqbidNode = {
    __typename?: 'EQBIDNode';
    abs?: Maybe<Scalars['String']>;
    qbs?: Maybe<Scalars['String']>;
};

export type ErrorType = {
    __typename?: 'ErrorType';
    field: Scalars['String'];
    messages: Array<Scalars['String']>;
};

export type GlobalCardThemeMutationPayload = {
    __typename?: 'GlobalCardThemeMutationPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
    globalCardTheme?: Maybe<GlobalCardThemeNode>;
};

export type GlobalCardThemeNode = {
    __typename?: 'GlobalCardThemeNode';
    cardthemeSet: Array<CardThemeNode>;
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type HomePageCardIdArray = {
    __typename?: 'HomePageCardIDArray';
    IDs?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Mutation = {
    __typename?: 'Mutation';
    addCardToBookmark?: Maybe<AddCardToBookmark>;
    card?: Maybe<CardMutationPayload>;
    cardAuthor?: Maybe<CardAuthorMutationPayload>;
    cardDetailView?: Maybe<CardDetailView>;
    cardSubTheme?: Maybe<CardSubThemeMutationPayload>;
    cardTheme?: Maybe<CardThemeMutationPayload>;
    copyQuestionWithAnswers?: Maybe<CopyQuestionWithAnswers>;
    createAnswer?: Maybe<AnswerMutationPayload>;
    createCardCourse?: Maybe<CreateCardCoursePayload>;
    createDetailQuestionStatistic?: Maybe<CreateDetailQuestionStatisticPayload>;
    createQuestion?: Maybe<QuestionMutationPayload>;
    createQuestionAuthor?: Maybe<QuestionAuthorMutationPayload>;
    createQuestionSequence?: Maybe<CreateQuestionSequencePayload>;
    createQuestionThemes?: Maybe<QuestionThemesMutationPayload>;
    globalCardTheme?: Maybe<GlobalCardThemeMutationPayload>;
    removeCardFromBookmark?: Maybe<RemoveCardFromBookmark>;
    setCardRating?: Maybe<SetCardRating>;
    statistic?: Maybe<StatisticMutationPayload>;
    unstructuredTheme?: Maybe<UnstructuredThemeMutationPayload>;
    updateAnswer?: Maybe<AnswerMutationPayload>;
    updateCardCourse?: Maybe<UpdateCardCoursePayload>;
    updateQuestion?: Maybe<QuestionMutationPayload>;
    updateQuestionAuthor?: Maybe<QuestionAuthorMutationPayload>;
    updateQuestionSequence?: Maybe<UpdateQuestionSequencePayload>;
    updateQuestionThemes?: Maybe<QuestionThemesMutationPayload>;
    updateUnstructuredTheme?: Maybe<UpdateUnstructuredThemePayload>;
    usThemeSequence?: Maybe<CreateUsThemeSequencePayload>;
};


export type MutationAddCardToBookmarkArgs = {
    cardId?: InputMaybe<Scalars['Int']>;
};


export type MutationCardArgs = {
    input: CardMutationInput;
};


export type MutationCardAuthorArgs = {
    input: CardAuthorMutationInput;
};


export type MutationCardDetailViewArgs = {
    cardId?: InputMaybe<Scalars['Int']>;
};


export type MutationCardSubThemeArgs = {
    input: CardSubThemeMutationInput;
};


export type MutationCardThemeArgs = {
    input: CardThemeMutationInput;
};


export type MutationCopyQuestionWithAnswersArgs = {
    questionId?: InputMaybe<Scalars['Int']>;
};


export type MutationCreateAnswerArgs = {
    input: AnswerMutationInput;
};


export type MutationCreateCardCourseArgs = {
    input: CreateCardCourseInput;
};


export type MutationCreateDetailQuestionStatisticArgs = {
    input: CreateDetailQuestionStatisticInput;
};


export type MutationCreateQuestionArgs = {
    input: QuestionMutationInput;
};


export type MutationCreateQuestionAuthorArgs = {
    input: QuestionAuthorMutationInput;
};


export type MutationCreateQuestionSequenceArgs = {
    input: CreateQuestionSequenceInput;
};


export type MutationCreateQuestionThemesArgs = {
    input: QuestionThemesMutationInput;
};


export type MutationGlobalCardThemeArgs = {
    input: GlobalCardThemeMutationInput;
};


export type MutationRemoveCardFromBookmarkArgs = {
    cardId?: InputMaybe<Scalars['Int']>;
};


export type MutationSetCardRatingArgs = {
    cardId?: InputMaybe<Scalars['Int']>;
    rating?: InputMaybe<Scalars['Float']>;
};


export type MutationStatisticArgs = {
    input: StatisticMutationInput;
};


export type MutationUnstructuredThemeArgs = {
    input: UnstructuredThemeMutationInput;
};


export type MutationUpdateAnswerArgs = {
    input: AnswerMutationInput;
};


export type MutationUpdateCardCourseArgs = {
    input: UpdateCardCourseInput;
};


export type MutationUpdateQuestionArgs = {
    input: QuestionMutationInput;
};


export type MutationUpdateQuestionAuthorArgs = {
    input: QuestionAuthorMutationInput;
};


export type MutationUpdateQuestionSequenceArgs = {
    input: UpdateQuestionSequenceInput;
};


export type MutationUpdateQuestionThemesArgs = {
    input: QuestionThemesMutationInput;
};


export type MutationUpdateUnstructuredThemeArgs = {
    input: UpdateUnstructuredThemeInput;
};


export type MutationUsThemeSequenceArgs = {
    input: CreateUsThemeSequenceInput;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
    __typename?: 'PageInfo';
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars['String']>;
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars['Boolean'];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars['Boolean'];
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
    __typename?: 'Query';
    aiCardSearch?: Maybe<AiSearchCardIdArray>;
    answer?: Maybe<Array<Maybe<AnswerNode>>>;
    answerById?: Maybe<AnswerNode>;
    answersInRandomPositions?: Maybe<Array<Maybe<AnswerNode>>>;
    card?: Maybe<Array<Maybe<CardNode>>>;
    cardAuthor?: Maybe<Array<Maybe<CardAuthorNode>>>;
    cardById?: Maybe<CardNode>;
    cardCourse?: Maybe<Array<Maybe<CardCourseNode>>>;
    cardCourseById?: Maybe<CardCourseNode>;
    cardGlobalTheme?: Maybe<Array<Maybe<GlobalCardThemeNode>>>;
    cardIdResolverForSelector?: Maybe<CardIdResolverForSelector>;
    cardSubTheme?: Maybe<Array<Maybe<CardSubThemeNode>>>;
    cardTheme?: Maybe<Array<Maybe<CardThemeNode>>>;
    detailArrayNames?: Maybe<DetailArrayNames>;
    detailQuestionStatistic?: Maybe<Array<Maybe<DetailQuestionStatisticNode>>>;
    detailQuestionStatisticByQuestionId?: Maybe<Array<Maybe<DetailQuestionStatisticNode>>>;
    detailStatIdArray?: Maybe<DetailStatIdArray>;
    detailStatisticById?: Maybe<DetailQuestionStatisticNode>;
    eqbi?: Maybe<EqbidNode>;
    ftSearchInCards?: Maybe<Array<Maybe<CardNode>>>;
    me?: Maybe<UserNode>;
    personalCardHomePage?: Maybe<HomePageCardIdArray>;
    question?: Maybe<Array<Maybe<QuestionNode>>>;
    questionAuthor?: Maybe<Array<Maybe<QuestionAuthorNode>>>;
    questionById?: Maybe<QuestionNode>;
    questionSequence?: Maybe<Array<Maybe<QuestionSequenceNode>>>;
    questionSequenceById?: Maybe<QuestionSequenceNode>;
    questionText?: Maybe<QuestionText>;
    questionThemes?: Maybe<Array<Maybe<QuestionThemesNode>>>;
    selfStatisticIdArray?: Maybe<SelfStatisticIdArray>;
    themeAncestors?: Maybe<Array<Maybe<UnstructuredThemesNode>>>;
    unstructuredTheme?: Maybe<Array<Maybe<UnstructuredThemesNode>>>;
    usThemeSequence?: Maybe<UsThemeSequenceNode>;
    /** The ID of the object */
    user?: Maybe<UserNode>;
    users?: Maybe<UserNodeConnection>;
};


export type QueryAiCardSearchArgs = {
    searchString?: InputMaybe<Scalars['String']>;
};


export type QueryAnswerByIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryCardByIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryCardCourseByIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryCardIdResolverForSelectorArgs = {
    activePage?: InputMaybe<Scalars['Int']>;
    cardAuthor?: InputMaybe<Scalars['ID']>;
    cardHardLevel?: InputMaybe<Scalars['Int']>;
    cardType?: InputMaybe<Scalars['Int']>;
    connectedTheme?: InputMaybe<Scalars['String']>;
    createdByMe?: InputMaybe<Scalars['Boolean']>;
    smartSearchString?: InputMaybe<Scalars['String']>;
};


export type QueryDetailQuestionStatisticByQuestionIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryDetailStatIdArrayArgs = {
    afterTime?: InputMaybe<Scalars['DateTime']>;
    onlyInExam?: InputMaybe<Scalars['Boolean']>;
    onlyInQs?: InputMaybe<Scalars['Boolean']>;
    page?: InputMaybe<Scalars['Int']>;
    questions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
    userName?: InputMaybe<Scalars['String']>;
};


export type QueryDetailStatisticByIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryEqbiArgs = {
    examMode?: InputMaybe<Scalars['Boolean']>;
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryFtSearchInCardsArgs = {
    searchString?: InputMaybe<Scalars['String']>;
};


export type QueryQuestionByIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryQuestionSequenceByIdArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QueryQuestionTextArgs = {
    id?: InputMaybe<Scalars['ID']>;
};


export type QuerySelfStatisticIdArrayArgs = {
    page?: InputMaybe<Scalars['Int']>;
};


export type QueryThemeAncestorsArgs = {
    themeId?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
    id: Scalars['ID'];
};


export type QueryUsersArgs = {
    after?: InputMaybe<Scalars['String']>;
    before?: InputMaybe<Scalars['String']>;
    email?: InputMaybe<Scalars['String']>;
    first?: InputMaybe<Scalars['Int']>;
    isActive?: InputMaybe<Scalars['Boolean']>;
    last?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    status_Archived?: InputMaybe<Scalars['Boolean']>;
    status_SecondaryEmail?: InputMaybe<Scalars['String']>;
    status_Verified?: InputMaybe<Scalars['Boolean']>;
    username?: InputMaybe<Scalars['String']>;
    username_Icontains?: InputMaybe<Scalars['String']>;
    username_Istartswith?: InputMaybe<Scalars['String']>;
};

export type QuestionAuthorMutationPayload = {
    __typename?: 'QuestionAuthorMutationPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
    questionAuthor?: Maybe<QuestionAuthorNode>;
};

export type QuestionAuthorNode = {
    __typename?: 'QuestionAuthorNode';
    id: Scalars['ID'];
    name: Scalars['String'];
    questionAuthors: Array<QuestionNode>;
};

export type QuestionMutationPayload = {
    __typename?: 'QuestionMutationPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
    question?: Maybe<QuestionNode>;
};

export type QuestionNode = {
    __typename?: 'QuestionNode';
    answers: Array<AnswerNode>;
    author: Array<QuestionAuthorNode>;
    cardTestBeforeCardSet: Array<CardNode>;
    cardTestInCardSet: Array<CardNode>;
    detailquestionstatisticSet: Array<DetailQuestionStatisticNode>;
    id: Scalars['ID'];
    isImageQuestion: Scalars['Boolean'];
    numberOfShowingAnswers: Scalars['Int'];
    questionstatistic?: Maybe<QuestionStatisticNode>;
    text: Scalars['String'];
    theme: Array<QuestionThemesNode>;
    videoUrl?: Maybe<Scalars['String']>;
};

export type QuestionSequenceNode = {
    __typename?: 'QuestionSequenceNode';
    description?: Maybe<Scalars['String']>;
    detailquestionstatisticSet: Array<DetailQuestionStatisticNode>;
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    sequenceData?: Maybe<Scalars['GenericScalar']>;
};

export type QuestionStatisticNode = {
    __typename?: 'QuestionStatisticNode';
    id: Scalars['ID'];
    numberOfPasses: Scalars['Int'];
    question?: Maybe<QuestionNode>;
    sumOfAllAttempts: Scalars['Int'];
};

export type QuestionText = {
    __typename?: 'QuestionText';
    id?: Maybe<Scalars['ID']>;
    text?: Maybe<Scalars['String']>;
};

export type QuestionThemesMutationPayload = {
    __typename?: 'QuestionThemesMutationPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
    questionThemes?: Maybe<QuestionThemesNode>;
};

export type QuestionThemesNode = {
    __typename?: 'QuestionThemesNode';
    description?: Maybe<Scalars['String']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    questionThemes: Array<QuestionNode>;
};

export type RemoveCardFromBookmark = {
    __typename?: 'RemoveCardFromBookmark';
    ok?: Maybe<Scalars['Boolean']>;
};

export type SelfStatisticIdArray = {
    __typename?: 'SelfStatisticIDArray';
    IDs?: Maybe<Array<Maybe<Scalars['String']>>>;
    activePage?: Maybe<Scalars['Int']>;
    numPages?: Maybe<Scalars['Int']>;
};

export type SetCardRating = {
    __typename?: 'SetCardRating';
    ok?: Maybe<Scalars['Boolean']>;
};

export type StatisticMutationPayload = {
    __typename?: 'StatisticMutationPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    errors?: Maybe<Array<Maybe<ErrorType>>>;
    questionStatistic?: Maybe<QuestionStatisticNode>;
    statistic?: Maybe<QuestionStatisticNode>;
};

export type UsThemeSequenceNode = {
    __typename?: 'USThemeSequenceNode';
    id: Scalars['ID'];
    sequence: Scalars['String'];
};

export type UnstructuredThemeMutationPayload = {
    __typename?: 'UnstructuredThemeMutationPayload';
    clientMutationId?: Maybe<Scalars['String']>;
    theme?: Maybe<UnstructuredThemesNode>;
};

export type UnstructuredThemesNode = {
    __typename?: 'UnstructuredThemesNode';
    cardSet: Array<CardNode>;
    childrenSet: Array<UnstructuredThemesNode>;
    id: Scalars['ID'];
    parent?: Maybe<UnstructuredThemesNode>;
    text: Scalars['String'];
};

export type UpdateCardCoursePayload = {
    __typename?: 'UpdateCardCoursePayload';
    clientMutationId?: Maybe<Scalars['String']>;
    course?: Maybe<CardCourseNode>;
};

export type UpdateQuestionSequencePayload = {
    __typename?: 'UpdateQuestionSequencePayload';
    clientMutationId?: Maybe<Scalars['String']>;
    sequence?: Maybe<QuestionSequenceNode>;
};

export type UpdateUnstructuredThemePayload = {
    __typename?: 'UpdateUnstructuredThemePayload';
    clientMutationId?: Maybe<Scalars['String']>;
    theme?: Maybe<UnstructuredThemesNode>;
};

export type UserNode = Node & {
    __typename?: 'UserNode';
    answerSet: Array<AnswerNode>;
    archived?: Maybe<Scalars['Boolean']>;
    cardSet: Array<CardNode>;
    cardauthorSet: Array<CardAuthorNode>;
    cardcourseSet: Array<CardCourseNode>;
    cardsubthemeSet: Array<CardSubThemeNode>;
    cardthemeSet: Array<CardThemeNode>;
    dateJoined: Scalars['DateTime'];
    detailquestionstatisticSet: Array<DetailQuestionStatisticNode>;
    email: Scalars['String'];
    firstName: Scalars['String'];
    globalcardthemeSet: Array<GlobalCardThemeNode>;
    /** The ID of the object. */
    id: Scalars['ID'];
    /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
    isActive: Scalars['Boolean'];
    /** Designates whether the user can log into this admin site. */
    isStaff: Scalars['Boolean'];
    lastLogin?: Maybe<Scalars['DateTime']>;
    lastName: Scalars['String'];
    pk?: Maybe<Scalars['Int']>;
    questionSet: Array<QuestionNode>;
    questionauthorSet: Array<QuestionAuthorNode>;
    questionsequenceSet: Array<QuestionSequenceNode>;
    questionthemesSet: Array<QuestionThemesNode>;
    secondaryEmail?: Maybe<Scalars['String']>;
    unstructuredthemeSet: Array<UnstructuredThemesNode>;
    userAccessLevel: CustomUserUserAccessLevel;
    /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
    username: Scalars['String'];
    usthemesequenceSet: Array<UsThemeSequenceNode>;
    verified?: Maybe<Scalars['Boolean']>;
};

export type UserNodeConnection = {
    __typename?: 'UserNodeConnection';
    /** Contains the nodes in this connection. */
    edges: Array<Maybe<UserNodeEdge>>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
};

/** A Relay edge containing a `UserNode` and its cursor. */
export type UserNodeEdge = {
    __typename?: 'UserNodeEdge';
    /** A cursor for use in pagination */
    cursor: Scalars['String'];
    /** The item at the end of the edge */
    node?: Maybe<UserNode>;
};

/** An enumeration. */
export enum AnswerHardLevelOfAnswer {
    /** Очевидный */
    Easy = 'EASY',
    /** Каверзный */
    Hard = 'HARD',
    /** Обычный */
    Medium = 'MEDIUM'
}

/** An enumeration. */
export enum CardCardContentType {
    /** youtube видео */
    A_0 = 'A_0',
    /** ссылка на внешний ресурс */
    A_1 = 'A_1',
    /** просто изображение */
    A_2 = 'A_2'
}

/** An enumeration. */
export enum CardHardLevel {
    /** Выпускникам школ */
    A_0 = 'A_0',
    /** Успешным лицеистам и гимназистам */
    A_1 = 'A_1',
    /** Рядовым студентам */
    A_2 = 'A_2',
    /** Будущим специалистам */
    A_3 = 'A_3',
    /** Специалистам (Real Science) */
    A_4 = 'A_4'
}

/** An enumeration. */
export enum CustomUserUserAccessLevel {
    /** Admin */
    Admin = 'ADMIN',
    /** Student */
    Student = 'STUDENT',
    /** Teacher */
    Teacher = 'TEACHER'
}

export type AnswerMutationInput = {
    checkQueue: Scalars['Int'];
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    hardLevelOfAnswer: Scalars['String'];
    helpTextv1?: InputMaybe<Scalars['String']>;
    helpTextv2?: InputMaybe<Scalars['String']>;
    helpTextv3?: InputMaybe<Scalars['String']>;
    id?: InputMaybe<Scalars['ID']>;
    isDeleted?: InputMaybe<Scalars['Boolean']>;
    isImageDeleted?: InputMaybe<Scalars['Boolean']>;
    isInvisible?: InputMaybe<Scalars['Boolean']>;
    isRequired?: InputMaybe<Scalars['Boolean']>;
    isTrue?: InputMaybe<Scalars['Boolean']>;
    onlyForExam?: InputMaybe<Scalars['Boolean']>;
    question: Scalars['ID'];
    text?: InputMaybe<Scalars['String']>;
    videoUrl?: InputMaybe<Scalars['String']>;
};

export type CardAuthorMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    id?: InputMaybe<Scalars['ID']>;
    name: Scalars['String'];
};

export type CardMutationInput = {
    additionalText?: InputMaybe<Scalars['String']>;
    arrowBefore?: InputMaybe<Scalars['String']>;
    arrowDown?: InputMaybe<Scalars['String']>;
    arrowNext?: InputMaybe<Scalars['String']>;
    arrowUp?: InputMaybe<Scalars['String']>;
    author?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
    cardBefore?: InputMaybe<Scalars['ID']>;
    cardContentType: Scalars['String'];
    cardDown?: InputMaybe<Scalars['ID']>;
    cardNext?: InputMaybe<Scalars['ID']>;
    cardUp?: InputMaybe<Scalars['ID']>;
    clientMutationId?: InputMaybe<Scalars['String']>;
    connectedTheme?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
    copyright?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    hardLevel?: InputMaybe<Scalars['String']>;
    id?: InputMaybe<Scalars['ID']>;
    isCardUseAdditionalText?: InputMaybe<Scalars['Boolean']>;
    isCardUseArrowNavigation?: InputMaybe<Scalars['Boolean']>;
    isCardUseCopyright?: InputMaybe<Scalars['Boolean']>;
    isCardUseMainContent?: InputMaybe<Scalars['Boolean']>;
    isCardUseMainText?: InputMaybe<Scalars['Boolean']>;
    isCardUseTestBeforeCard?: InputMaybe<Scalars['Boolean']>;
    isCardUseTestInCard?: InputMaybe<Scalars['Boolean']>;
    siteUrl?: InputMaybe<Scalars['String']>;
    subTheme?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
    tagField?: InputMaybe<Scalars['String']>;
    testBeforeCard?: InputMaybe<Scalars['ID']>;
    testInCard?: InputMaybe<Scalars['ID']>;
    text?: InputMaybe<Scalars['String']>;
    title: Scalars['String'];
    vectorColumn?: InputMaybe<Scalars['String']>;
    videoUrl?: InputMaybe<Scalars['String']>;
};

export type CardSubThemeMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    id?: InputMaybe<Scalars['ID']>;
    name: Scalars['String'];
    theme?: InputMaybe<Scalars['ID']>;
};

export type CardThemeMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    globalTheme?: InputMaybe<Scalars['ID']>;
    id?: InputMaybe<Scalars['ID']>;
    name: Scalars['String'];
};

export type CreateCardCourseInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    courseData?: InputMaybe<Scalars['GenericScalar']>;
    createdBy?: InputMaybe<Scalars['ID']>;
};

export type CreateDetailQuestionStatisticInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    isLogin?: InputMaybe<Scalars['Boolean']>;
    isUseexammode?: InputMaybe<Scalars['Boolean']>;
    maxSumOfAnswersPoint?: InputMaybe<Scalars['Int']>;
    question: Scalars['ID'];
    questionHasBeenCompleted?: InputMaybe<Scalars['Boolean']>;
    questionSequence?: InputMaybe<Scalars['ID']>;
    statistic?: InputMaybe<Scalars['GenericScalar']>;
    userName?: InputMaybe<Scalars['String']>;
};

export type CreateQuestionSequenceInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy?: InputMaybe<Scalars['ID']>;
    sequenceData?: InputMaybe<Scalars['GenericScalar']>;
};

export type CreateUsThemeSequenceInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    id?: InputMaybe<Scalars['ID']>;
    sequence: Scalars['String'];
};

export type GlobalCardThemeMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    id?: InputMaybe<Scalars['ID']>;
    name: Scalars['String'];
};

export type QuestionAuthorMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    id?: InputMaybe<Scalars['ID']>;
    name: Scalars['String'];
};

export type QuestionMutationInput = {
    author?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    id?: InputMaybe<Scalars['ID']>;
    isImageQuestion?: InputMaybe<Scalars['Boolean']>;
    numberOfShowingAnswers?: InputMaybe<Scalars['Int']>;
    text: Scalars['String'];
    theme?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
    videoUrl?: InputMaybe<Scalars['String']>;
};

export type QuestionThemesMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    createdBy: Scalars['ID'];
    description?: InputMaybe<Scalars['String']>;
    id?: InputMaybe<Scalars['ID']>;
    name: Scalars['String'];
};

export type StatisticMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    id?: InputMaybe<Scalars['ID']>;
    numberOfPasses: Scalars['Int'];
    question: Scalars['ID'];
    sumOfAllAttempts: Scalars['Int'];
};

export type UnstructuredThemeMutationInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    parent?: InputMaybe<Scalars['ID']>;
    text: Scalars['String'];
};

export type UpdateCardCourseInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    courseData?: InputMaybe<Scalars['GenericScalar']>;
    courseId: Scalars['ID'];
    name?: InputMaybe<Scalars['String']>;
};

export type UpdateQuestionSequenceInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    description?: InputMaybe<Scalars['String']>;
    name?: InputMaybe<Scalars['String']>;
    sequenceData?: InputMaybe<Scalars['GenericScalar']>;
    sequenceId: Scalars['ID'];
};

export type UpdateUnstructuredThemeInput = {
    clientMutationId?: InputMaybe<Scalars['String']>;
    id: Scalars['ID'];
    parent?: InputMaybe<Scalars['ID']>;
    text: Scalars['String'];
};
