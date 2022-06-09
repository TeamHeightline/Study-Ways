import axiosClient from "./config";
import {IDetailStatistic} from "../Types/detail-statistic.types";

export const createDetailStatistic = async (statisticData: IDetailStatistic) => {
    return axiosClient.post("/detail-statistic/create", {
        statisticData: statisticData
    })
}


