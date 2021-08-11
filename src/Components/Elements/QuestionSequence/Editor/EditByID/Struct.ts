import {gql} from "graphql.macro";
import {makeStyles} from "@material-ui/core/styles";

export const GET_QUESTION_SEQUENCE_BY_ID = gql`
    query GET_QUESTION_SEQUENCE_BY_ID($id: ID!){
        questionSequenceById(id: $id){
            sequenceData
            name
            id
        }
    }`

export const GET_THEMES = gql`
    query GET_THEMES{
        cardGlobalTheme{
            id
            name
            cardthemeSet{
                id
                name
                cardsubthemeSet{
                    id
                    name
                }
            }
        }
    }`

export const UPDATE_QUESTION_SEQUENCE = gql`
    mutation UPDATE_QUESTION_SEQUENCE($sequenceData: GenericScalar!, $sequenceId: ID!, $name: String!){
        updateQuestionSequence(input: {name: $name, sequenceId: $sequenceId, sequenceData: $sequenceData}){
            clientMutationId
        }
    }`
export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: "170px"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    contentText:{
        // ...theme.typography.button,
        fontSize: "20px",
        marginLeft: "40px",

    },
    cover: {
        width: 200,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));
