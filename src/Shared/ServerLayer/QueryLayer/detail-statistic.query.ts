import { writeApi } from './write-api';
import { executeMutation } from './execute-mutation';
import { IDetailStatistic } from '../Types/detail-statistic.types';
export function createDetailStatistic(
  statisticData: IDetailStatistic & { answers_id_array: number[] },
): Promise<IDetailStatistic> {
  return executeMutation(
    writeApi.endpoints.createStatistic.initiate(statisticData),
  );
}
