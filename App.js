import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_URL, API_KEY} from '@env';
import { useEffect, useState } from 'react';
import {Picker} from'@react-native-picker/picker';

export default function App() {

const [currencyRates, setCurencyRates] = useState();
const [currencyCodes, setCurrencyCodes] = useState([]);
const [selectedCurrency, setSelectedCurrency] = useState();
const [conversionResult, setConversionResult] = useState();

useEffect(() => {
  console.log("fetch", API_KEY)
  fetch(`${API_URL}?base=EUR`, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'apikey': API_KEY
    }
  })
  .then(response => response.json())
  .then(data => { 
    console.log(data)
    setCurencyRates(data.rates)
    setCurrencyCodes(Object.keys(data.rates))
  })
}, [])  

const [amount, setAmount] = useState('')

const calculateConversion = () => {
  const rate = currencyRates[selectedCurrency]
  console.log(rate)
  const result = (amount / rate).toFixed(2)
  console.log(result)
  setConversionResult(result)
}
  if (currencyRates == undefined) {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 15}}>Ladataan valuuttakursseja</Text>
      </View>
        )
  }

  return (
    <View style={styles.container}>
      {conversionResult && <Text style={{fontSize: 15}}>{conversionResult} EUR</Text>}
      <TextInput
      style={{fontSize: 16}}
      placeholder='amount'
      value={amount}
      onChangeText={text => setAmount(text)}
      />
      <Picker
        style={{ width: 200}}
        selectedValue={selectedCurrency}
        onValueChange={(itemValue, itemIndex) =>
        setSelectedCurrency(itemValue)
      }>
       {currencyCodes.map(item => <Picker.Item key={item} label={item} value={item}/>)}
      </Picker>
      <Button title='CONVERT' onPress={calculateConversion} disabled={amount.length == 0} />
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
});
