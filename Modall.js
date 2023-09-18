// import Modal from 'react-native-simple-modal';
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//   } from 'react-native';

// export default class Modall extends React.Component {
//     state = { open: true }; //모달창의 열림여부를 판단해주는 상태변수를 만든다.
//     render() {
//         return (
//             //가장 큰 컨테이너
//             <View style={styles.container}>
//                 <TouchableOpacity onPress={() => this.setState({ open: true })}>
//                     <Text style={styles.buttontext}>얏호!</Text>
//                 </TouchableOpacity>
//                 <Modal //모달창
//                     offset={this.state.offset}
//                     open={this.state.open} //상태가 오픈이어야함.
//                     modalDidOpen={() => console.log('modal did open')} //모달이 열릴경우 콘솔창에 안내문을 띄운다.
//                     modalDidClose={() => this.setState({ open: false })} //모달창을 닫을 경우, 열림 여부를 변경시킨다.
//                     style={{ alignItems: 'center' }}>
//                     <View> //모달창에서 보여줄 화면 꾸미기
//                         <Text style={{ fontSize: 20 }}>모달창이요!</Text>
//                         <Text style={{ fontSize: 20 }}>너무 어려워요!</Text>
//                         <TouchableOpacity style={{ margin: 3 }} onPress={() => this.setState({ open: false })}> //누르면 모달창을 닫아주는 버튼
//                             <Text style={styles.text}>닫으시요</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </Modal>
//             </View>
//         );
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//       zIndex:3,
//       position:'absolute',
//       height:'100%',
//       width:'100%',
//       justifyContent:"center",
//       alignContent:"center",
//       alignItems:"center",
//       paddingTop: 50
//     },
//     buttontext:{
  
//       position:'relative',
//       left:170,
//       bottom:350,
//       fontSize:20,
//     },
//     text:{
//       position:'relative',
//       fontSize:15,
//       fontWeight:'700',
//       left:'40%',
//     }
  
//   })