import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import { isMobileHook } from '../../../../Shared/CustomHooks/isMobileHook';

export default function UiQuestionData(props: any) {
  const [openAcceptDefeatDialog, setOpenAcceptDefeatDialog] = useState(false);
  const [disableCheckButton, setDisableCheckButton] = useState(false);
  const isMobile = isMobileHook();
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
      e.preventDefault();
    }
  });

  return (
    <Paper className="sw-question-panel" elevation={0}>
      {(!isMobile || props.ignoreAspectRatio) && (
        <Card
          className="sw-question-panel-card"
          variant="outlined"
          sx={{
            padding: 0,
            minHeight: { xs: '100%', md: 510 },
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <Grid
            className="sw-question-player-grid"
            container
            sx={{
              justifyContent: 'center',
            }}
          >
            {props.questionImgUrl && (
              <Grid
                className="sw-question-media-cell"
                size={{
                  xs: 12,
                  md: 7,
                }}
              >
                <CardMedia
                  className="sw-question-media"
                  style={{
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                  }}
                  image={props.questionImgUrl}
                />
              </Grid>
            )}
            <Grid
              className="sw-question-copy-cell"
              size={{
                xs: 12,
                md: props.questionImgUrl ? 5 : 12,
              }}
            >
              <CardContent className="sw-question-copy" sx={{ height: '100%' }}>
                <Grid
                  container
                  sx={{
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Grid spacing={2} size={12}>
                    <Typography
                      className="sw-question-copy-title"
                      component="h5"
                      variant="h5"
                    >
                      Вопрос
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                      className="sw-question-copy-text"
                      style={{ userSelect: 'none' }}
                    >
                      {props.questionData?.questionById?.text
                        ? props.questionData?.questionById?.text
                        : props.questionText}
                    </Typography>
                    {props.id && props.onChange && (
                      <Button
                        fullWidth
                        sx={{ mt: 1 }}
                        variant="outlined"
                        color="primary"
                        onClick={props.onClick}
                      >
                        Назад
                      </Button>
                    )}
                    <Stack direction={'row'} spacing={1} sx={{ mt: 1 }}>
                      <Button
                        disabled={disableCheckButton}
                        variant="contained"
                        color="primary"
                        onClick={e => {
                          props.onClick1(e);
                          setDisableCheckButton(true);
                          setTimeout(setDisableCheckButton, 1000, false);
                        }}
                        fullWidth
                      >
                        Проверить
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpenAcceptDefeatDialog(true)}
                        fullWidth
                      >
                        Сдаться
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      )}
      {props.showNotUseScrollbarCheckbox && (
        <FormControlLabel
          control={
            <Checkbox
              checked={props.isNotUseScrollbar}
              onChange={e => props.setIsNotUseScrollbar(e.target.checked)}
              color="primary"
            />
          }
          label="Использовать ScrollBar"
        />
      )}
      <Dialog
        onClose={() => setOpenAcceptDefeatDialog(false)}
        open={openAcceptDefeatDialog}
      >
        <DialogTitle>{'Вы уверены, что хотите сдаться?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Если этот вопрос является частью серии вопросов, мы советуем Вам
            заняться другими вопросами и вернуться к этому позже
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => props?.onAcceptDefeat()}>
            Сдаться
          </Button>
          <Button onClick={() => setOpenAcceptDefeatDialog(false)}>
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
