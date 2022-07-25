import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import UIAccessTypeManual from "./ui-access-type-manual";
import UITimeInterval from "./ui-access-type-time-interval";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIAccessTypeVariantsProps extends PaperProps {

}

export default function UIAccessTypeVariants({...props}: IUIAccessTypeVariantsProps) {
    const accessMode = useSelector((state: RootState) => state?.examEditor?.exam_data?.access_mode)

    return (
        <Paper elevation={0} {...props}>
            {accessMode == "manual" ?
                <UIAccessTypeManual/> :
                <UITimeInterval/>
            }
        </Paper>
    )
}
