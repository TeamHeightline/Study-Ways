import { Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../App/ReduxStore/RootStore';
import DownloadIcon from '@mui/icons-material/Download';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../../../../Shared/ServerLayer/QueryLayer/config';

export default function UiJSONExport() {
  const exam_id = useSelector(
    (state: RootState) => state?.examResultsByIDReducer?.exam_id,
  );

  // Описываем мутацию через TanStack Query + Axios
  const { mutate: downloadAiJson, isPending } = useMutation({
    mutationFn: async (id: number) => {
      // Собираем URL с префиксом /exam и эндпоинтом /analytics/cheating
      const response = await axiosClient.get(`/exam/analytics/cheating/${id}`);
      return response.data;
    },
    onSuccess: data => {
      // Автоматическое скачивание полученного JSON в виде файла
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2),
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `exam_${exam_id}_ai_analytics.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    },
    onError: error => {
      console.error('Ошибка при скачивании данных для ИИ:', error);
      alert('Не удалось скачать данные для анализа ИИ');
    },
  });

  function handleClick() {
    if (!exam_id) {
      alert('ID экзамена не найден');
      return;
    }
    // Запускаем триггер запроса
    downloadAiJson(Number(exam_id));
  }

  return (
    <Box>
      <Button
        disabled={isPending}
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
