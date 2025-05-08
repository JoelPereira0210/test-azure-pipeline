// import { Box, Typography } from '@mui/material';
// import React, { useState, useEffect } from 'react';
// import Message from './Message';
// import { useUser } from '@/src/component/context/UserContext';
// import { ClipLoader } from 'react-spinners';
// import useIntersectionObserver from '../../customHooks/useIntersectionObserver';

// type Message = {
//     messageId: string;
//     societyId: string;
//     userId: string;
//     message: string;
//     timeStamp: string;
//     mediaId: string | null;
//     isDeleted: boolean;
//     fullName: string;
//     designation: string;
// };

// type Props = {
//     allMessages: Message[];
//     // loading: boolean;
//     // getChats: () => Promise<void>;  // Assuming getChats returns a promise
//     // hasMore: boolean;
// };
// const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//   };

//   const groupMessagesByDate = (messages: Message[]) => {
//     return messages.reduce((acc: { [key: string]: Message[] }, message) => {
//       const date = formatDate(message.timeStamp);
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(message);
//       return acc;
//     }, {});
//   };


// const ChatHistory = ({
//     allMessages,
//     //  loading, 
//     //  getChats, 
//     //  hasMore 
// }: Props) => {
//     const { user } = useUser();
//     const [isFetching, setIsFetching] = useState(false);

//     // Add logging for debugging
//     useEffect(() => {
//         console.log('ChatHistory mounted');
//     }, []);
//     const sortedMessages = allMessages.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

//   // Group messages by date
//   const groupedMessages = groupMessagesByDate(sortedMessages);
//     console.log("sortedMessages", sortedMessages)
//     return (
//         <Box sx={{
//             // height: '70vh', // Ensure height is set
//             // overflowY: 'auto', // Allow vertical scrolling
//             // display: 'flex',
//             // flexDirection: 'column-reverse', // Make sure items are added from bottom
//         }}>
//             {/* Position the observer at the top */}

//             <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 position: 'absolute'
//             }}>
//                 {/* {loading && (
//                     <Box width={10} height={10}>
//                         <ClipLoader
//                             color={'black'}
//                             loading={loading}
//                             size={125}
//                             aria-label="Loading Spinner"
//                             data-testid="loader"
//                         />
//                     </Box>
//                 )} */}
//                 <Box sx={{
//                     background: "black",
//                     width: 'fit-content',
//                     padding: '8px',
//                     borderRadius: '10px',
//                 }}>
//                     <Typography fontWeight={600} color='#fff'>Today</Typography>
//                 </Box>
//             </Box>
//             {/* <div ref={topRef} style={{ width: '100%', height: '10px' }} /> */}
//             <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column-reverse'
//             }}>
//                 {allMessages.map((message, index) =>


//                     <Message
//                         key={message.messageId}
//                         text={message.message}
//                         type={user?.user?.userId === message.userId ? "sender" : "receiver"}
//                         timeStamp={message.timeStamp}
//                         fullName={message.fullName}
//                         designation={message.designation}
//                         mediaId={message.mediaId}
//                     // ref={topRef} // ref on the first message
//                     />


//                 )}
//             </Box>
//         </Box>
//     );
// };

// export default ChatHistory;


/* import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Message from './Message';
import { useUser } from '@/src/component/context/UserContext';
import moment from 'moment';

type Message = {
    messageId: string;
    societyId: string;
    userId: string;
    message: string;
    timeStamp: string;
    mediaId: string | null;
    isDeleted: boolean;
    fullName: string;
    designation: string;
};

type Props = {
    allMessages: Message[];
};

// const formatDate = (timestamp: string) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
// };
const formatDate = (timeStamp: string) => {
    const messageDate = moment(timeStamp);

    if (messageDate.isSame(moment(), 'day')) {
        return "Today";
    }
    if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) {
        return "Yesterday";
    }

    // If it's not today or yesterday, return the formatted date (e.g., 'MMM dd, yyyy')
    return messageDate.format('MMM DD, YYYY');
};

const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce((acc: { [key: string]: Message[] }, message) => {
        const date = formatDate(message.timeStamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
        return acc;
    }, {});
};

const ChatHistory = ({ allMessages }: Props) => {
    const { user } = useUser();

    useEffect(() => {
        console.log('ChatHistory mounted');
    }, []);
    console.log("user", user)
    console.log("allMessages", allMessages)
    // Sort messages by timeStamp
    const sortedMessages = allMessages.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

    // Group messages by date
    const groupedMessages = groupMessagesByDate(sortedMessages);

    return (
        <Box sx={{
            display: 'flex',
            // flexDirection: 'column-reverse', 
            flexDirection: 'column',
            overflowY: 'auto'
        }}>
            {Object.entries(groupedMessages).map(([date, messages]) => (
                <Box key={date} sx={{ marginBottom: '16px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                        <Box
                            sx={{
                                background: 'black',
                                width: 'fit-content',
                                padding: '8px',
                                borderRadius: '10px',
                            }}
                        >
                            <Typography fontWeight={600} color="#fff">{date}</Typography>
                        </Box>
                    </Box>
                    {messages.map((message) => (
                        <Message
                            key={message.messageId}
                            text={message.message}
                            type={user?.userId === message.userId ? 'sender' : 'receiver'}
                            timeStamp={message.timeStamp}
                            fullName={message.fullName}
                            designation={message.designation}
                            mediaId={message.mediaId}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
};

export default ChatHistory;
 */

import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Message from './Message';
import { useUser } from '@/src/component/context/UserContext';
import moment from 'moment';

type Message = {
    messageId: string;
    societyId: string;
    userId: string;
    message: string;
    timeStamp: string;
    mediaId: string | null;
    isDeleted: boolean;
    fullName: string;
    designation: string;
};

type Props = {
    allMessages: Message[];
    disabled: boolean
};

const formatDate = (timeStamp: string) => {
    const messageDate = moment(timeStamp);

    if (messageDate.isSame(moment(), 'day')) return "Today";
    if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) return "Yesterday";

    return messageDate.format('MMM DD, YYYY');
};

const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce((acc: { [key: string]: Message[] }, message) => {
        const date = formatDate(message.timeStamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
        return acc;
    }, {});
};

const ChatHistory = ({ allMessages, disabled }: Props) => {
    const { user } = useUser();

    useEffect(() => {
        console.log('ChatHistory mounted');
    }, []);

    console.log("user", user);
    console.log("allMessages", allMessages);

    // Sort messages by timeStamp
    const sortedMessages = allMessages.sort(
        (a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );

    // Group messages by date
    const groupedMessages = groupMessagesByDate(sortedMessages);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%', // Ensures it fits container height
                justifyContent: allMessages.length === 0 ? 'center' : 'flex-start',
                alignItems: allMessages.length === 0 ? 'center' : 'stretch',
                // backgroundColor: '#f9f9f9',
                padding: '8px',
            }}
        >
            {/* Show "No messages" if the list is empty */}
            {allMessages.length === 0 && !disabled ? (
                <Typography variant="h6" color="textSecondary">
                    No messages found. Start chatting!
                </Typography>
            ) : (
                Object.entries(groupedMessages).map(([date, messages]) => (
                    <Box key={date} sx={{ marginBottom: '16px' }}>
                        {/* Date Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                            <Box
                                sx={{
                                    background: 'black',
                                    width: 'fit-content',
                                    padding: '8px',
                                    borderRadius: '10px',
                                }}
                            >
                                <Typography fontWeight={600} color="#fff">
                                    {date}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Messages */}
                        {messages.map((message) => (
                            <Message
                                key={message.messageId}
                                text={message.message}
                                type={user?.userId === message.userId ? 'sender' : 'receiver'}
                                timeStamp={message.timeStamp}
                                fullName={message.fullName}
                                designation={message.designation}
                                mediaId={message.mediaId}
                            />
                        ))}
                    </Box>
                ))
            )}
        </Box>
    );
};

export default ChatHistory;