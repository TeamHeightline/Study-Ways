import {Paper, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {changeAccessType} from "../redux-store/actions";

interface IUIAccessTypeTogleProps extends PaperProps {

}

export default function UIAccessTypeToggle({...props}: IUIAccessTypeTogleProps) {
    const dispath = useDispatch()
    const accessType = useSelector((state: RootState) => state?.examEditorReducer?.access_type)

    function changeAccessTypeHandle(e, newAccessType) {
        dispath(changeAccessType(newAccessType))
    }

    return (
        <Paper elevation={0} {...props}>
            {/*Toggle component with variants: 1)manual 2) in time*/}
            <ToggleButtonGroup
                color="primary"
                exclusive
                value={accessType}
                // onChange={changeAccessTypeHandle}
                // size={"small"}
            >
                <ToggleButton value="manual">Вручную</ToggleButton>
                <ToggleButton value="timeInterval" disabled>Промежуток времени</ToggleButton>
            </ToggleButtonGroup>
        </Paper>
    )
}
