import { createStackNavigator, createAppContainer } from 'react-navigation';
import { LoginScreen, RegisterScreen, LoginViewScreen, SwiperScreen } from './screens';
import { SCREENS } from './constants';

const Navigator = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    LoginView: LoginViewScreen,
    Swiper: SwiperScreen
  },
  { initialRouteName: SCREENS.LOGIN }
);

export default createAppContainer(Navigator);
