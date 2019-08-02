import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SCREENS } from '../constants';

function Login(props) {
  const { navigation } = props;

  function login() {
    navigation.navigate(SCREENS.LOGINVIEW);
  }

  function register() {
    navigation.navigate(SCREENS.REGISTER);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textBig}>Login to HoHoHo!</Text>
      <TouchableOpacity onPress={login} style={[styles.button, styles.buttonGreen]}>
        <Text style={styles.buttonLabel}>Tap to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={register}>
        <Text style={styles.buttonLabel}>Tap to Register</Text>
      </TouchableOpacity>
    </View>
  );
}

Login.navigationOptions = {
  title: 'Login'
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonBlue: {
    backgroundColor: '#0074D9'
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
