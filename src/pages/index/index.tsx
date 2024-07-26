import { Component, PropsWithChildren } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
// import { getList } from "mock";
import Taro from "@tarojs/taro";
import { getList } from "mock";

export default class Index extends Component<PropsWithChildren> {
  componentDidMount() {
    getList()

  }

  componentWillUnmount() {}

  componentDidShow() {
    // Taro.request({url:"http://127.0.0.1:9000/list",method:"GET"}).then(res=>{
    //   console.log({res});
      
    // })
  }

  componentDidHide() {}

  render() {
    return (
      <View className="index">
        <Text>words!</Text>
      </View>
    );
  }
}
