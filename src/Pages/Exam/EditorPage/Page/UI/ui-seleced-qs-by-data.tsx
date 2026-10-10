import { Alert, Button, Skeleton } from '@mui/material';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { loadQSData } from '../redux-store/async-actions';

export default function SelectedQSByData() {
  const {
    selected_qs_data: data,
    exam_qs_id_for_create: id,
    selected_qs_data_loading: loading,
    selected_qs_data_error: error,
  } = useAppSelector((state: RootState) => state.examEditorPageReducer);
  const dispatch = useAppDispatch();
  if (!id) return null;
  if (error)
    return (
      <Alert
        severity="error"
        className="sw-examlist-alert"
        action={
          <Button
            color="inherit"
            onClick={() => dispatch(loadQSData(String(id)))}
          >
            Повторить
          </Button>
        }
      >
        Не удалось загрузить выбранную серию.
      </Alert>
    );
  if (loading || Number(data?.id) !== id)
    return (
      <Skeleton
        variant="rounded"
        height={112}
        aria-label="Загрузка выбранной серии"
      />
    );
  return (
    <div className="sw-examlist-selected-qs">
      <span>
        <LayersOutlinedIcon />
      </span>
      <div>
        <small>Серия №{data?.id}</small>
        <strong>{data?.name || 'Без названия'}</strong>
        <span>Вопросов: {data?.sequence_data?.sequence?.length || 0}</span>
      </div>
      <CheckRoundedIcon />
    </div>
  );
}
