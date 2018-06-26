import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Dimensions, TextInput, TouchableOpacity } from "react-native";
import Modal from "react-native-modalbox"

var screen = Dimensions.get('window');
export default class ModalComment extends Component {
      constructor(props) {
            super(props);
      }
      showModal = () => {
            this.refs.myModal.open();
      }
      render() {
            return (
                  <Modal
                        ref={"myModal"}
                        style={{
                              zIndex: 1,
                              justifyContent: "center",
                              borderRadius: 15,
                              shadowRadius: 10,
                              width: screen.width - 80,
                              height: 330
                        }}
                        position="center"
                        backdrop={true}
                        onClosed={() => {
                              //alert("Su kien dong modal")
                        }}
                  >
                        <View style={{ padding: 15 }}>
                              <Text style={{ marginBottom: 12, marginTop: 8, fontSize: 23, color: "mediumseagreen" }}>Bình luận</Text>
                              <TextInput
                                    placeholderTextColor="#cfcfcf"
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    style={myStyle.ctmInput}
                                    onChangeText={u => {
                                          this.setState({ user: u });
                                    }}
                                    placeholder="(*)Tên của bạn"
                              />
                              <TextInput
                                    placeholderTextColor="#cfcfcf"
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    style={myStyle.ctmInput}
                                    onChangeText={u => {
                                          this.setState({ user: u });
                                    }}
                                    placeholder="(*)Email của bạn"
                              />
                              <TextInput
                                    placeholderTextColor="#cfcfcf"
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                    multiline={true}
                                    style={myStyle.ctmInputContent}
                                    onChangeText={u => {
                                          this.setState({ user: u });
                                    }}
                                    placeholder="(*)Nội dung bình luận"
                              />
                              <View style={{ alignItems: "flex-end" }}>
                                    <TouchableOpacity style={myStyle.ctmBottom}>
                                          <Text style={{ color: "white", fontSize: 18 }}> Bình luận </Text>
                                    </TouchableOpacity>
                              </View>
                        </View>
                  </Modal>
            );
      }
}
const myStyle = StyleSheet.create({
      ctmBottom: {
            marginBottom: 10,
            marginTop: 3,
            borderRadius: 10,
            fontSize: 20,
            padding: 10,
            backgroundColor: "mediumseagreen",
            textAlign: "center",
      },
      ctmInputContent: {
            height: 100,
            backgroundColor: "#fafafa",
            fontSize: 18,
            paddingTop:1,
            paddingBottom:1,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
            marginBottom: 5
      },
      ctmInput: {
            backgroundColor: "#fafafa",
            fontSize: 18,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 10,
            marginBottom: 5
      },
});

