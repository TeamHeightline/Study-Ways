import axiosClient from "./config";
import { IDetailStatistic } from "../Types/detail-statistic.types";

interface detailDataForSave extends IDetailStatistic {
  answers_id_array: number[];
}

export const createDetailStatistic = async (
  statisticData: detailDataForSave,
): Promise<IDetailStatistic> =>
  axiosClient
    .post("/detail-statistic/create", {
      statisticData,
    })
    .then((res) => res.data.createdStatistic);
