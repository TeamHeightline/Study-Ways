import { createSlice } from "@reduxjs/toolkit";

export interface INotificationFormat {
  text: string;
  type: "CARD_SUGGESTION"; // далее будет добавление новых типов нотификаций
  payload: any;
}

const initialState = {
  notifications: [] as INotificationFormat[],
  number_of_not_viewed_notifications: 0,
  is_show_notification_window: false,
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action: { payload: INotificationFormat }) {
      state.notifications.push(action.payload);
      state.number_of_not_viewed_notifications++;
    },
    openNotificationWindow(state) {
      state.is_show_notification_window = true;
      state.number_of_not_viewed_notifications = 0;
    },
    closeNotificationWindow(state) {
      state.is_show_notification_window = false;
    },
  },
  extraReducers: {},
});

export default NotificationSlice.reducer;

export const {
  addNotification,
  closeNotificationWindow,
  openNotificationWindow,
} = NotificationSlice.actions;
