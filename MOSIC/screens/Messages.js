import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function UserMap({ userLoc }) {
  const DEFAULT_LONG_DELTA = 0.50436493009;
  const DEFAULT_LAT_DELTA = 0.7114833;
  const latitude = userLoc.latitude;
  const longitude = userLoc.longitude;

  const getRegion = (latitude, longitude) => ({
    latitude,
    longitude,
    longitudeDelta: DEFAULT_LONG_DELTA,
    latitudeDelta: DEFAULT_LAT_DELTA
  });

  //console.log('UserMap ----hohoho---', getRegion(latitude, longitude));
  return (
    <MapView style={{ height: 200 }} region={getRegion(latitude, longitude)}>
      <Marker
        ref={marker => {
          this.marker = marker;
        }}
        coordinate={{ latitude, longitude }}
        title={'hoho'}
      />
    </MapView>
  );
}

function Messages(props) {
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  //const [firstFetch, setFirstFetch] = useState(true);
  console.log('Messages logging', dataSource.length);

  function _onRefresh() {
    setRefreshing(true);
    fetchMsgs().then(() => {
      setRefreshing(false);
    });
  }

  async function fetchMsgs(firstFetch) {
    return fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Messages -- get response', firstFetch);

        if (responseJson.success === true) {
          //got valid response

          //adding displayed prop
          const msgArr = responseJson.messages.map((elmt, ind) => {
            let displayed = true;
            if (!firstFetch) {
              const exist = dataSource.find(msg => {
                return msg._id === elmt._id;
              });
              //console.log('checking', elmt._id, !!exist);
              if (!exist) {
                displayed = false;
              }
            }
            return { ...elmt, displayed };
          });
          setDataSource(msgArr);
        }
        console.log('setting first fetch');
        //setFirstFetch(false);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    //fetch msg regularly
    fetchMsgs(true);
  }, []);

  useEffect(() => {
    let intervalID = setInterval(() => {
      fetchMsgs(false);
    }, 5000);

    return () => {
      clearInterval(intervalID);
    };
  }, [dataSource]);

  // useEffect(() => {
  //   msgArr = msgArr.map(elmt => ({ ...elmt, displayed: true }));
  //   setDataSource(msgArr);
  //   console.log('msg displayed');
  // }, [dataSource]);

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: 1000 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />}
        data={dataSource}
        keyExtractor={(msg, index) => msg._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ borderWidth: 1, marginBottom: 5, marginTop: 5, flexGrow: 1 }}>
            <Text>---~~---</Text>
            <Text>To: {item.to.username}</Text>
            <Text>From: {item.from.username}</Text>
            <Text style={item.displayed ? { color: 'grey' } : { color: 'red' }}>
              Message: {item.body}
            </Text>
            {/* display map info if provided */}
            {item.location && item.location.longitude && <UserMap userLoc={item.location} />}
            {item.photo && (
              <Image source={{ uri: item.photo }} style={{ width: 400, height: 400 }} />
            )}

            <Text>--{item.timestamp}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

Messages.navigationOptions = {
  title: 'Messages'
};

export default Messages;

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
