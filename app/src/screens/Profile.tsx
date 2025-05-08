// import React, { Component } from 'react';
// import { View, StyleSheet } from 'react-native';
// import CustomCard from '../component/UI/Customcard/Card';
// import CheckBox from '../component/UI/CheckBox/CheckBox'
// import TermsCheckbox from '../component/UI/CheckBox/TermsCheckBox';
// import ChargeDropDownField from '../component/UI/DropDownInputField/ChargeDropDownField';
// export default class Profile extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         {/* Example usage of CustomCard */}
//         <CustomCard
//           title="Welcome to the Profile"
//           startDate="2025-01-23"
//           description="This is a sample description for the card component."
//           price="499"
//           percentage="25"
//           registeredMembersCount={15}
//           maxUsers={20}
//           buttonText="Edit Profile"
//           buttonAction={() => console.log('Edit Profile button clicked')}
//           mode="light" // You can toggle this between 'light' and 'dark'
//           showEditButton={true}
//         />
//         <CheckBox label={'Test'} checked={false} onChange={function (value: boolean): void {
//           throw new Error('Function not implemented.');
//         } }/>
//         <TermsCheckbox 
//   label="Agree to terms" 
//   checked={false} 
//   onClick={() => {
//     console.log('Checkbox terms clicked!'); 
//     // Add your logic here for when the terms link is clicked
//   }} 
//   onChange={(value: boolean) => {
//     return console.log('Checkbox checked:', value); 
//     // Update state or handle checkbox change here
//   }} 
//   error={''} // Or any error message if needed
// />
// {/* <ChargeDropDownField label={''} options={[]} values={[]} onCreateNew={function (newOption: any): void {
//           throw new Error('Function not implemented.');
//         } } setSelectedFeeType={function (values: any): void {
//           throw new Error('Function not implemented.');
//         } } setValue={function (name: string, value: any): void {
//           throw new Error('Function not implemented.');
//         } } readOnly={false} mode={''}/> */}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
// });