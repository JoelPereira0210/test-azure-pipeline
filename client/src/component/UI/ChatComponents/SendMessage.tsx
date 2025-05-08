/* import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Input, useMediaQuery, Button, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Socket } from 'socket.io-client';
import { decryptValue } from '@/src/utils/encryptiondecryption';
import Image from 'next/image';
import FileUpload from '../FileUpload/FileUpload';
// import { socket } from '@/src/socket';
type Props = {
    socket: Socket
    disabled?: boolean;
    // sendChat: () => {

    // }
}

const SendMessage = ({ socket, disabled }: Props) => {
    const isMobile = useMediaQuery('(max-width:768px)');
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState(null)
    const [mediaErrors, setMediaErrors] = useState<string | null>(null);
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    let societyId = localStorage.getItem('societyId')
    societyId = decryptValue(societyId)
    console.log("societyId", societyId)
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        //   resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });
    console.log("SOCKET", socket) */
/*     const onSubmit = async (data: any) => {
        if (!data.message) return;
        console.log('DATAass');
        data.societyId = societyId
        console.log('DATA', data);
        socket.emit('sendMessage', data)
        reset({
            message: ''
        });
    }; */
/*  const onSubmit = async (data: any) => {
     // Trim the message to remove spaces at the start and end, and check if it's empty
     if (!data.message.trim()) {
         // You can set an error message here or handle it in another way
         setMediaErrors('Message cannot be empty or just spaces.');
         return;
     }
 
     // Clear any previous error messages
     setMediaErrors(null);
 
     // Add societyId to the data
     data.societyId = societyId;
 
     // Log the data to check the values
     console.log('DATA', data);
 
     // Emit the message via socket
     socket.emit('sendMessage', data);
 
     // Reset the form after submission
     reset({
         message: ''
     });
 };
 console.log("Files", files)
 return (
     <form
         onSubmit={handleSubmit(onSubmit)}
         style={{
             width: !isMobile ? 'calc(100% - 20px)' : '100%',
             maxHeight: '44px',
             display: 'flex',
             flexDirection: 'column',
             marginTop: '10px',
             ...(!isLargeScreen && {
                 padding: !isMobile ? '0 20px' : '0',
             }),

         }}
     >
         <Box
             sx={{
                 // marginBottom: '110px',
                 display: 'flex',
                 maxHeight: '44px',
             }}
         >
             <Controller
                 name="message"
                 control={control}
                 rules={{ required: true }}
                 render={({ field }) => (
                     <TextField
                         {...field}
                         // label="Message"
                         // placeholder='Send Your Message...'
                         placeholder={disabled ? "Activate your membership to enable chat." : "Send Your Message..."}
                         multiline
                         // rows={4}
                         disabled={disabled} 
                         fullWidth
                         error={!!errors.message}
                         sx={{
                             '.MuiInputBase-root': {
                                 border: 'none',
                             },
                             'fieldset': {
                                 border: 'none'
                             }
                         }}
                     />
                 )}
             />
             {!disabled && (
             <Box sx={{
                 display: 'flex',
                 alignItems: 'center'
             }}>
                 <FileUpload setFiles={setFiles} setError={setMediaErrors} />
                 <Button type='submit'><img src="/images/sendIcon.png" width={44} height={44} alt='send' /></Button>
             </Box>
             )}
         </Box>
         {mediaErrors ? <Typography variant='text4' color={'var(--tw-text-light-redText)'}>{mediaErrors}</Typography> : null}
     </form>
 )
}

export default SendMessage
*/

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, useMediaQuery, Button, TextField, Typography } from '@mui/material';
import { Socket } from 'socket.io-client';
import { decryptValue } from '@/src/utils/encryptiondecryption';
import FileUpload from '../FileUpload/FileUpload';

type Props = {
    socket: Socket;
    disabled: boolean
};

const SendMessage = ({ socket, disabled }: Props) => {
    const isMobile = useMediaQuery('(max-width:768px)');
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState(null);
    const [mediaErrors, setMediaErrors] = useState<string | null>(null);
    const [societyId, setSocietyId] = useState<string | null>(null);

    // Try-catch block for decrypting societyId
    React.useEffect(() => {
        try {
            const storedSocietyId = localStorage.getItem('societyId');
            if (!storedSocietyId) throw new Error('Society ID not found in localStorage.');

            const decryptedSocietyId = decryptValue(storedSocietyId);
            if (!decryptedSocietyId) throw new Error('Decrypted Society ID is null or invalid.');

            setSocietyId(decryptedSocietyId);
        } catch (error) {
            console.error('Error decrypting societyId:', error);
            setMediaErrors('Failed to retrieve Society ID. Please try again.');
        }
    }, []);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
    });

    const onSubmit = async (data: any) => {
        if (!societyId) {
            setMediaErrors('Society ID is missing. Cannot send message.');
            return;
        }

        if (!data.message.trim()) {
            setMediaErrors('Message cannot be empty or just spaces.');
            return;
        }

        setMediaErrors(null);

        data.societyId = societyId;
        console.log('DATA', data);

        socket.emit('sendMessage', data);
        reset({ message: '' });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                width: !isMobile ? 'calc(100% - 20px)' : '100%',
                maxHeight: '44px',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
                ...(!isLargeScreen && {
                    padding: !isMobile ? '0 20px' : '0',
                }),
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    maxHeight: '44px',
                }}
            >
                <Controller
                    name="message"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            placeholder={disabled ? "Activate Your membership to enable chat" : "Send Your Message..."}
                            multiline
                            fullWidth
                            disabled={disabled}
                            error={!!errors.message}
                            minRows={1} // Minimum rows for the TextField
                            maxRows={5} // Maximum rows for the TextField
                            sx={{
                                '.MuiInputBase-root': { border: 'none' },
                                fieldset: { border: 'none' },
                            }}
                        />
                    )}
                />
                {!disabled && <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FileUpload setFiles={setFiles} setError={setMediaErrors} />
                    <Button type="submit">
                        <img src="/images/sendIcon.png" width={44} height={44} alt="send" />
                    </Button>
                </Box>}
            </Box>
            {mediaErrors ? (
                <Typography variant="text4" color="var(--tw-text-light-redText)">
                    {mediaErrors}
                </Typography>
            ) : null}
        </form>
    );
};

export default SendMessage;




