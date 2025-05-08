import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import { AddMembersDataType as FormValues } from '@/src/lib/types/addMembers.types';
import InputField from '../UI/InputField/InputField';
import MobileInput from '../UI/MobileInput/MobileInput';
import { style } from '@/src/component/modals/modalStyle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { addMembersSchema } from '@/src/lib/zod/members';
import ExcelUpload from '../ExcelUpload';
import AddMemberTable from '../UI/Tables/AddMemberTable';
import { addMembersActions } from '@/src/actions/addMembers';
import toast from 'react-hot-toast';
import { useMediaQuery, useTheme } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface Props {
    modalButtonAdd?: string;
    modalButtonCancel?: string;
    open: boolean;
    onClose: () => void; // Function to close the modal
    jsonData: any[];
    setEditForm: React.Dispatch<any>;
    setSelectedEntries: React.Dispatch<React.SetStateAction<any[]>>
}

const ShowMembersTable = (props: Props) => {
    return (
        <>
            <Box onClick={() => {
                props.onClose()
            }}>
                <ArrowBackIcon sx={{
                    color: '#FFF',
                }} />
            </Box>
            <Box sx={{ ...style, maxWidth: 1200, height: 836, padding: '1% 2%' }}>

                {/* <AddMemberTable jsonData={props.jsonData} setEditForm={props.setEditForm} setSelectedEntries={props.setSelectedEntries} /> */}
            </Box>
        </>
    );
};

export default ShowMembersTable;
