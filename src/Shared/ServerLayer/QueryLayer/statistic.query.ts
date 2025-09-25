import axiosClient from "./config";

export async function getExcelDownloadUrl(qs_id: string) {
  return axiosClient
    .get(`/statistic/excel/${qs_id}`)
    .then((res) => res.data.publicUrl);
}
