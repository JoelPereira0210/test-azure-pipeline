import { Box, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React from 'react'

type Props = {
    text: string;
    type: 'sender' | 'receiver';
    timeStamp: string;
    fullName: string;
    designation: string;
    mediaId: string | null;
    // ref: any
}

const Message = ({ text, type, timeStamp, fullName, designation, mediaId,
    // ref 
}: Props) => {
    console.log("TYPE", type)
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: `${type === 'sender' ? 'flex-end' : 'flex-start'}`,
            marginBottom: '10px'

        }}>
            <Box sx={{
                width: '100%',
                maxWidth: "340px",
                display: 'flex',
                flexDirection: 'column',
                // justifyItems: `${type === 'sender' ? 'flex-start' : 'flex-end'}`
                '@media(max-width:768px)': {
                    border: 'none',
                    maxWidth: 'unset',
                    width: '95%'
                },
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    '@media(max-width:768px)': {
                        alignItems: `${type === 'sender' ? 'flex-end' : 'flex-start'}`
                    },
                }}>
                    {type === 'sender' ? (null) : (<Typography marginBottom={1} color={'#8E92BC'} fontSize={12}>{fullName} &#40;{designation === 'societySuperAdmin' ? 'Admin' : designation}&#41;</Typography>)}
                    <Box sx={{
                        background: `${type === 'sender' ? '#465ff1' : 'transparent'}`,
                        maxWidth: "340px",
                        color: `${type === 'sender' ? 'var(--tw-text-dark-mainText)' : (`${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`)}`,
                        border: `1px solid ${type === 'sender' ? 'var(--tw-bg-light-bodyBackground)' : 'var(--tw-bg-light-bodyBackground)'}`,
                        borderRadius: `${type === 'sender' ? '10px 0px 10px 10px' : ' 0px 10px 10px 10px'}`,
                        boxShadow: '0px 1px 3px #546fff1a',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '10px',
                        wordBreak: 'break-word', // Ensure long words break to fit within the container
                        overflowWrap: 'break-word', // Alternative for word wrapping
                        '@media(max-width:768px)': {
                            border: 'none',
                            maxWidth: 'unset',
                            width: '95%',

                        },
                    }}>
                        {/* <img src="/images/audioFile.png" style={{ marginBottom: '10px' }} /> */}
                        <Typography variant='text8' sx={{
                            paddingTop: '5px'
                        }}>{text ? text : null}</Typography>
                    </Box>
                    <Typography color={'#8E92BC'} fontSize={12} sx={{
                        textAlign: 'end'
                    }}> {moment(timeStamp).calendar()}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Message
// import { Box, Typography } from '@mui/material';
// import moment from 'moment';
// import React from 'react'

// type Props = {
//     text: string;
//     type: 'sender' | 'receiver';
//     timeStamp: string;
//     fullName: string;
//     designation: string;
//     mediaId: string | null;
//     ref: any;
// }

// const Message = ({ text, type, timeStamp, fullName, designation, mediaId, ref }: Props) => {
//     return (
//         <Box ref={ref} sx={{
//             display: 'flex',
//             justifyContent: type === 'sender' ? 'flex-end' : 'flex-start',
//             marginBottom: '10px'
//         }}>
//             <Box sx={{
//                 maxWidth: '70%',
//                 padding: '10px',
//                 background: type === 'sender' ? '#d1f7c4' : '#f1f1f1',
//                 borderRadius: '10px',
//             }}>
//                 <Typography variant="body2" fontWeight="bold">{fullName} ({designation})</Typography>
//                 <Typography variant="body2">{text}</Typography>
//                 <Typography variant="caption" display="block" color="gray">{moment(timeStamp).format('h:mm A')}</Typography>
//             </Box>
//         </Box>
//     )
// }

// export default Message;
