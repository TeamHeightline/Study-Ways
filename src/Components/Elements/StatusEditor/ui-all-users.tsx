import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import {statusEditorReducer} from "../../../redux-store/user-status-editor/reducer";
import {RootState} from "../../../redux-store/RootReducer";
import {IBasicUserInformation} from "../../../ServerLayer/Types/user.types";
import UIUserProfileHead from "./ui-user-tablse-head";

interface IUIAllUsersProps extends PaperProps {

}

export default function UIAllUsers({...props}: IUIAllUsersProps) {
    const users = useSelector((state: RootState) => state.statusEditorReducer.users)
    return (
        <Paper elevation={0} {...props}>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <UIUserProfileHead/>
                    <TableBody>
                        {users.map((user: IBasicUserInformation) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user?.users_userprofile?.firstname || "Не указано"}</TableCell>
                                <TableCell>{user?.users_userprofile?.lastname || "Не указано"}</TableCell>
                                <TableCell>{user?.username}</TableCell>
                                <TableCell>{user?.users_userprofile?.users_educationorganization?.organization_name
                                    || "Не указано"}</TableCell>
                                <TableCell>{user.user_access_level}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
