import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from "react-redux";

import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {Button , Toast} from '@ant-design/react-native';

import {delUser} from "../../actions"

const HomeScreen = (props) => {

  handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo')
      props.delUser()
    } catch(e) {
      console.log(e)
    } 
  }

  return (
    <View style={styles.container}>
      <Text>HELLO</Text>
      <TouchableOpacity
          onPress={handleLogout}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop:'30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  
})

const mapStateToProps = (state) =>{
    return {
        user: state.user,
        loading : state.loading
      }
}

const mapDispatchToProps=(dispatch)=>{
    return{
      setUser:(user)=>{
        dispatch(setUser(user))
      },
      delUser:()=>{
        dispatch(delUser())
      },
    
      }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)