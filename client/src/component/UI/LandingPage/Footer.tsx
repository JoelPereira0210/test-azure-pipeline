
// 'use client';
// import React, { useState } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import MenuIcon from '@mui/icons-material/Menu';
// import Button from '@mui/material/Button';
// import Link from 'next/link';
// import { Typography } from '@mui/material';

// const Footer = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const navItems = ['Home', 'About', 'Plans', 'Contact'];
//   const societyLogo = 'BASE64_STRING_HERE'; // Replace with your base64 string dynamically

//   const toggleDrawer = (open: boolean) => () => {
//     setDrawerOpen(open);
//   };

//   return (
//     <AppBar
//       position="relative"
//       sx={{ background: '#C4DBF7', boxShadow: 'none' }}
//     >
//         <Box
//   sx={{
//     width: '100%',
//     height: '1px',
//     backgroundColor: '#1F64FF',
//     // marginTop: { xs: '3%', sm: '3%', md: '4%', lg: '4%', xl: '4%' },
//   }}
// ></Box>
//       <Box
//         sx={{
//           // height: '128px', // Take the whole screen height
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <Toolbar
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           {/* Logo */}
//           <Box
//             sx={{
//               width: {
//                 xs: '6rem',
//                 sm: '7rem',
//                 md: '8rem',
//                 lg: '9rem',
//                 xl: '7rem',
//               },
//               height: {
//                 xs: '4rem',
//                 sm: '5rem',
//                 md: '6rem',
//                 lg: '7rem',
//                 xl: '6rem',
//               },
//               marginLeft: { xs: 0, sm: 0, md: '5rem' },
//             }}
//           >
//             <img
//               src="/images/landingpagelogo.png"
//               alt="Logo"
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'contain',
//               }}
//             />
//           </Box>

//           {/* Desktop Navigation */}
//           <Box
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               alignItems: 'center',
//               gap: 3,
//               marginRight: '7%',
//             }}
//           >
//             {/* Navigation Items */}
//             {navItems.map((item) => (
//               <Link key={item} href={`/${item.toLowerCase()}`} passHref>
//                 <Button sx={{ color: '#1F64FF', fontWeight: '500' }}>
//                   {item}
//                 </Button>
//               </Link>
//             ))}
           
           
//           </Box>

//           {/* Mobile Drawer */}
//           <Box sx={{ display: { xs: 'block', md: 'none' } }}>
//             <IconButton
//               edge="end"
//               color="inherit"
//               aria-label="menu"
//               onClick={toggleDrawer(true)}
//               sx={{ color: '#1F64FF' }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Drawer
//               anchor="right"
//               open={drawerOpen}
//               onClose={toggleDrawer(false)}
//             >
//               <Box
//                 sx={{ width: 250 }}
//                 role="presentation"
//                 onClick={toggleDrawer(false)}
//                 onKeyDown={toggleDrawer(false)}
//               >
//                 <List>
//                   {navItems.map((item) => (
//                     <ListItem button key={item}>
//                       <ListItemText>
//                         <Link
//                           href={`/${item.toLowerCase()}`}
//                           style={{ textDecoration: 'none', color: '#1F64FF' }}
//                         >
//                           {item}
//                         </Link>
//                       </ListItemText>
//                     </ListItem>
//                   ))}
                  
                  
//                 </List>
//               </Box>
//             </Drawer>
//           </Box>
//         </Toolbar>
//       </Box>
//     </AppBar>
//   );
// };

// export default Footer;


'use client';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';

const Footer = () => {
  const navItems = ['Home', 'About', 'Plans', 'Contact'];

  return (
    <AppBar
      position="relative"
      sx={{ background: '#C4DBF7', boxShadow: 'none', padding: '1rem 0' }}
    >
      {/* Divider Line */}
      <Box
        sx={{
          width: '86%',marginLeft:{md:"86px",xs:"20px",sm:"57px",lg:"119px",xl:"119px"},
          height: '1px',
          backgroundColor: '#1F64FF',
        }}
      ></Box>

      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingX: { xs: '1rem', md: '3rem' },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: { xs: '4rem', sm: '5rem', md: '7rem' },
            height: 'auto',marginLeft:{sm:"3%"}
          }}
        >
          <img
            src="/images/landingpagelogo.png"
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Navigation Items */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2, md: 3 }, // Reduced gap for smaller screens
            flexWrap: 'nowrap',marginRight:{sm:"7%"}
          }}
        >
          {navItems.map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} passHref>
              <Button
                sx={{
                  color: '#1F64FF',
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' }, // Adjust font size for smaller screens
                  fontWeight: '500',
                  textTransform: 'none',
                  padding: '0.3rem 0.6rem', // Reduced padding for smaller screens
                  minWidth: 'auto',
                }}
              >
                {item}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;