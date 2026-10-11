import reduxStore from '../../../App/ReduxStore/RootStore';
import { selectUserSession } from './user-session';

// For imperative legacy actions. React components use useUserSession instead.
export const getUserSession = () => selectUserSession(reduxStore.getState());
