// // 'use client';
// // import { Box, Typography } from '@mui/material';
// // import React, { ReactNode } from 'react';
// // import ButtonInput from './Button/Button';

// // interface Props {
// //   text?: string;
// //   buttonText?: string;
// //   onClick?: () => void;
// //   children?: ReactNode;
// // }

// // const BaseContainer = (props: Props) => {
// //   return (
// //     <Box
// //       sx={{
// //         border: '1px solid #9C9AA533', // Very light grey for the border
// //         height: '100%',
// //         width: '80%',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         color: 'black',
// //         textAlign: 'center',
// //         padding: '4rem',
// //         borderRadius: '0.8rem',
// //         marginLeft: '18%',
// //         marginTop: '0rem',
// //         position: 'relative',

// //         '@media (max-width: 600px)': {
// //           marginLeft: '0',
// //           width: '100%',
// //           padding: '2rem',
// //           border: 'none',
// //         },

// //         '@media (min-width: 1200px)': {

// //         },
// //       }}
// //       className=" !bg-light-background !bg-dark-background"
// //     >
// //       <img
// //         src="/images/Frame.png"
// //         alt="Description of image"
// //         style={{ maxWidth: '100%', height: 'auto' }} // Ensure image is responsive
// //       />

// //       <Typography
// //         variant="h6"
// //         sx={{
// //           marginTop: '2rem',
// //           color: 'lightgrey',
// //         }}
// //       >
// //         {props.text}
// //       </Typography>

// //       {/* Wrapper for button to control layout */}
// //       <Box
// //         sx={{
// //           display: 'flex',
// //           flexDirection: { xs: 'column', lg: 'row' }, // Stack in column on small screens, row on large screens
// //           alignItems: 'center',
// //           marginTop: '3rem',
// //           gap: '1rem', // Optional: Add space between items
// //         }}
// //       ></Box>
// //       <Box sx={{ marginTop: '2rem', width: '100%' }}>
// //         {props.children} {/* Display any passed children */}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default BaseContainer;



// 'use client';
// import { Box, Typography } from '@mui/material';
// import React, { ReactNode } from 'react';
// import ButtonInput from './Button/Button';

// interface Props {
//   text?: string;
//   buttonText?: string;
//   onClick?: () => void;
//   children?: ReactNode;
// }

// const BaseContainer = (props: Props) => {
//   return (
//     <Box
//       sx={{
//         border: '1px solid #9C9AA533', // Very light grey for the border
//         height: '100%',
//         width: { xs: '100%', md: '80%', lg: '80%' }, // Center on larger screens
//         maxWidth: { xs: '100%', md: '800px', lg: '1000px' }, // Optional: set a different max width for large screens
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: 'pink',
//         alignItems: 'center',
//         justifyContent: 'center',
//         color: 'black',
//         textAlign: 'center',
//         padding: { xs: '2rem', md: '4rem' }, // Responsive padding
//         borderRadius: '0.8rem',
//         margin: { xs: '0 auto', lg: '0 auto 0 24%' }, // Center for small screens, left margin for laptop screens
//         position: 'relative',

//         '@media (max-width: 600px)': {
//           border: 'none',
//         },
//       }}
//       className="!bg-light-background !bg-dark-background"
//     >
//       <img
//         src="/images/Frame.png"
//         alt="Description of image"
//         style={{ maxWidth: '100%', height: 'auto' }} // Ensure image is responsive
//       />

//       <Typography
//         variant="h6"
//         sx={{
//           marginTop: '2rem',
//           color: 'lightgrey',
//         }}
//       >
//         {props.text}
//       </Typography>

//       {/* Wrapper for button to control layout */}
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', lg: 'row' }, // Stack in column on small screens, row on large screens
//           alignItems: 'center',
//           marginTop: '3rem',
//           gap: '1rem', // Optional: Add space between items
//         }}
//       >
//         <ButtonInput onClick={props.onClick} buttonText={props.buttonText} />
//       </Box>

//       <Box sx={{ marginTop: '2rem', width: '100%' }}>
//         {props.children} {/* Display any passed children */}
//       </Box>
//     </Box>
//   );
// };

// export default BaseContainer;
// 'use client';
// import { Box, Typography } from '@mui/material';
// import React, { ReactNode } from 'react';
// import ButtonInput from './Button/Button';

// interface Props {
//   text?: string;
//   buttonText?: string;
//   onClick?: () => void;
//   children?: ReactNode;
// }

// const BaseContainer = (props: Props) => {
//   return (
//     <Box
//       sx={{
//         border: '1px solid #9C9AA533', // Very light grey for the border
//         height: '100%',
//         width: { xs: '100%', md: '80%', lg: '80%' }, // Center on larger screens
//         maxWidth: { xs: '100%', md: '800px', lg: '1000px' }, // Optional: set a different max width for large screens
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: 'pink',
//         alignItems: 'center',
//         justifyContent: 'center',
//         color: 'black',
//         textAlign: 'center',
//         padding: { xs: '2rem', md: '4rem' }, // Responsive padding
//         borderRadius: '0.8rem',
//         margin: { xs: '0 auto', lg: '0 auto 0 24%' }, // Default: Center for small screens, left margin for large screens
//         position: 'relative',

//         '@media (max-width: 600px)': {
//           border: 'none',
//         },

//         // Apply margin-left 22% ONLY for 1024px width
//         '@media (min-width: 1024px) and (max-width: 1024px)': {
//           marginLeft: '22%',
//         },
//       }}
//       className="!bg-light-background !bg-dark-background"
//     >
//       <img
//         src="/images/Frame.png"
//         alt="Description of image"
//         style={{ maxWidth: '100%', height: 'auto' }} // Ensure image is responsive
//       />

//       <Typography
//         variant="h6"
//         sx={{
//           marginTop: '2rem',
//           color: 'lightgrey',
//         }}
//       >
//         {props.text}
//       </Typography>

//       {/* Wrapper for button to control layout */}
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', lg: 'row' }, // Stack in column on small screens, row on large screens
//           alignItems: 'center',
//           marginTop: '3rem',
//           gap: '1rem', // Optional: Add space between items
//         }}
//       >
//         {/* <ButtonInput onClick={props.onClick} buttonText={props.buttonText} /> */}
//       </Box>

//       <Box sx={{ marginTop: '2rem', width: '100%' }}>
//         {props.children} {/* Display any passed children */}
//       </Box>
//     </Box>
//   );
// };




'use client';
import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import ButtonInput from './Button/Button';

interface Props {
  text?: string;
  buttonText?: string;
  onClick?: () => void;
  children?: ReactNode;
  
}
const BaseContainer = (props: Props) => {
  return (
    <Box
      sx={{
        // border: '1px solid #9C9AA533',
        height: '100%',
        // width: { xs: '100%', md: '80%', lg: '80%' },
        // maxWidth: { xs: '100%', md: '800px', lg: '1000px' },
        display: 'flex',
        flexDirection: 'column',

        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
        textAlign: 'center',
        padding: { xs: '2rem', md: '4rem' },
        borderRadius: '0.8rem',
        // margin: { xs: '0 auto', lg: '0 auto 0 17%' },
        position: 'relative',
        minWidth: '-webkit-fill-available',

        // Adjust styles for mobile
        '@media (max-width: 600px)': {
          border: 'none',
          padding: '1rem', // Reduce padding for mobile
          height: 'auto', // Allow auto height for mobile screens
          marginBottom: '2rem', // Add space for the button at the bottom
        },

        '@media (min-width: 1024px) and (max-width: 1024px)': {
          marginLeft: '22%',
          minWidth: '-webkit-fill-available',
        },


      }}
      className="!bg-light-background !bg-dark-background"
    >
      <img
        src="/images/Frame.png"
        alt="Description of image"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Typography
        variant="h6"
        sx={{
          marginTop: '2rem',
          color: 'lightgrey',
        }}
      >
        {props.text}
      </Typography>

      {/* Wrapper for button */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'center',
          marginTop: '3rem',
          gap: '1rem',
        }}
      />

      <Box sx={{ marginTop: '2rem', width: '100%' }}>
        {props.children}
      </Box>
    </Box>
  );
}

export default BaseContainer;
