import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
import { ImageUpload } from '../../../../../Shared/Uploads/ImageUpload';

export const UiUploadImage = observer(() => (
  <div className="sw-cedit-image-material">
    <ImageUpload
      key={String(CESObject.card_object?.id)}
      imageUrl={CESObject.image_url ? CESObject.fakeImageUrl : undefined}
      disabled={!CESObject.card_object?.id}
      onUpload={file =>
        CESObject.handleUploadImage(file, Number(CESObject.card_object?.id))
      }
    />
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
