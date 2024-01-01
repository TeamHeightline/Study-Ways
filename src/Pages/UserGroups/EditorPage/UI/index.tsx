import {Box} from "@mui/material";
import {useGetUserGroupsQuery} from "../store/api";
import {useEffect} from "react";
import CreateButton from "./create-button";

export default function UserGroupsEditor() {
    const {data, isLoading} = useGetUserGroupsQuery()


    return (
        <Box>
            <CreateButton/>
            {/*user-groups*/}
            {/*isLoading: {isLoading.toString()}*/}
            {/*data: {JSON.stringify(data)}*/}


        </Box>
    )
}