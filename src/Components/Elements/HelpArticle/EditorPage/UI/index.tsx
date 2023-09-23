import {useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {Button} from "@mui/material";
import {setIsOpenCreateDialog} from "../redux-store";
import CreateHelpArticleDialog from "./CreateDialog";

export default function HelpArticleEditPage() {
    const dispatch = useAppDispatch()

    function handleOpenCreateDialog() {
        dispatch(setIsOpenCreateDialog(true))
    }

    return (
        <div>
            <h1>HelpArticleEditPage</h1>
            <Button onClick={handleOpenCreateDialog}>
                Создать подсказку
            </Button>
            <CreateHelpArticleDialog/>
        </div>
    )
}
