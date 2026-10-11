import { Box, Typography } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux-store/RootStore';
import CardMicroView from '../../../../../pages/cards/card-micro-view';
import { useNavigate } from 'react-router-dom';

type INotificationContentProps = BoxProps;

export default function NotificationContent({
  ...props
}: INotificationContentProps) {
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications,
  );
  const navigate = useNavigate();

  const reverted_notifications =
    Array.isArray(notifications) && notifications.length > 0
      ? [...notifications].reverse()
      : [];

  return (
    <Box {...props} sx={{ p: 1 }}>
      {reverted_notifications?.map((notification, index) => (
        <Box key={index}>
          <Typography variant={'h5'}>{notification.text}</Typography>
          {notification.type === 'CARD_SUGGESTION' &&
            Array.isArray(notification.payload) &&
            notification.payload.map((card_id, index) => (
              <CardMicroView
                key={index}
                cardID={card_id}
                onClick={() => {
                  navigate(`/card/${card_id}`);
                }}
              />
            ))}
        </Box>
      ))}
    </Box>
  );
}
