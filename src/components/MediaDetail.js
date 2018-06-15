import React , {Component} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'


export default class MediaDetail extends Component{
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        let headerRight = (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => params.onAdd()}
            >
              <Image
                style={{ width: 32, height: 32 }}
                source={require("../image/ic_post.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => params.onLogout()}>
            <Image
                style={{ width: 32, height: 32, marginLeft:5,marginRight:15 }}
                source={require("../image/ic_logout.png")}
              />
            </TouchableOpacity>
          </View>
        );
        return { headerRight };
      };

    render(){
        return(
            <Text>day la chi tiet</Text>
        );
    }
}