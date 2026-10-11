import { Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/redux-store/RootStore';
import DownloadIcon from '@mui/icons-material/Download';
import { useLazyGetExamAnalyticsExportQuery } from '../exam-analytics-api';

export default function UiJSONExport() {
  const exam_id = useSelector(
    (state: RootState) => state?.examResultsByIDReducer?.exam_id,
  );
  const [downloadAiJson, { isFetching }] = useLazyGetExamAnalyticsExportQuery();

  async function handleClick() {
    const id = Number(exam_id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      alert('ID экзамена не найден');
      return;
    }

    try {
      const data = await downloadAiJson(id, false).unwrap();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2),
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `exam_${id}_ai_analytics.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (error) {
      console.error('Ошибка при скачивании данных для ИИ:', error);
      alert('Не удалось скачать данные для анализа ИИ');
    }
  }

  return (
    <Box>
      <Button
        disabled={isFetching}
        color={'success'}
        variant={'contained'}
        onClick={handleClick}
        endIcon={<DownloadIcon />}
      >
        Экспорт в JSON для отправки аналитики в ИИ
      </Button>
    </Box>
  );
}
