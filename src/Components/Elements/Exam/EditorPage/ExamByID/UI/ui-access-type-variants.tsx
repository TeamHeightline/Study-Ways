import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import UIAccessTypeManual from "./ui-access-type-manual";
import UITimeInterval from "./ui-access-type-time-interval";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIAccessTypeVariantsProps extends PaperProps {

}

export default function UIAccessTypeVariants({...props}: IUIAccessTypeVariantsProps) {
    const accessType = useSelector((state: RootState) => state?.examEditorReducer?.access_type)

    return (
        <Paper elevation={0} {...props}>
            {accessType == "manual" ?
                <UIAccessTypeManual/> :
                <UITimeInterval/>
            }
        </Paper>
    )
}
