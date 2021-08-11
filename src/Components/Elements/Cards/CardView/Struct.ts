import {makeStyles} from "@material-ui/core/styles";
import {gql} from "@apollo/client/core";

export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: "400px",
        height: "170px"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
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

export const GET_CARD_FOR_MICRO_VIEW_BY_ID = gql`
    query GET_CARD_FOR_MICRO_VIEW_BY_ID($id: ID!){
        cardById(id: $id){
            id
            text
            title
            cardContentType
            videoUrl
            subTheme{
                id
                name
                theme{
                    id
                    name
                    globalTheme{
                        id
                        name
                    }
                }
            }
            author{
                id
                name
            }

        }
    }`