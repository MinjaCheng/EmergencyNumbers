import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import data from './numbers.json';
const departments = ["Police", "Medical", "Fire"];
const DepartmentsContext = React.createContext(departments);

export default function App() {
  
  const [getData, setGetData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [countryInfo, setCountryInfo] = useState({
    code: "SE", 
    fire: "112", 
    police: "11414", 
    name: "Sweden", 
    medical: "112"
  });
  
  const updateCountryIndex = (index) => {
    setCountryInfo(getData[index]);
  }
  
  useEffect(() => {
    // Då APIet http://emergency-phone-numbers.herokuapp.com/ är blockad, 
    // så godkände du att jag löser fil-inläsningen på detta sätt, 
    // genom att skapa en lokal json-fil. 
    setGetData(data.content);
    setLoading(false);

    // fetch(http://emergency-phone-numbers.herokuapp.com/)
    // .then((response) => response.json())
    // .then((json) => {
    //   setGetData(json.content);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }, []);

  return (
    <View style={ styles.container }>
      <AppName />
      <Flag countryInfo={countryInfo} />
      <Country countryInfo={countryInfo} />  
      <Numbers countryInfo={countryInfo} />
      <ListOfCountries 
        isLoading={isLoading} 
        data={getData}
        countrySelected={updateCountryIndex}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function AppName() {
  return (
    <Text>Emergency<span>Numbers</span></Text>
  );
} 

function Flag(props) {
  return (
    <Image
      source={{
        uri: `http://emergency-phone-numbers.herokuapp.com/images/${props.countryInfo.code.toLowerCase()}.jpg`,
      }}
      style={{ width: 100, height: 70 }}
    />
  );
}

function Country(props) {
  return (
    <Text>{props.countryInfo.name}</Text>
  );
}

function Numbers(props) {
  const dep = useContext(DepartmentsContext);
  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <Text>{dep[0]}</Text>
        <Text>{props.countryInfo.police}</Text>
      </View>
      <View>
        <Text>{dep[1]}</Text>
        <Text>{props.countryInfo.medical}</Text>
      </View>
      <View>
        <Text>{dep[2]}</Text>
        <Text>{props.countryInfo.fire}</Text>
      </View>
    </View>
  );
}

function ListOfCountries (props) {
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToIndex({index: 0});
  };

  return (
    <View style={ styles.listContainer }>
      {props.isLoading ? <ActivityIndicator/> : (
        <FlatList
        ref={flatlistRef}
        data={props.data}
        keyExtractor={( item , index) => 'key'+index}
        ListHeaderComponent={() => <Text>Select Country</Text>}
        renderItem={({ item, index }) => (
          <Text
            onPress={() => props.countrySelected(index), onPressFunction} 
            style={ styles.listText }>
              { item.name }
          </Text>
        )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: { 
    width: 250, 
    height: 200, 
    padding: 24,
  },
  listText: {
    padding: 25,
    fontWeight: 'bold',
    fontSize: 18,
    height: 35,
  }
});
