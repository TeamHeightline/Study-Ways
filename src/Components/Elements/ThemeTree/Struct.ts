import {gql} from "graphql.macro";

export const GET_ALL_UNSTRUCTURED_THEME = gql`
    query GET_ALL_UNSTRUCTURED_THEME{
        unstructuredTheme{
            id
            text
            parent{
                id
            }
        }
    }`