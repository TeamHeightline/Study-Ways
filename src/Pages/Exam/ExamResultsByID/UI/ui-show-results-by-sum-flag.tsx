import {FormControlLabel, Paper, Switch} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {changeShowResultsBySum} from "../redux-store/reducer";
import {RootState} from "../../../../App/ReduxStore/RootStore";

interface IShowResultsBySumFlagProps extends PaperProps {

}

export default function ShowResultsBySumFlag({...props}: IShowResultsBySumFlagProps) {
    const showResultsBySum = useSelector((state: RootState) => state?.examResultsByIDReducer?.show_results_by_sum)
    const dispatch = useDispatch();

    function changeShowResultsBySumHandle() {
        dispatch(changeShowResultsBySum());
    }

    return (
        <Paper elevation={0} {...props}>

            <FormControlLabel control={
                <Switch
                    checked={showResultsBySum}
                    onChange={changeShowResultsBySumHandle}/>
            } label="Упорядочить результаты по сумме балов"/>

        </Paper>
    )
}
