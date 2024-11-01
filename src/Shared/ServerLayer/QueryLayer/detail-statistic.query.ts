import axiosClient from "./config";
import {IDetailStatistic} from "../Types/detail-statistic.types";

interface detailDataForSave extends IDetailStatistic {
    answers_id_array: number[]
}

export const createDetailStatistic = async (statisticData: detailDataForSave): Promise<IDetailStatistic> => {
    return axiosClient.post("/detail-statistic/create", {
        statisticData: statisticData
    })
        .then((res) => res.data.createdStatistic)
}


