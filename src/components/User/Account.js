import React, { Component } from 'react';
import { 
    Text, View, StyleSheet, TextInput, TouchableOpacity,
    Alert, ActivityIndicator, AsyncStorage, Image,
    ImageBackground } from 'react-native';
class Account extends Component {
    render() {
        return (
            <ImageBackground style={{ flex: 1 }} source={require('../../image/background.png')}>
                <View style={myStyle.nen}>

                    <View style={{ height: 50, alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.loginNow();
                            }}
                        >
                            <Text style={myStyle.ctmBottom}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.loginNow();
                            }}
                        >
                            <Text style={myStyle.ctmBottom}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    {/* {this.state.isLoading && (
                        <ActivityIndicator size="large" color="white" />
                    )} */}
                </View>
            </ImageBackground>
        );
    }
}

export default Account;

const myStyle = StyleSheet.create({
    vText:{
      borderRadius: 40,
      paddingLeft: 10,
      paddingRight: 10,
      width: 240,
      alignItems: 'center',
      marginBottom: 15,
      flexDirection: 'row',
      backgroundColor: 'rgba(255,255,255,0.1)'
    },
    ctmBottom: {
        margin: 10,
      borderRadius: 40,
      fontSize: 20,
      //color: "#36BC63",
      color: "#A0522D",
      paddingTop: 10,
      paddingLeft: 10,
      paddingBottom: 10,
      paddingRight: 10,
      backgroundColor: "white",
      textAlign: "center",
      width: 240
    },
    ctmInput: {
      backgroundColor: "rgba(255,255,255,0)",
      fontSize: 20,
      flex:1,
      paddingLeft: 10,
      paddingRight: 10,
      color: "white"
    },
    nen: {
        justifyContent: 'center',
      flex: 1,
      //backgroundColor: "#36BC63"
    },
    header: {
      fontSize: 30,
      textAlign: "center",
      color: "white",
      marginBottom: 30
    },
  
    khungDangNhap: {
      flex: 0.4,
      height: 100,
      flexDirection: "row",
      justifyContent: "center"
    }
  });
  