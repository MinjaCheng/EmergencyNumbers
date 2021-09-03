import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import data from './numbers.json';
const departments = ["Police", "Medical", "Fire"];
const DepartmentsContext = React.createContext(departments);

export default function App() {
  
  const flatlistRef = useRef();
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
    flatlistRef.current.scrollToIndex({index: 0});
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
        flatlistRef={flatlistRef}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function AppName() {
  return (
    <Text style={styles.appNameText}>Emergency<span style={{ color: '#bdbdbd'}}>Numbers</span></Text>
  );
} 

function Flag(props) {
  return (
    <Image
      source={{
        uri: `http://emergency-phone-numbers.herokuapp.com/images/${props.countryInfo.code.toLowerCase()}.jpg`
      }}
      style={styles.flagImage}
    />
  );
}

function Country(props) {
  return (
    <Text style={styles.countryName}>{props.countryInfo.name}</Text>
  );
}

function Numbers(props) {
  const dep = useContext(DepartmentsContext);
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.depContainer}>
        <Text style={styles.depName}>{dep[0]}</Text>
        <Text>{props.countryInfo.police}</Text>
      </View>
      <View style={styles.depContainer}>
        <Text style={styles.depName}>{dep[1]}</Text>
        <Text>{props.countryInfo.medical}</Text>
      </View>
      <View style={styles.depContainer}>
        <Text style={styles.depName}>{dep[2]}</Text>
        <Text>{props.countryInfo.fire}</Text>
      </View>
    </View>
  );
}

function ListOfCountries (props) {
  return (
    <View style={ styles.listContainer }>
      {props.isLoading ? <ActivityIndicator/> : (
        <FlatList
        ref={props.flatlistRef}
        data={props.data}
        keyExtractor={( item , index) => 'key'+index}
        ListHeaderComponent={() => <Text>Select a country:</Text>}
        renderItem={({ item, index }) => (
          <Text
            onPress={() => props.countrySelected(index)} 
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
    backgroundColor: '#4672c4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameText: {
    fontSize: 28,
    fontWeight: 800,
    color: 'whitesmoke',
    marginBottom: 25,
  }, 
  flagImage: { 
    width: 65, 
    height: 50, 
    marginBottom: 10  
  },
  countryName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22375e',
    marginBottom: 20,
  },
  depContainer: {
    backgroundColor: '#e6e9f0',
    height: 45,
    width: 180,
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: 'center',
    justifyContent: 'center'
  },
  depName: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  listContainer: { 
    width: 250, 
    height: 300, 
    padding: 24,
    marginTop: 15
  },
  listText: {
    padding: 25,
    fontWeight: 'bold',
    fontSize: 18,
    height: 35,
  }
});
