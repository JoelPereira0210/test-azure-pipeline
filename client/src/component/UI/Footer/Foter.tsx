// import React, { useState, useEffect, useContext } from 'react';
// import { decryptValue } from '@/src/utils/encryptiondecryption';
// import { getSocietyAction } from '@/src/actions/society';
// import { Box, Typography } from '@mui/material';
// import { MoreDetailsContext } from '../../context/MoreDetails';
// import { useRouter } from 'next/navigation';



// const truncateTextWithTwoLines = (text) => {
//   if (!text) return 'N/A';
//   const words = text.split(' ');
//   return words.length > 6 ? words.slice(0, 5).join(' ') + '...' : text;
// };

// export const Footer = () => {
//   const [societyData, setSocietyData] = useState(null);
//   const { showMoreDetails, toggleDetails, setShowMoreDetails } =
//     useContext(MoreDetailsContext);
//   const router = useRouter();
//   useEffect(() => {
//     const encryptedId = localStorage.getItem('societyId');
//     const societyID = decryptValue(encryptedId);
//     const getSociety = async () => {
//       try {
//         const values = await getSocietyAction(societyID);
//         setSocietyData(values.data.society);
//         console.log('VALUES EFFECT', values);
//       } catch (error) {
//         console.error('Error fetching society details:', error);
//       }
//     };

//     if (societyID) {
//       getSociety();
//     }
//   }, []);

//   const handleMoreDetailsClick = () => {
//     // setShowMoreDetails(true)
//     // Navigate to /profile when "More Details" is clicked
//     router.push('/profile');

//     toggleDetails(); // Optionally toggle the context here if needed
//   };
//   console.log('showMoreDetails:', showMoreDetails);
//   console.log('society Data in footer', societyData);

//   return (
//     <Box
//       component="footer"
//       sx={{
//         position: 'fixed',
//         bottom: 0,
//         left: { xs: 0, md: '250px' }, // Adjust for sidebar width on larger screens
//         width: { xs: '100%', md: 'calc(100% - 250px)' }, // Reduce width based on sidebar
//         backgroundColor: '#465FF1',
//         color: '#FFFFFF',
//         textAlign: 'center',
//         padding: '1rem',
//         boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
//         display: 'flex',
//         justifyContent: 'space-evenly', // Ensure equal spacing
//         alignItems: 'center',
//         flexWrap: 'wrap',
//         zIndex: 1000,
//         transition: 'all 0.3s ease', // Smooth transition for layout changes
//       }}
//     >
//       <Typography
//         variant="body2"
//         sx={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           justifyContent: 'space-evenly', // Distribute space evenly
//           alignItems: 'center',
//           width: '100%',
//           textAlign: 'center',
//           whiteSpace: 'pre-wrap', // Preserve line breaks
//         }}
//       >
//         {/* <span
//             style={{
//               fontWeight: 700,
//               fontSize: '17px',
//               wordWrap: 'break-word',
//               flexGrow: 1,
//               textAlign: 'center',
//             }}
//           >
//             {truncateTextWithTwoLines(societyData?.societyName, 20)}
//           </span> */}
//         <Typography
//           variant="body2"
//           sx={{
//             fontWeight: 300,
//             // fontSize: '16px',
//             fontSize: {
//               xs: '11px',
//               md: '16px',
//               sm: '11px',
//               lg: '16px',
//               xl: '16px',
//             },
//             wordWrap: 'break-word',
//             flexGrow: 1,
//             textAlign: 'center',
//           }}
//         >
//           {truncateTextWithTwoLines(societyData?.societyName, 20)}
//         </Typography>
//         <Box
//           sx={{
//             minHeight: '1rem',
//             borderLeft: '2px solid #000',
//             alignSelf: 'stretch',
//             marginX: '1rem', // Add horizontal spacing
//           }}
//         />
//         {/* <span
//             style={{
//               fontWeight: 300,
//               fontSize: '16px',
//               wordWrap: 'break-word',
//               flexGrow: 1,
//               textAlign: 'center',
              
//             }}
//           >
//             {truncateTextWithTwoLines(societyData?.address, 20)}
//           </span> */}
//         <Typography
//           variant="body2"
//           sx={{
//             fontWeight: 300,
//             // fontSize: '16px',
//             fontSize: {
//               xs: '11px',
//               md: '16px',
//               sm: '11px',
//               lg: '16px',
//               xl: '16px',
//             },
//             wordWrap: 'break-word',
//             flexGrow: 1,
//             textAlign: {
//               xs: 'start',
//               md: 'center',
//               sm: 'start',
//               lg: 'center',
//               xl: 'center',
//             }, // Responsive text alignment
//           }}
//         >
//           {truncateTextWithTwoLines(societyData?.address)}
//         </Typography>

//         {}
//         <Box
//           sx={{
//             minHeight: '1rem',
//             display: { xs: 'none', md: 'block' },
//             borderLeft: '2px solid #000',
//             alignSelf: 'stretch',
//             marginX: '1rem', // Add horizontal spacing
//           }}
//         />
//         <Box
//           sx={{
//             position: 'relative',
//             flexGrow: 1,
//             display: 'flex',
//             // justifyContent: 'space-between',
//             justifyContent:{md:"space-between",lg:"center",xl:"center"},
//             alignItems: 'center',
            
//           }}
//         >
//           <Box
//             sx={{
//               display: {
//                 xs: 'none', // Extra-small screens (mobile)
//                 sm: 'none', // Small screens (landscape phones)
//                 md: 'flex', // Medium screens (tablets)
//                 lg: 'flex', // Large screens (desktops)
//                 xl: 'flex',
//               },
//             }}
//           >
//             <span
//               style={{
//                 fontWeight: 300,
//                 fontSize: '16px',
//                 wordWrap: 'break-word',
//               }}
//             >
//               {truncateTextWithTwoLines(societyData?.description)}
//             </span>
//           </Box>
//           {/* <a
//              onClick={handleMoreDetailsClick}
//               href="#"
//               style={{
//                 position: 'absolute',
//                 right: 0,
//                 // fontSize: '14px',
//                 fontSize: window.innerWidth < 600 ? '11px' : '14px',
//                 fontWeight: 500,
//                 color: '#FFFFFF',
//                 textDecoration: 'underline',
//               }}
//             >
//               More Details
//             </a> */}
//           <Box
//             component="a"
//             onClick={handleMoreDetailsClick}
//             href="#"
//             sx={{
//               position: 'absolute',
//               right: 0,
//               fontSize: {
//                 xs: '11px',
//                 md: '16px',
//                 sm: '11px',
//                 lg: '16px',
//                 xl: '16px',
//               },
//               fontWeight: 500,
//               color: '#FFFFFF',
//               textDecoration: 'underline',
//               whiteSpace: 'nowrap', // Prevent wrapping of text
//             }}
//           >
//             More Details
//           </Box>
//         </Box>
//       </Typography>
//     </Box>
//   );
// };


import React, { useState, useEffect, useContext } from 'react';
import { decryptValue } from '@/src/utils/encryptiondecryption';
import { getSocietyAction } from '@/src/actions/society';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { MoreDetailsContext } from '../../context/MoreDetails';
import { useRouter } from 'next/navigation';

const truncateTextWithTwoLines = (text, isMobile) => {
  if (!text) return 'N/A';
  const words = text.split(' ');
  return isMobile
    ? words.length > 2
      ? words.slice(0, 3).join(' ') + '...'
      : text
    : words.length > 3
    ? words.slice(0, 3).join(' ') + '...'
    : text;
};

export const Footer = () => {
  const [societyData, setSocietyData] = useState(null);
  const { showMoreDetails, toggleDetails, setShowMoreDetails } =
    useContext(MoreDetailsContext);
  const router = useRouter();

  const isMobile = useMediaQuery('(max-width:600px)'); // Define mobile view breakpoint

  useEffect(() => {
    const encryptedId = localStorage.getItem('societyId');
    const societyID = decryptValue(encryptedId);
    const getSociety = async () => {
      try {
        const values = await getSocietyAction(societyID);
        setSocietyData(values.data.society);
        console.log('VALUES EFFECT', values);
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };

    if (societyID) {
      getSociety();
    }
  }, []);

  const handleMoreDetailsClick = () => {
    router.push('/profile');
    toggleDetails();
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, md: '250px' },
        width: { xs: '100%', md: 'calc(100% - 250px)' },
        backgroundColor: '#465FF1',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '1rem',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 300,
            fontSize: { xs: '11px', md: '16px' },
            wordWrap: 'break-word',
            flexGrow: 1,
            textAlign: 'center',
          }}
        >
          {truncateTextWithTwoLines(societyData?.societyName, isMobile)}
        </Typography>
        <Box
          sx={{
            minHeight: '1rem',
            borderLeft: '2px solid #000',
            alignSelf: 'stretch',
            marginX: '1rem',
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 300,
            fontSize: { xs: '11px', md: '16px' },
            wordWrap: 'break-word',
            flexGrow: 1,
            textAlign: { xs: 'start', md: 'center' },
          }}
        >
          {truncateTextWithTwoLines(societyData?.address, isMobile)}
        </Typography>
        <Box
          sx={{
            minHeight: '1rem',
            display: { xs: 'none', md: 'block' },
            borderLeft: '2px solid #000',
            alignSelf: 'stretch',
            marginX: '1rem',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            justifyContent: { xs:'space-between',sm:'space-between',md: 'space-between', lg: 'space-between', xl: 'space-between' },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', sm:'none', md: 'flex' , lg: 'flex', xl: 'flex'},
            }}
          >
            <span
              style={{
                fontWeight: 300,
                fontSize: '16px',
                wordWrap: 'break-word',
              }}
            >
              {truncateTextWithTwoLines(societyData?.description, isMobile)}
            </span>
          </Box>
          <Box
            component="a"
            onClick={handleMoreDetailsClick}
            href="#"
            sx={{
              position: 'absolute',
              right: 0,
              fontSize: { xs: '11px', md: '16px' },
              fontWeight: 500,
              color: '#FFFFFF',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            More Details
          </Box>
        </Box>
      </Typography>
    </Box>
  );
};
