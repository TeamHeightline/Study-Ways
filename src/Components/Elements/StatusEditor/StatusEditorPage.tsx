import {Paper, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {useDispatch} from 'react-redux'
import {loadUsersAsync} from "../../../redux-store/user-status-editor/async-actions";
import UITitle from "./ui-title";
import UIAllUsers from "./ui-all-users";

interface IStatusEditorPageProps extends PaperProps {

}

export default function StatusEditorPage({...props}: IStatusEditorPageProps) {
    const dispatch: any = useDispatch()
    useEffect(() => {
        dispatch(loadUsersAsync())
    }, [])
    return (
        <Paper elevation={0} {...props}>
            <Paper elevation={0} sx={{pl: 4}}>
                <UITitle/>
                <UIAllUsers/>
            </Paper>
        </Paper>
    )
}
