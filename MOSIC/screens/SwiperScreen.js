import Swiper from 'react-native-swiper';
import React from 'react';
// import { UserScreen, MessageScreen } from './index';

import Users from './Users';
import Messages from './Messages';
import MusicPlayer from './musicPlayer';

function SwiperScreen(props) {
  return (
    <Swiper>
      <MusicPlayer />
      <Users />
      <Messages />
    </Swiper>
  );
}

SwiperScreen.navigationOptions = { title: 'MOSIC' };

export default SwiperScreen;
