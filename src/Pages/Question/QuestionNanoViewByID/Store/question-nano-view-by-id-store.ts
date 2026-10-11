import { makeAutoObservable } from 'mobx';
import React from 'react';

export class QuestionNanoViewByIdStore {
  constructor(id?: number) {
    makeAutoObservable(this, { reload: false });
    this.id = id;
  }

  id?: number;

  text?: string;
  owner_username?: string;
  questionImage?: string;

  dataHasBeenLoaded = false;
  hasLoadError = false;

  reload?: () => unknown;
  loadQuestionTextNanoViewByID() {
    this.reload?.();
  }

  // Изображение вопроса

  AnchorEl: any;

  handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.AnchorEl = event.currentTarget;
  };

  handlePopoverClose = () => {
    this.AnchorEl = null;
  };

  get isShowQuestionImagePopover() {
    return Boolean(this.AnchorEl) && !!this.questionImage;
  }
}

export type NanoQuestionStoreType = QuestionNanoViewByIdStore;
