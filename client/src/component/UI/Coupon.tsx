// // import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
// // import React from 'react'
// // import DoneIcon from '@mui/icons-material/Done';
// // import ButtonInput from './Button/Button';
// // type Props = {
// //     buttonText: string;
// //     buttonAction: () => void;
// //     couponName: string;
// //     couponCode: string;
// //     couponDescription: string;
// //     maxUses: string;
// //     percentage: string;
// //     societyId: string;
// //     expiryDate: Date;
// // }

// // const Coupon = ({
// //     buttonText,
// //     buttonAction,
// //     couponName,
// //     couponCode,expiryDate,
// //     couponDescription,
// //     maxUses,
// //     percentage,

// // }: Props) => {
// //     return (
// //         <Box sx={{
// //             // padding: '35px',
// //             width: '300px',
// //             height: '124px',
// //             borderRadius: "12px",
// //             background: "#303030",
// //             gap: "10px",
// //             display: 'flex',
// //             justifyContent: 'center',
// //             alignItems: 'center'
// //             // boxShadow: "-30px 6px 70px 0px rgba(0, 0, 0, 0.20)",
// //             // boxShadow: "-30px 6px 70px 0px rgba(0, 0, 0, 0.20)",
// //             // '@media(max-width:768px)': {
// //             //     width: '100%',
// //             // },
// //         }}
// //             onClick={buttonAction}
// //         >
// //             <Box>
// //                 <img src='/images/percentage.png' width={84} height={84} />
// //             </Box>
// //             <Box sx={{
// //                 display: 'flex',
// //                 flexDirection: 'column'
// //             }}>
// //                 <Typography className='textContain' variant="text1" color="white">{couponName}</Typography>
// //                 <Typography className="textContain" variant="text3" color="white">{couponCode}</Typography>
// //             </Box>
// //         </Box>
// //     )
// // }

// // export default Coupon



// 'use client';
// import { Box, Typography, IconButton, Menu, MenuItem, Card } from '@mui/material';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import dayjs from 'dayjs';
// import parse from 'html-react-parser';
// import GroupsIcon from '@mui/icons-material/Groups';
// import { useTheme } from '@mui/material';
// import { useState } from 'react';

// const Coupon = ({
//   couponName,
//   couponCode,
//   maxUses,
//   discountPercentage,
//   couponDescription,
//   societyId,
//   expiryDate,
//   buttonText,
//   buttonAction,
// }) => {
//   const theme = useTheme();
//   const mode = theme.palette.mode;
//   const [anchorEl, setAnchorEl] = useState(null); // State for the menu anchor element

//   const handleClickMenu = (event) => {
//     setAnchorEl(event.currentTarget); // Open the menu on icon click
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null); // Close the menu
//   };

//   const handleViewCoupon = () => {
//     // Call the buttonAction prop when "View Coupon" is clicked
//     if (buttonAction) {
//       buttonAction(); // Call the action passed in as a prop
//     }
//     handleCloseMenu(); // Close the menu after selecting an option
//   };

//   return (
//   //   <Box
//   //   sx={{
//   //     display: 'grid',
//   //     gridTemplateColumns: { sm: '1fr', md: 'repeat(2, 1fr)' },
//   //     gap: '20px',
//   //     marginTop: '20px',
//   //     // margin: '5%',
//   //   }}
//   // >
//   //   <Card
//   //     sx={{
//   //       padding: '16px',
//   //       border: '1px solid',
//   //       borderColor: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
//   //       borderRadius: '8px',
//   //       position: 'relative',
//   //       backgroundColor: `${mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-dark-background)'}`,
//   //       boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
//   //       // marginRight: { xs: 'auto', sm: 'auto', md: '13%', lg: '13%' },
//   //       // width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' },
//   //     }}
//   //   >
//   //     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//   //       <Box>
//   //         <Typography
//   //           variant="text2"
//   //           sx={{
//   //             color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
//   //           }}
//   //         >
//   //           {couponName}
//   //         </Typography>
//   //         <br />
//   //         <Typography
//   //           variant="text6"
//   //           sx={{
//   //             color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
//   //           }}
//   //         >
//   //           {dayjs(expiryDate).format('D MMM YYYY')}
//   //         </Typography>
//   //       </Box>
//   //       {/* Discount percentage */}
//   //       <Typography
//   //         variant="text2"
//   //         sx={{
//   //           color: discountPercentage > 0 ? 'green' : 'red',
//   //           fontWeight: '650',
//   //         }}
//   //       >
//   //         {discountPercentage}% Off
//   //       </Typography>
//   //     </Box>

//   //     <Typography
//   //       variant="text8"
//   //       sx={{
//   //         color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
//   //         wordBreak: 'break-all',
//   //       }}
//   //     >
//   //       {couponDescription.length > 80 ? parse(`${couponDescription.substring(0, 80)}...`) : parse(couponDescription)}
//   //     </Typography>

//   //     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//   //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//   //         <GroupsIcon color="primary" fontSize="large" />
//   //         <Typography
//   //           variant="text8"
//   //           sx={{
//   //             color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
//   //           }}
//   //         >
//   //           &nbsp; {maxUses}
//   //         </Typography>
//   //       </Box>

//   //       {/* More options button */}
//   //       <IconButton
//   //         aria-label="more"
//   //         onClick={handleClickMenu}
//   //         sx={{
//   //           color: 'var(--tw-text-light-mainText)', // Adjust text color based on mode
//   //         }}
//   //       >
//   //         <MoreHorizIcon fontSize="small" />
//   //       </IconButton>

//   //       {/* Menu component */}
//   //       <Menu
//   //         anchorEl={anchorEl}
//   //         open={Boolean(anchorEl)}
//   //         onClose={handleCloseMenu}
//   //         MenuListProps={{
//   //           'aria-labelledby': 'coupon-menu',
//   //         }}
//   //       >
//   //         <MenuItem onClick={handleViewCoupon}>View Coupon</MenuItem>
//   //       </Menu>
//   //     </Box>

//   //   </Card>
//   //   </Box>

//   );
// };

// export default Coupon;

'use client';
import { Box, Typography, IconButton, Menu, MenuItem, Card } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import GroupsIcon from '@mui/icons-material/Groups';
import { useTheme } from '@mui/material';
import { useState } from 'react';

const Coupon = ({
  couponName,
  couponCode,
  maxUses,
  discountPercentage,
  couponDescription,
  societyId,
  expiryDate, uses,
  buttonText,
  buttonAction,
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [anchorEl, setAnchorEl] = useState(null); // State for the menu anchor element

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu on icon click
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleViewCoupon = () => {
    // Call the buttonAction prop when "View Coupon" is clicked
    if (buttonAction) {
      buttonAction(); // Call the action passed in as a prop
    }
    handleCloseMenu(); // Close the menu after selecting an option
  };

  return (
    <Box
      sx={{
        // display: 'grid',
        // gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(2, 1fr)' }, // Two columns for medium screens
        columnGap: '20px', // Gap between the cards
        // gridAutoRows: 'minmax(200px, auto)', // Uniform row height
        // marginTop: '20px',
      }}
    >
      <Card
        sx={{
          marginRight: "15px",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
          border: '1px solid',
          borderColor: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
          borderRadius: '8px',
          width: '100%', // Ensures cards span the grid column
          maxWidth: '300px', // Restrict the max width
          height: '240px', // Consistent height for all cards
          backgroundColor: `${mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-dark-background)'}`,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="text2"
              sx={{
                color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
              }}
            >
              {couponName}
            </Typography>
            <br />
            <Typography
              variant="text6"
              sx={{
                color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
              }}
            >
              {dayjs(expiryDate).format('D MMM YYYY')}
            </Typography>
          </Box>
          {/* Discount percentage */}
          <Typography
            variant="text2"
            sx={{
              color: discountPercentage > 0 ? 'green' : 'red',
              fontWeight: '650',
            }}
          >
            {discountPercentage}% Off
          </Typography>
        </Box>

        <Typography
          variant="text8"
          sx={{
            color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3, // Show 3 lines of text
            WebkitBoxOrient: 'vertical',
          }}
        >
          {couponDescription.length > 80 ? parse(`${couponDescription.substring(0, 80)}...`) : parse(couponDescription)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupsIcon color="primary" fontSize="large" />
            <Typography
              variant="text8"
              sx={{
                color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
              }}
            >
              &nbsp; {uses}/{maxUses}
            </Typography>
          </Box>

          {/* More options button */}
          <IconButton
            aria-label="more"
            onClick={handleClickMenu}
            sx={{
              color: 'var(--tw-text-light-mainText)', // Adjust text color based on mode
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>

          {/* Menu component */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'coupon-menu',
            }}
          >
            <MenuItem onClick={handleViewCoupon}>View Coupon</MenuItem>
          </Menu>
        </Box>
      </Card>
    </Box>
  );
};

export default Coupon;

