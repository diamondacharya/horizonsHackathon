import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mess, setMess] = useState('');

  function login(username, password) {
    console.log('login starting');
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      }),
      redirect: 'follow',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', responseJson);
        if (responseJson.success === true) {
          //sucess logged in
          props.navigation.navigate('Swiper');
          AsyncStorage.setItem(
            'user',
            JSON.stringify({
              username,
              password
            })
          );
        } else {
          setMess(responseJson.error);
          alert(responseJson.error);
        }
      })
      .catch(err => {
        setMess('Failed to login');
        const message = <Text>{mess}</Text>;
        alert(message);
        console.log('login error', err);
      });
  }

  useEffect(() => {
    console.log('auto-login--');
    AsyncStorage.getItem('user')
      .then(result => {
        const username = JSON.parse(result).username;
        const password = JSON.parse(result).password;
        console.log(username, password, '-------------');
        if (username && password) {
          return login(username, password);
        }
      })
      .catch(err => {
        console.log('auto-login failed', err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textBig}>Login</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={() => login(username, password)}
        style={[styles.button, styles.buttonBlue]}
      >
        <Text style={styles.buttonLabel}> Login </Text>
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
  textInput: {
    fontSize: 30,
    textAlign: 'center'
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
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
