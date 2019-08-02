import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Button,
  RefreshControl
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

function Users(props) {
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [curLocation, setCurLocation] = useState({});
  const [locationObj, setLocationObj] = useState(null);
  function _onRefresh() {
    setRefreshing(true);
    fetchUsers().then(responseJson => {
      if (responseJson.success === true) {
        const usersArr = responseJson.users;
        setDataSource(usersArr);
        setRefreshing(false);
      }
    });
  }

  function messages() {
    props.navigation.navigate('Messages');
  }

  function touchUser(user) {
    const ID = user._id;
    console.log('ID_______', ID);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ID
      }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('TouchUser -- Post Resp', responseJson);
        if (responseJson.success === true) {
          Alert.alert(
            'Hahaha',
            `Hohoho to ${user.username}`,
            [{ text: 'ho' }] // Button
          );
        } else {
          Alert.alert(
            'NoNoNo',
            `Hohoho to ${user.username} failed`,
            [{ text: 'ho' }] // Button
          );
        }
      });
  }

  async function fetchUsers() {
    return fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET'
    }).then(response => response.json());
  }

  useEffect(() => {
    // no longer works for swiper
    // props.navigation.setParams({
    //   onRightPress: () => messages()
    // });
    fetchUsers().then(responseJson => {
      //console.log('Users -- get response', responseJson);
      if (responseJson.success === true) {
        // const usersArr = responseJson.users.map(obj => obj.username);
        // console.log(usersArr);
        const usersArr = responseJson.users;
        setDataSource(usersArr);
      }
    });
    Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 10000 }, loc => {
      setCurLocation(loc);
      //console.log(loc);
    }).then(locationObj => {
      setLocationObj(locationObj);
    });
  }, []);

  useEffect(() => {
    return () => {
      console.log('removing locationObj', locationObj);
      if (locationObj) locationObj.remove();
    };
  }, [locationObj]);

  async function sendLocationAndImage(user) {
    const { status } = await Permissions.askAsync(Permissions.LOCATION, Permissions.CAMERA_ROLL);

    console.log(status);

    if (status !== 'granted') {
      console.log('img or loc permission denied');
      return;
    }
    let chosenImg = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
      // allowsEditing: true,
      // aspect: [4, 3]
    });
    console.log('chosenImg --- ', chosenImg);
    if (chosenImg.cancelled) {
      return;
    }
    //start AJAX posting
    const ID = user._id;
    console.log('ID_______', ID);
    const fd = new FormData();
    fd.append('photo', {
      uri: chosenImg.uri,
      type: 'image/jpeg',
      name: 'photo.jpg'
    });
    fd.append('message', 'hohohohohohohohoh');
    fd.append(
      'location',
      JSON.stringify({
        longitude: curLocation.coords.longitude,
        latitude: curLocation.coords.latitude
      })
    );

    fd.append('to', ID);

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      body: fd
      // credentials: 'include'
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('LongTouchUser -- Post Resp', responseJson);
        if (responseJson.success === true) {
          Alert.alert(
            'Hahaha-media',
            `Hohoho-media to ${user.username}`,
            [
              {
                text: 'ho'
              }
            ] // Button
          );
        } else {
          Alert.alert(
            'NoNoNo-media',
            `Hohoho-media to ${user.username} failed`,
            [
              {
                text: 'ho'
              }
            ] // Button
          );
        }
      })
      .catch(err => console.log(err));
  }

  //send location only when long pressed
  async function sendLocation(user) {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Location Permission denied');
      return;
    }
    const ID = user._id;
    console.log('ID_______', ID);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: ID,
        location: {
          longitude: curLocation.coords.longitude,
          latitude: curLocation.coords.latitude
        }
      }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('LongTouchUser -- Post Resp', responseJson);
        if (responseJson.success === true) {
          Alert.alert(
            'Hahaha-location',
            `Hohoho-location to ${user.username}`,
            [{ text: 'ho' }] // Button
          );
        } else {
          Alert.alert(
            'NoNoNo-location',
            `Hohoho-location to ${user.username} failed`,
            [{ text: 'ho' }] // Button
          );
        }
      })
      .catch(err => console.log(err));
  }

  //send location only when long pressed

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />}
        data={dataSource}
        keyExtractor={(user, index) => user._id + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={e => sendLocationAndImage(item)}
            delayLongPress={500}
            onPress={e => touchUser(item)}
          >
            <Text style={{ fontSize: 18, paddingBottom: 1, paddingTop: 1 }}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

Users.navigationOptions = ({ navigation }) => ({
  title: 'Users',
  headerRight: (
    <Button
      title="Messages"
      onPress={() => {
        navigation.state.params.onRightPress();
      }}
    />
  )
});

export default Users;

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
