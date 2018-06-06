import React, { Component } from 'react';
import { 
    View,
    Text,
    StyleSheet
 } from 'react-native';

 import HTML from 'react-native-render-html'

 class BaiBao extends Component {
     test(){
        var ser='http://localhost/thuctap/wp-json/wp/v2/posts';
     }
     state = {  }
     render() {
         return (
             <View style={myStyle.baibao}>
                <Text style={myStyle.title}>{this.props.title}</Text>
                <HTML style={myStyle.content} html={ this.props.content } />
             </View>
         );
     }
 }
 
const myStyle=StyleSheet.create({
    title:{fontSize: 20, fontWeight: 'bold',marginTop:5},
    content:{},
    baibao:{borderBottomWidth: 1 }
});

 export default BaiBao;