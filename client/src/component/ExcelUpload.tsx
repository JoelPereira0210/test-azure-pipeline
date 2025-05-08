import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { read, utils } from 'xlsx';
interface Props {
    jsonData: any[]
    setJsonData: React.Dispatch<React.SetStateAction<any[]>>
    setShowTable: React.Dispatch<React.SetStateAction<boolean>>
    // Function to close the modal
}
const FileUpload = (props: Props) => {
    const isMobile = useMediaQuery('(max-width:640px)');
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the uploaded file
        if (!file) return;

        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        reader.onload = (e) => {
            const fileContent = e.target?.result;

            if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                // Handle Excel files (.xlsx, .xls)
                const workbook = read(fileContent, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Get the first sheet
                const sheet = workbook.Sheets[sheetName];
                let data = utils.sheet_to_json(sheet); // Convert sheet to JSON
                let uniqueDataMap: any = {}; // Object to store unique mobile numbers
                let uniqueData: any[] = []; // Array to store unique entries
                console.log("DDD", data)
                // Iterate through the file data
                data.forEach((item: any, index: number) => {
                    const mobileNumber = item["Mobile Number With Country Code"];
                    const firstName = item["First Name"];
                    const lastName = item["Last Name"];
                    console.log("firstName", firstName)
                    // Validation for duplicate mobile numbers
                    if (uniqueDataMap[mobileNumber]) {
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Duplicate mobile number'
                        });
                    } else if (firstName?.length < 3) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'First name should each be at least 3 characters'
                        });
                    }
                    else if (lastName?.length < 3) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Last name should each be at least 3 characters'
                        });
                    } else if (firstName === undefined) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'First name should each be at least 3 characters'
                        });
                    } else if (lastName === undefined) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Last name should each be at least 3 characters'
                        });
                    } else if (mobileNumber === undefined) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Enter valid Mobile Number'
                        });
                    }

                    else {
                        // If no issues, add to uniqueData and map
                        uniqueDataMap[mobileNumber] = true;

                        // Transform data to the desired structure
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: null
                        });
                    }
                });

                // Update jsonData with only the unique entries
                props?.setJsonData([...props.jsonData, ...uniqueData]);
                console.log("isMobile", isMobile)
                if (isMobile === true) {
                    props.setShowTable(true);
                }
            } else if (fileExtension === 'csv') {
                const workbook = read(fileContent, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                let data = utils.sheet_to_json(sheet); // Convert CSV to JSON
                let uniqueDataMap: any = {}; // Object to store unique mobile numbers
                let uniqueData: any[] = []; // Array to store unique entries

                // Iterate through the file data
                console.log("DDD", data)
                // Iterate through the file data
                data.forEach((item: any, index: number) => {
                    const mobileNumber = item["Mobile Number With Country Code"];
                    const firstName = item["First Name"];
                    const lastName = item["Last Name"];
                    console.log("firstName", firstName)
                    // Validation for duplicate mobile numbers
                    if (uniqueDataMap[mobileNumber]) {
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Duplicate mobile number'
                        });
                    } else if (firstName?.length < 3) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'First name should each be at least 3 characters'
                        });
                    }
                    else if (lastName?.length < 3) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Last name should each be at least 3 characters'
                        });
                    } else if (firstName === undefined) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'First name should each be at least 3 characters'
                        });
                    } else if (lastName === undefined) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Last name should each be at least 3 characters'
                        });
                    } else if (mobileNumber === undefined) {
                        // Validation for firstName and lastName length
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: 'Enter valid Mobile Number'
                        });
                    }

                    else {
                        // If no issues, add to uniqueData and map
                        uniqueDataMap[mobileNumber] = true;

                        // Transform data to the desired structure
                        uniqueData.push({
                            id: Math.floor(Math.random() * 100000), // Incremental ID
                            mobileNumber: item["Mobile Number With Country Code"],
                            firstName,
                            lastName,
                            error: null
                        });
                    }
                });

                // Update jsonData with only the unique entries
                props?.setJsonData([...props.jsonData, ...uniqueData]);
                console.log("isMobile", isMobile)
                if (isMobile === true) {
                    props.setShowTable(true);
                }
            } else {
                alert('Unsupported file format. Please upload a .xlsx, .xls, or .csv file.');
            }
        };

        reader.readAsBinaryString(file); // Read the file as binary string
    };




    return (
        <div>
            <label htmlFor="file-upload" className="uploadButton">
                <Button sx={{
                    width: '100%',
                    height: '100%',

                    // '@media (max-width: 640px)': {
                    //     maxWidth: 110,
                    //     fontSize: 13,
                    //     height: 35,
                    // }
                }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <Typography variant='text8' fontWeight={600} sx={{
                        color: 'var(--tw-bg-light-sidebar)',
                        fontSize: '13px!important',
                        textAlign: 'center',
                        width: '100%'
                    }}>Upload CSV</Typography>
                </Button>
                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    style={{ display: 'none' }}  // Hide the input element
                    onChange={handleFileUpload}
                />
            </label>

        </div>
    );
};

export default FileUpload;
