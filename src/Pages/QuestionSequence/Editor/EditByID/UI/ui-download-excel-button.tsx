import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import { Button, Paper } from '@mui/material';
import { getExcelDownloadUrl } from '../../../../../Shared/ServerLayer/QueryLayer/statistic.query';
import { useSequenceEditor } from '../store/sequence-editor-context';

type IUIDownloadExcelButtonProps = PaperProps;

const UIDownloadExcelButton = ({ ...props }: IUIDownloadExcelButtonProps) => {
  const editQSStore = useSequenceEditor();
  const [excelDownloadUrl, setExcelDownloadUrl] = React.useState<string>('');

  async function createUrl() {
    if (editQSStore.qsData?.id) {
      setExcelDownloadUrl(await getExcelDownloadUrl(editQSStore.qsData.id));
    }
  }

  if (excelDownloadUrl) {
    return (
      <Paper elevation={0} {...props}>
        <Button
          variant="contained"
          color="primary"
          href={excelDownloadUrl}
          download
        >
          Скачать отчет
        </Button>
      </Paper>
    );
  }
  return (
    <Paper elevation={0} {...props}>
      <Button variant="outlined" color="primary" onClick={createUrl}>
        Создать отчёт об экзамене · Excel
      </Button>
    </Paper>
  );
};

export default UIDownloadExcelButton;
