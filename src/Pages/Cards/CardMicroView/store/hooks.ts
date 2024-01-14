import {useAppDispatch} from "../../../../ReduxStore/RootStore";
import {useEffect} from "react";
import {loadAllCardsData} from "./async-actions";

export function useLoadCardsDataForMicroView() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(loadAllCardsData())
    }, [])


}