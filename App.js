/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

//Disable Yellow Warning Box
//https://aboutreact.com/disable-react-native-yellow-box-warnings/

import React, { useEffect, useState } from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LogBox
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, Snackbar } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";
import { Toast } from '@ant-design/react-native';
import NetInfo from "@react-native-community/netinfo";

import { signInWithEmailAndPassword , onAuthStateChanged} from "firebase/auth";
import { auth, db } from './firebase/firebaseConfig'
import { setUser, fetchEvents, fetchPoints, getUserStatus, signOut, getPointsList, setUserInfo, setDeviceInfo } from './src/actions';

import LoginScreen from './src/screens/login';
import Home from './src/screens/home';
import HomeScreen from './src/screens/home/components/homeScreen/HomeScreen';
import Loader from './src/screens/home/components/widgets/loader';
import NetworkLostView from './src/screens/home/components/widgets/NetworkLostView';
import SnackbarView from './src/screens/home/components/widgets/SnackbarView';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

LogBox.ignoreAllLogs();

const App = (props) => {

  const [isLogin , setIsLogin] = useState(undefined);
  const [isLoading , setIsLoading] = useState(true);
  const [networkStatus , setNetworkStatus] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [isSnackbar , setIsSnackbar] = useState(false)
  // const [userInfo , setUserInfo] = useState();
  const [ geoLocation , setGeoLocation ] = useState();
  const [deviceInfo , setDeviceInfo] = useState();

  const getUserInfo=async()=>{
    try {
      const jsonValue = await AsyncStorage.getItem('userInfo')
      if(jsonValue != null){
        props.setUserInfo(JSON.parse(jsonValue))
        // setUserInfo(JSON.parse(jsonValue));
      }
    } catch(e) {
      console.log("Error ----- "+e)
    }
  }

  
  // async function FetchDeviceDetails(){
  //   let region;
  //   let country;
  //   let org;
  //   try {
  //     if(!geoLocation){
  //       const jsonValue = await AsyncStorage.getItem('geoLocation')
  //       if(jsonValue != null){
  //         console.log("GeoLocation -------------"+jsonValue);
  //         setGeoLocation(JSON.parse(jsonValue));
  //       }
  //     }else{
  //       console.log("GeoLocation -------------"+geoLocation);
  //     }

  //     auth.currentUser.getIdToken().then(function (token){
  //       var options = {  
  //         method: 'GET',
  //         headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //           'Authorization': "Bearer " + token,
  //         },
  //       }
  //       //https://australia-southeast1-react-native-logs.cloudfunctions.net/log_loc
  //       //https://react-native-logs.web.app/log-loc
  
  //       let url = 'https://react-native-logs.web.app/log-loc?loc=reg-country-org'
  
  //       fetch(url, options)
  //       .then(res =>res.json())
  //         .then((res) => {
  //           console.log("Res -------------"+JSON.stringify(res));
  //         setDeviceInfo(JSON.stringify(res))
  //       })
  //       .catch(err => console.log('Error ---- '+err));
  
  //     })
      
  //   } catch(e) {
  //     console.log("Error ----- "+e)
  //   }

    
  // }

  // useState(()=>{
  //   FetchDeviceDetails();
    
  // },[geoLocation])

  // useEffect(()=>{
  //   if(props.userInfo){

  //   }
  //   setUserInfo()
  // },[props.userInfo])

  useEffect(()=>{
    if(isSnackbar){
      setVisible(true);
    }
  },[isSnackbar, networkStatus])

  useEffect(()=>{
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if(!state.isConnected){
        setSnackbarMessage('Internet Connection Lost!')
        setIsSnackbar(true);
        setVisible(true);
      }else{
        setSnackbarMessage('Internet Connection Restore!')
      }
      setNetworkStatus(state.isConnected);
      
    });

    // Unsubscribe
    return(unsubscribe)
  },[])

  useEffect(()=>{
    if(props.loading === true || props.loading===false){
      setIsLoading(props.loading)
    }
  },[props.loading])

  useEffect(()=>{
    getUserInfo();
    if(props.user){
      setIsLogin(true)
      setIsLoading(false)   
    }
  },[props.user])


  onAuthStateChanged(auth, (user) => {
    if(user){
      props.setUser(user)
      props.getPointsList(user.uid)
      setIsLogin(true)
      setIsLoading(false)       
      
    }else{
      props.setUser(null)
      setIsLogin(false)
      setIsLoading(false)
    }
  })


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex:1, borderWidth:0 , borderColor:'red'}}>
      {isLoading ? <Loader /> :
        isLogin?<Provider><Home userInfo={props.userInfo}/></Provider>:<LoginScreen setGeoLocation={setGeoLocation}/>
      }
      <SnackbarView visible={visible} setVisible={setVisible} iconName={networkStatus ? 'wifi' : 'wifi-remove'} backColor={networkStatus ? '#3CB371' : '#CD5C5C'} snackbarMessage={snackbarMessage} />
      {/* <Snackbar
        style={{backgroundColor: networkStatus ? '#3CB371' : '#CD5C5C', borderRadius:10, width:'80%' , alignSelf:'center'}}
        duration={4000}
        visible={visible}
        onDismiss={() => setVisible(false)}
        >
          <View style={{display:'flex' , flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <MIcon name={networkStatus ? 'wifi' : 'wifi-remove'} size={22} color="white" />
            <Text style={{color:'white', marginLeft:10 ,fontSize:16, fontWeight:'bold'}}>{snackbarMessage}</Text>
          </View>
          
      </Snackbar> */}

      {/* {!networkStatus && <View style={{position:'absolute', zIndex:1 , height:'100%' , width:'100%' , opacity:0.8}}><NetworkLostView /></View>} */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const mapStateToProps = (state) =>{
  return {
      user: state.user,
      userStatus: state.userStatus,
      loading : state.loading,
      userInfo : state.userInfo
    }
}

const mapDispatchToProps = {
  getUserStatus,
  setUser,
  fetchEvents,
  fetchPoints,
  signOut,
  getPointsList,
  setUserInfo,
  setDeviceInfo
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
