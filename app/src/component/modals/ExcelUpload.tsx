// File: src/components/ExcelUpload.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import { useTheme } from '../../../theme/themeProvider';
import ButtonInput from '../UI/Button/Button';


interface Props {
  jsonData: any[];
  setJsonData: React.Dispatch<React.SetStateAction<any[]>>;
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExcelUpload = (props: Props) => {
  const { theme } = useTheme();

  const handleFileUpload = async () => {
    try {
      // Pick a single file using the new API
      const [result] = await pick({
        type: [types.allFiles], // Adjust file types as needed
      });
      
      // Make a local copy of the file to improve responsiveness
      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: result.uri,
            fileName: result.name ?? 'fallbackName',
          },
        ],
        destination: 'documentDirectory',
      });

      // Read the file content as base64 using RNFS
      if (localCopy.status === 'error') {
        throw new Error(localCopy.copyError);
      }
      const fileUri = localCopy.localUri;
      const b64 = await RNFS.readFile(fileUri, 'base64');

      // Parse the workbook from base64 data
      const workbook = XLSX.read(b64, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Process and validate data (similar to the web version)
      let uniqueDataMap: any = {};
      let uniqueData: any[] = [];

      data.forEach((item: any) => {
        const mobileNumber = item["Mobile Number With Country Code"];
        const firstName = item["First Name"];
        const lastName = item["Last Name"];

        if (uniqueDataMap[mobileNumber]) {
          uniqueData.push({
            id: Math.floor(Math.random() * 100000),
            mobileNumber,
            firstName,
            lastName,
            error: 'Duplicate mobile number',
          });
        } else if (!firstName || firstName.length < 3) {
          uniqueData.push({
            id: Math.floor(Math.random() * 100000),
            mobileNumber,
            firstName,
            lastName,
            error: 'First name should be at least 3 characters',
          });
        } else if (!lastName || lastName.length < 3) {
          uniqueData.push({
            id: Math.floor(Math.random() * 100000),
            mobileNumber,
            firstName,
            lastName,
            error: 'Last name should be at least 3 characters',
          });
        } else if (!mobileNumber) {
          uniqueData.push({
            id: Math.floor(Math.random() * 100000),
            mobileNumber,
            firstName,
            lastName,
            error: 'Enter valid Mobile Number',
          });
        } else {
          uniqueDataMap[mobileNumber] = true;
          uniqueData.push({
            id: Math.floor(Math.random() * 100000),
            mobileNumber,
            firstName,
            lastName,
            error: null,
          });
        }
      });

      // Append new entries to the existing jsonData state
    //   props.setJsonData([...props.jsonData, ...uniqueData]);
    props.setJsonData(prevData => [...prevData, ...uniqueData]);

      props.setShowTable(true);
    } catch (err: any) {
      if (err.code === 'DOCUMENT_PICKER_CANCELED') {
        // User cancelled the picker, do nothing
      } else {
        console.error('Excel upload error:', err);
      }
    }
  };

  return (
    <View>
        <ButtonInput text="Upload CSV" onPress={handleFileUpload} width={150} fontSize={14}/>
    </View>
 
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    alignItems: 'flex-start',
  },
});

export default ExcelUpload;
