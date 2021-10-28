import {gql} from "graphql.macro";
import {makeStyles} from "@material-ui/core/styles";




export const UPDATE_QUESTION_SEQUENCE = gql`
    mutation UPDATE_QUESTION_SEQUENCE($sequenceData: GenericScalar!, $sequenceId: ID!, $name: String!, $description: String){
        updateQuestionSequence(input: {name: $name, sequenceId: $sequenceId, sequenceData: $sequenceData, description: $description}){
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
