import { useAppDispatch } from "../../../../App/ReduxStore/RootStore";
import { useEffect } from "react";
import { loadAllCardsData } from "./async-actions";

export function useLoadCardsDataForMicroView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAllCardsData());
  }, []);
}
