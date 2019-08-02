import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

function Register(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function register() {
    console.log('register starting');
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
        console.log(responseJson);
        if (responseJson.success === true) {
          props.navigation.goBack();
        }
      })
      .catch(err => {
        alert('failed to register');
        console.log('register error', err);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textBig}>Register</Text>
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
      <TouchableOpacity onPress={register} style={[styles.button, styles.buttonBlue]}>
        <Text style={styles.buttonLabel}> Register </Text>
      </TouchableOpacity>
    </View>
  );
}

Register.navigationOptions = {
  title: 'Register'
};

export default Register;

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
