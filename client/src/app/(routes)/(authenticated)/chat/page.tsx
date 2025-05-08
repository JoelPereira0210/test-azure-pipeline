'use client'
import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { getChatsAction } from '@/src/actions/chat';
import ChatHistory from '@/src/component/UI/ChatComponents/ChatHistory';
import SendMessage from '@/src/component/UI/ChatComponents/SendMessage';
import { decryptValue } from '@/src/utils/encryptiondecryption';
// import { socket } from '@/src/socket';
import { Box, Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import Message from "@/src/component/UI/ChatComponents/Message";
import { useUser } from "@/src/component/context/UserContext";
import { ClipLoader } from "react-spinners";
import { MoreDetailsContext, MoreDetailsProvider } from "@/src/component/context/MoreDetails";
import { Footer } from "@/src/component/UI/Footer/Foter";
import Cookies from 'js-cookie';

type Props = {};
let socket: Socket;
const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
};

const Chat = () => {
    // Initial items
    const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
    const [customSocket, setCustomSocket] = useState<Socket | null>(null);
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const [societyId, setSocietyId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const scrollableDivRef = useRef(null); // Ref to the scrollable div
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { user } = useUser();
    // Function to fetch more data
    // const fetchMoreData = () => {
    //     setTimeout(() => {
    //         // Prepend new items to the list
    //         const newItems = Array.from({ length: 20 }, (_, i) => items[0] - (i + 1)); // Load previous items
    //         setItems((prevItems) => [...newItems, ...prevItems]);
    //     }, 1500);
    // };
    const [membershipStatus, setMembershipStatus] = useState('');


    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        // Check the `flow` value from localStorage and set state
        const role = localStorage.getItem('flow');
        setIsAdmin(role === 'admin');
        const membership = localStorage.getItem('membershipStatus');
        setMembershipStatus(membership);
    }, []);
/*     useEffect(() => {
        const token = localStorage.getItem('authToken');
        const encryptedSocietyId = localStorage.getItem('societyId')
        if (encryptedSocietyId) {
            const decryptedSocietyId = decryptValue(localStorage.getItem('societyId') || '');
            setSocietyId(decryptedSocietyId);
            console.log("decryptedSocietyId", decryptedSocietyId)
            socket = io('http://localhost:9000', {
                path: '/api/chat/socket.io',
                withCredentials: true,
                extraHeaders: {
                    'Authorization': `Bearer ${token || ''}`,
                },
            });
            setCustomSocket(socket);
            console.log("decryptedSocietyId", decryptedSocietyId)
            function onConnect() {
                socket.emit('joinRoom', decryptedSocietyId);
            }

            socket.on('connect', onConnect);

            socket.on('message', (newMessage) => {
                // setAllMessages((prevMessages) => [...prevMessages, newMessage]);
                setAllMessages((prevMessages) =>
                    [newMessage, ...prevMessages]// Prepend the new message
                );
            });

            return () => {
                socket.off('connect');
                socket.disconnect();
            };
        }
    }, []); */
  
    useEffect(() => {
        const token = Cookies.get('authToken');
        if (!token) {
            console.error("Auth token not found in cookies.");
            return;
        }
    
        const encryptedSocietyId = localStorage.getItem('societyId');
        if (!encryptedSocietyId) {
            console.error("Society ID not found in localStorage.");
            return;
        }
    
        const decryptedSocietyId = decryptValue(encryptedSocietyId);
        setSocietyId(decryptedSocietyId);
        console.log("decryptedSocietyId", decryptedSocietyId);
    
        const socket =  io(`${process.env.NEXT_PUBLIC_BASE_URL}`,{
            path: '/chat/socket.io',
            withCredentials: true,
            extraHeaders: {
                'Authorization': `Bearer ${token}`,
            },
        });
    
        setCustomSocket(socket);
    
        function onConnect() {
            socket.emit('joinRoom', decryptedSocietyId);
        }
    
        socket.on('connect', onConnect);
    
        socket.on('message', (newMessage) => {
            setAllMessages((prevMessages) => [newMessage, ...prevMessages]); // Prepend the new message
        });
    
        socket.on('connect_error', (error) => {
            console.error("Socket connection error:", error);
        });
    
        socket.on('disconnect', (reason) => {
            console.log("Socket disconnected:", reason);
        });
    
        return () => {
            socket.off('connect');
            socket.disconnect();
            console.log("Socket connection closed.");
        };
    }, []);
    useEffect(() => {
        if (societyId) {
            getChats();
        }
    }, [societyId]);
    const getChats = async () => {
        if (societyId && hasMore) {
            setLoading(true);
            const response = await getChatsAction(societyId, page);
            if (response.status === 200) {
                const newMessages = response.data;
                console.log("new", newMessages)
                setAllMessages((prevMessages) => [...prevMessages, ...newMessages,]);
                setHasMore(newMessages.length > 0);  // Disable infinite scroll if no more messages
                setPage(page + 1);
            }
            setLoading(false);
        }
    };
    // Scroll to the bottom when the component mounts
    useEffect(() => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
        }
    }, []);
    console.log("allMessage", allMessages)
    console.log("reverse", allMessages.reverse())
    return (
        <>
        <MoreDetailsProvider>
        <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
        }}>
            <Box sx={{
                width: 'calc(100% - 240px)',
                '@media (max-width:767px)': {
                    width: '100%',
                },
                marginBottom:"3%"
            }}>
                <Box sx={{
                    border: '1px solid #A2A1A833',
                    // height: 'calc(100vh - 50px)',
                    borderRadius: '20px',
                    /* borderBottomLeftRadius: '0',
                    borderBottomRightRadius: '0', */
                    padding: '5px 20px 20px',
                    '@media(max-width:768px)': {
                        border: 'none',
                        width: '100%',
                        padding: 0
                    },
                }}>
                    <div
                        id="scrollableDiv"
                        ref={scrollableDivRef} // Reference to the scrollable div
                        style={{ height: "67vh", overflow: "auto", display: "flex", flexDirection: "column-reverse" }}
                    >
                        <InfiniteScroll
                            dataLength={allMessages.length} // Length of items
                            next={getChats} // Function to fetch more items
                            hasMore={true} // Keep loading more items
                            inverse={true} // Enable reverse scroll
                            loader={false} // Loader when fetching data
                            scrollableTarget="scrollableDiv" // Target the scrollable div
                        >
                            {loading && (
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <ClipLoader
                                        color={'black'}
                                        loading={!loading}
                                        size={100}
                                    // aria-label="Loading Spinner"
                                    // data-testid="loader"
                                    />
                                </Box>
                            )}

                            <ChatHistory allMessages={allMessages} disabled={!isAdmin && membershipStatus === 'unpaid'} />
                            {/* {allMessages.map((message, index) => (
                        // <div style={style} key={index}>
                        //     div - #{item.message}
                        // </div>
                        <Message
                            key={message.messageId}
                            text={message.message}
                            type={user?.user?.userId === message.userId ? "sender" : "receiver"}
                            timeStamp={message.timeStamp}
                            fullName={message.fullName}
                            designation={message.designation}
                            mediaId={message.mediaId}
                        />
                    ))} */}
                        </InfiniteScroll>
                    </div>
                </Box>
                <SendMessage socket={customSocket} disabled={!isAdmin && membershipStatus === 'unpaid'} />
            </Box>
        </Box><Footer/>
        </MoreDetailsProvider>
        </>
    );
};

export default Chat;
