import {Grid, Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {useDispatch} from 'react-redux'
import {loadUsersAsync} from "../redux-store/async-actions";
import UITitle from "./ui-title";
import UIAllUsers from "./ui-all-users";
import UIUserSearch from "./ui-user-search";
import {loadAllUsersAsync} from "../redux-store/AsyncActions";

interface IStatusEditorPageProps extends PaperProps {

}

export default function StatusEditorPage({...props}: IStatusEditorPageProps) {
    const dispatch: any = useDispatch()
    useEffect(() => {
        dispatch(loadUsersAsync())
        dispatch(loadAllUsersAsync())
    }, [])
    return (
        <Paper elevation={0} {...props}>
            <Paper elevation={0} sx={{pl: 4}}>
                <UITitle/>
                <Grid container justifyContent={"center"}>
                    <Grid item xs={12} md={8}>
                        <UIUserSearch/>
                        <UIAllUsers/>
                    </Grid>
                </Grid>
            </Paper>
        </Paper>
    )
}
