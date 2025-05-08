// "use client";
// import { io } from 'socket.io-client'
// export const socket = io('http://localhost:9000', {
//     path: '/api/chat/socket.io',
//     withCredentials: true,
// });




"use client";
import { io } from 'socket.io-client'
export const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
    path: '/chat/socket.io',
    withCredentials: true,
});
