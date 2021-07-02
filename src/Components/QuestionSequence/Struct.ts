import {gql} from "graphql.macro";

export const one_question_struct = {
    question_id: null, //ID вопроса

}

export const question_sequence_struct = {
    settings: {
        can_switch_pages: true,//может ли пользователь сам переключаться между вопросами
        use_random_position_for_questions: true, //Перемешивать ли все вопросы в серии вопросов
        show_help_text: true,//Показывать подсказки или нет
        need_await_full_true_answers: false, //Нужно ли ждать пока пользователь ответит все правильно, или можно переключаться дальше
        use_random_position_for_answers: true, //Перемешивать ли ответы
        max_sum_of_attempts: 12, //Максимальное количество попыток
        hard_level: "MEDIUM",// "HARD", "MEDIUM", "EASY"
        card_themes: []//массив айдишников тех тем, на которые этот вопрос
    },
    sequence: [
        one_question_struct,
        one_question_struct,
        one_question_struct
    ]
}

export const CREATE_QUESTION_SEQUENCE = gql`
    mutation CREATE_QUESTION_SEQUENCE($sequenceData: GenericScalar!){
        createQuestionSequence(input: {sequenceData: $sequenceData,}){
            clientMutationId
        }
    }`

export const GET_MY_QUESTION_SEQUENCE = gql`
    query GET_MY_QUESTION_SEQUENCE{
        me{
            questionsequenceSet{
                sequenceData
                id
                name
            }
        }
    }`