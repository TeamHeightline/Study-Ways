import React from 'react';
import { observer } from 'mobx-react';
import Upload from 'antd/es/upload';
import { TextField } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { CESObject } from '../Store/CardEditorStorage';
export const UiUploadImage = observer(() => (
  <div className="sw-cedit-image-material">
    <Upload.Dragger
      accept="image/png,image/jpeg"
      multiple={false}
      maxCount={1}
      showUploadList={false}
      beforeUpload={() => false}
      onChange={event => {
        if (event.file)
          CESObject.handleUploadImage(event, CESObject.getField('id', ''));
      }}
    >
      {CESObject.image_url ? (
        <img src={CESObject.fakeImageUrl} alt="Изображение карточки" />
      ) : (
        <span className="sw-cedit-upload-icon">
          <AddPhotoAlternateOutlinedIcon />
        </span>
      )}
      <strong>
        {CESObject.image_url ? 'Заменить изображение' : 'Добавить изображение'}
      </strong>
      <p>Перетащите файл или нажмите, чтобы выбрать. PNG или JPEG.</p>
    </Upload.Dragger>
    {CESObject.getField('card_content_type', 0) === 1 && (
      <TextField
        fullWidth
        label="Ссылка на внешний ресурс"
        placeholder="https://…"
        value={CESObject.getField('site_url', '')}
        onChange={CESObject.changeField('site_url')}
        error={!CESObject.UrlValidation}
        helperText={
          !CESObject.UrlValidation
            ? 'Введите полную ссылку, начинающуюся с https:// или http://'
            : 'Ученик сможет открыть материал по этой ссылке.'
        }
      />
    )}
  </div>
));
