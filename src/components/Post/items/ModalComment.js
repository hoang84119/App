import React, { Component } from "react";
import { View, Text, Image, Dimensions } from "react-native";
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
                              justifyContent: "center",
                              borderRadius: 20,
                              shadowRadius: 10,
                              width: screen.width - 80,
                              height: 300
                        }}
                        position="center"
                        backdrop={true}
                        onClosed={() => {
                              //alert("Su kien dong modal")
                        }}
                  >
                  <View style={{padding: 10}}>
                        <Text style={{fontSize: 25, color: "mediumseagreen"}}>Bình luận</Text>
                  </View>
                  </Modal>
            );
      }
}
