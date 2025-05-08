// import React from 'react';
// import { Box, Card, Typography, IconButton } from '@mui/material';
// import GroupsIcon from '@mui/icons-material/Groups';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import { useTheme } from '@mui/material/styles';
// import dayjs from 'dayjs';
// import parse from 'html-react-parser';

// const EventCard = ({ event, isAdmin, onRegister, onViewDetails, onMenuOpen }) => {
//   const theme = useTheme();
//   const mode = theme.palette.mode;

//   const formatTime = (timeString) => {
//     const time = new Date(timeString);
//     let hours = time.getUTCHours();
//     const minutes = String(time.getUTCMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     return `${hours}:${minutes} ${ampm}`;
//   };

//   return (
//     <Card
//       sx={{
//         padding: '16px',
//         border: '1px solid',
//         borderColor: `${
//           mode === 'light'
//             ? 'var(--tw-text-light-mainText)'
//             : 'var(--tw-text-dark-mainText)'
//         }`,
//         borderRadius: '8px',
//         position: 'relative',
//         backgroundColor: `${
//           mode === 'light'
//             ? 'var(--tw-bg-light-sidebar)'
//             : 'var(--tw-bg-dark-background)'
//         }`,
//         boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
//         marginRight: { xs: 'auto', sm: 'auto', md: '13%', lg: '13%' },
//         width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' },
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <Box>
//           <Typography
//             variant="text2"
//             sx={{
//               color: `${
//                 mode === 'light'
//                   ? 'var(--tw-text-light-mainText)'
//                   : 'var(--tw-text-dark-mainText)'
//               }`,
//             }}
//           >
//             {event.eventName}
//           </Typography>
//           <br />
//           <Typography
//             variant="text6"
//             sx={{
//               color: `${
//                 mode === 'light'
//                   ? 'var(--tw-text-light-mainText)'
//                   : 'var(--tw-text-dark-mainText)'
//               }`,
//             }}
//           >
//             {dayjs(event.eventStartDate).format('D MMM YYYY')}, {formatTime(event.eventStartTime)}
//           </Typography>
//         </Box>
//         <Typography
//           variant="text2"
//           sx={{
//             color: event.eventType.eventType === 'free' ? 'green' : 'red',
//           }}
//         >
//           {event.eventType.eventType === 'free' ? 'Free' : `₹ ${event.amount}`}
//         </Typography>
//       </Box>

//       <Typography
//         variant="text8"
//         sx={{
//           color: `${
//             mode === 'light'
//               ? 'var(--tw-text-light-mainText)'
//               : 'var(--tw-text-dark-mainText)'
//           }`,
//           wordBreak:"break-word"
//         }}
//       >
//         {event.eventDescription.length > 80
//                   ? parse(`${event.eventDescription.substring(0, 80)}...`)
//                   : parse(event.eventDescription)}
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <GroupsIcon color="primary" fontSize="large" />
//           <Typography
//             variant="text8"
//             sx={{
//               color: `${
//                 mode === 'light'
//                   ? 'var(--tw-text-light-mainText)'
//                   : 'var(--tw-text-dark-mainText)'
//               }`,
//             }}
//           >
//             &nbsp; {event.registeredMembersCount}/{event.maxPeopleAllowed}
//           </Typography>
//           {event.acceptDonation && (
//             <Typography
//               variant="text8"
//               sx={{
//                 color: 'var(--tw-text-light-yellowText)',
//                 marginLeft: '15px',
//                 whiteSpace: 'nowrap',
//               }}
//             >
//               Accept Donation
//             </Typography>
//           )}
//         </Box>
//         {isAdmin ? (
//           <IconButton
//             aria-label="more"
//             aria-controls="event-menu"
//             aria-haspopup="true"
//             onClick={(e) => onMenuOpen(e, event.eventId, event.eventName)}
//           >
//             <MoreHorizIcon fontSize="large" />
//           </IconButton>
//         ) : (
//           <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//             {event.registeredMembersCount === parseInt(event.maxPeopleAllowed) ? (
//               <Typography variant="text6" sx={{ color: 'red' }}>
//                 Registration Full
//               </Typography>
//             ) : event.hasPaid ? (
//               <Typography variant="text6">Registered</Typography>
//             ) : (
//               <Typography
//                 variant="text6"
//                 sx={{
//                   cursor: 'pointer',
//                   color: `${
//                     mode === 'light'
//                       ? 'var(--tw-text-light-mainText)'
//                       : 'var(--tw-text-dark-mainText)'
//                   }`,
//                 }}
//                 onClick={onRegister}
//               >
//                 Register
//               </Typography>
//             )}
//             <IconButton
//               onClick={onViewDetails}
//               sx={{
//                 color: `${
//                   mode === 'light'
//                     ? 'var(--tw-text-light-mainText)'
//                     : 'var(--tw-text-dark-mainText)'
//                 }`,
//               }}
//             >
//               <InfoOutlinedIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         )}
//       </Box>
//     </Card>
//   );
// };

// export default EventCard;


import React from 'react';
import { Box, Card, Typography, IconButton } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import parse from 'html-react-parser';

const EventCard = ({
  title,
  description,
  startDate,
  startTime,
  eventType,
  amount,
  registeredCount,
  maxCount,
  acceptDonation,
  hasPaid,
  isAdmin,
  onRegister,
  onViewDetails,
  onMenuOpen,
  id,
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    let hours = time.getUTCHours();
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <Card
      sx={{
        padding: '16px',
        border: '1px solid',
        borderColor: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: `${mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-dark-background)'}`,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        marginRight: { xs: 'auto', sm: 'auto', md: '13%', lg: '13%' },
        width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant="text2"
            sx={{ color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}` }}
          >
            {title}
          </Typography>
          <br />
          <Typography
            variant="text6"
            sx={{ color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}` }}
          >
            {dayjs(startDate).format('D MMM YYYY')}, {formatTime(startTime)}
          </Typography>
        </Box>
        <Typography
          variant="text2"
          sx={{
            color: eventType === 'free' ? 'green' : 'red',
          }}
        >
          {eventType === 'free' ? 'Free' : `₹ ${amount}`}
        </Typography>
      </Box>

      <Typography
        variant="text8"
        sx={{
          color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
          wordBreak: 'break-word',
        }}
      >
        {description.length > 80 ? parse(`${description.substring(0, 80)}...`) : parse(description)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupsIcon color="primary" fontSize="large" />
          <Typography
            variant="text8"
            sx={{ color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}` }}
          >
            &nbsp; {registeredCount}/{maxCount}
          </Typography>
          {acceptDonation && (
            <Typography
              variant="text8"
              sx={{
                color: 'var(--tw-text-light-yellowText)',
                marginLeft: '15px',
                whiteSpace: 'nowrap',
              }}
            >
              Accept Donation
            </Typography>
          )}
        </Box>
        {isAdmin ? (
          <IconButton
            aria-label="more"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={(e) => onMenuOpen(e, id, title)}
          >
            <MoreHorizIcon fontSize="large" />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {registeredCount === parseInt(maxCount) ? (
              <Typography variant="text6" sx={{ color: 'red' }}>
                Registration Full
              </Typography>
            ) : hasPaid ? (
              <Typography variant="text6">Registered</Typography>
            ) : (
              <Typography
                variant="text6"
                sx={{
                  cursor: 'pointer',
                  color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                }}
                onClick={onRegister}
              >
                Register
              </Typography>
            )}
            <IconButton
              onClick={onViewDetails}
              sx={{
                color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default EventCard;
