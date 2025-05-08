// // "use client"
// // import * as React from 'react';
// // import Button from '@mui/material/Button';
// // import Dialog from '@mui/material/Dialog';
// // import DialogActions from '@mui/material/DialogActions';
// // import DialogContent from '@mui/material/DialogContent';
// // import DialogContentText from '@mui/material/DialogContentText';
// // import DialogTitle from '@mui/material/DialogTitle';
// // import { Box, Typography, useTheme } from '@mui/material';

// // import { light } from '@mui/material/styles/createPalette';


// // type ConfirmBoxModelProps = {
// //   open: boolean;
// //   title: string;
// //   description: string;
// //   onAgree: () => void;
// //   onDisagree: () => void;
// //   onClose: () => void;
// //   agreeText?: string;
// //   disagreeText?: string;
// //   styles?: React.CSSProperties;
// // };

// // const ConfirmBoxModel: React.FC<ConfirmBoxModelProps> = ({
// //   open,
// //   title,
// //   description,
// //   onAgree,styles,
// //   onDisagree,
// //   onClose,
// //   agreeText = 'Agree',
// //   disagreeText = 'Disagree',
// // }) => {


// //   const theme = useTheme();
// //   const mode = theme.palette.mode;

// //   return (
// //     <Box style={styles}>
// //     <Dialog

// //       open={open}
// //       onClose={onClose}
// //       aria-labelledby="alert-dialog-title"
// //       aria-describedby="alert-dialog-description"
// //       sx={{ textAlign: "center" }}

// //     >
     
// //       <DialogTitle id="alert-dialog-title"> <Typography variant="text12" color={mode === 'light' ? "#54595E" : "#FFF"}>{title}</Typography></DialogTitle>
// //       <DialogContent >
// //         <DialogContentText id="alert-dialog-description">
// //           <Typography variant="text2" color={mode === 'light' ? "#54595E" : "#FFF"}>{description}</Typography>
// //         </DialogContentText>
// //       </DialogContent>
// //       <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
// //         <Button onClick={onDisagree} sx={{
// //           border: "1px solid",
// //           borderColor: mode === 'light' ? "#4F4F4F" : "#FFF",
// //           color: mode === 'light' ? "#4F4F4F" : "#FFF",
// //           textTransform: "none",
// //           '&:hover': {
// //             backgroundColor: "transparent", // No background color change on hover
// //             borderColor: mode === 'light' ? "#4F4F4F" : "#FFF",
// //             color: mode === 'light' ? "#4F4F4F" : "#FFF",
// //           },
// //         }}>{disagreeText}</Button>
// //         <Button onClick={onAgree} sx={{
// //           border: `1px solid ${mode === 'light' ? '#4F4F4F' : '#FFF'}`, // Adjust border color
// //           backgroundColor: mode === 'light' ? '#4F4F4F' : '#4F4F4F', // Adjust background color
// //           color: mode === 'light' ? 'white' : '#FFF', // Adjust text color
// //           textTransform: 'none',
// //           '&:hover': {
// //             backgroundColor: 'transparent', // No background color change on hover
// //             borderColor: mode === 'light' ? '#4F4F4F' : '#FFF', // Keep border color the same
// //             color: mode === 'light' ? '#4F4F4F' : '#FFF', // Adjust text color on hover
// //           },
// //         }} autoFocus>
// //           {agreeText}
// //         </Button>
// //       </DialogActions>
      
// //       </Dialog></Box>
    
// //   );
// // };

// // export default ConfirmBoxModel;



// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import { Box, Typography, useTheme } from '@mui/material';
 
// type ConfirmBoxModelProps = {
//   open: boolean;
//   title: string;
//   description: string;
//   onAgree: () => void;
//   onDisagree: () => void;
//   onClose: () => void;
//   agreeText?: string;
//   disagreeText?: string;
//   styles?: React.CSSProperties;
// };
 
// const ConfirmBoxModel: React.FC<ConfirmBoxModelProps> = ({
//   open,
//   title,
//   description,
//   onAgree,
//   styles,
//   onDisagree,
//   onClose,
//   agreeText = 'Agree',
//   disagreeText = 'Disagree',
// }) => {
//   const theme = useTheme();
//   const mode = theme.palette.mode;
 
//   const responsiveDialogStyle = {
//     position: 'absolute' as 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '80%', // Responsive width (80% of the viewport width)
//     maxWidth: '400px', // Maximum width
//     // bgcolor: 'background.paper',
//     borderRadius: '8px',
//     // boxShadow: 24,
    
//     textAlign: 'center',
//   };
 
//   return (
// <Box style={styles}>
// <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//         sx={responsiveDialogStyle} // Apply the responsive dialog style
// >
// <DialogTitle id="alert-dialog-title">
// <Typography variant="text12" color={mode === 'light' ? '#54595E' : '#FFF'}>
//             {title}
// </Typography>
// </DialogTitle>
// <DialogContent>
// <DialogContentText id="alert-dialog-description">
// <Typography variant="text2" color={mode === 'light' ? '#54595E' : '#FFF'}>
//               {description}
// </Typography>
// </DialogContentText>
// </DialogContent>
// <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
// <Button
//             onClick={onDisagree}
//             sx={{
//               border: '1px solid',
//               borderColor: mode === 'light' ? '#4F4F4F' : '#FFF',
//               color: mode === 'light' ? '#4F4F4F' : '#FFF',
//               textTransform: 'none',
//               '&:hover': {
//                 backgroundColor: 'transparent', // No background color change on hover
//                 borderColor: mode === 'light' ? '#4F4F4F' : '#FFF',
//                 color: mode === 'light' ? '#4F4F4F' : '#FFF',
//               },
//             }}
// >
//             {disagreeText}
// </Button>
// <Button
//             onClick={onAgree}
//             sx={{
//               border: `1px solid ${mode === 'light' ? '#4F4F4F' : '#FFF'}`, // Adjust border color
//               backgroundColor: mode === 'light' ? '#4F4F4F' : '#4F4F4F', // Adjust background color
//               color: mode === 'light' ? 'white' : '#FFF', // Adjust text color
//               textTransform: 'none',
//               '&:hover': {
//                 backgroundColor: 'transparent', // No background color change on hover
//                 borderColor: mode === 'light' ? '#4F4F4F' : '#FFF', // Keep border color the same
//                 color: mode === 'light' ? '#4F4F4F' : '#FFF', // Adjust text color on hover
//               },
//             }}
//             autoFocus
// >
//             {agreeText}
// </Button>
// </DialogActions>
// </Dialog>
// </Box>
//   );
// };
 
// export default ConfirmBoxModel;


import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography, useTheme } from '@mui/material';

// type ConfirmBoxModelProps = {
//   open: boolean;
//   title: string;
//   description: string;
//   onAgree: () => void;
//   onDisagree: () => void;
//   onClose: () => void;
//   agreeText?: string;
//   disagreeText?: string;
//   styles?: React.CSSProperties;
//   fontSize?: { title?: string; description?: string };
// };
// const ConfirmBoxModel: React.FC<ConfirmBoxModelProps> = ({
//   open,
//   title,
//   description,
//   onAgree,
//   styles,
//   onDisagree,
//   onClose,
//   agreeText = 'Agree',
//   disagreeText = 'Disagree',
  
// }) => {
//   const theme = useTheme();
//   const mode = theme.palette.mode;

//   const responsiveDialogStyle = {
//     position: 'absolute' as 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '80%', // Responsive width (80% of the viewport width)
//     maxWidth: '400px', // Maximum width
//     borderRadius: '8px',
//     textAlign: 'center',
//   };

//   return (
//     <Box style={styles}>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//         sx={responsiveDialogStyle} // Apply the responsive dialog style
//         BackdropProps={{
//           style: { backgroundColor: 'transparent' }, // Remove grey transparent background
//         }}
//       >
//         <DialogTitle id="alert-dialog-title">
//           <Typography variant="text12" color={mode === 'light' ? '#54595E' : '#FFF'}>
//             {title}
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             <Typography variant="text2" color={mode === 'light' ? '#54595E' : '#FFF'}>
//               {description}
//             </Typography>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
//           <Button
//             onClick={onDisagree}
//             sx={{
//               border: '1px solid',
//               borderColor: mode === 'light' ? '#4F4F4F' : '#FFF',
//               color: mode === 'light' ? '#4F4F4F' : '#FFF',
//               textTransform: 'none',
//               '&:hover': {
//                 backgroundColor: 'transparent', // No background color change on hover
//                 borderColor: mode === 'light' ? '#4F4F4F' : '#FFF',
//                 color: mode === 'light' ? '#4F4F4F' : '#FFF',
//               },
//             }}
//           >
//             {disagreeText}
//           </Button>
//           <Button
//             onClick={onAgree}
//             sx={{
//               border: `1px solid ${mode === 'light' ? '#4F4F4F' : '#FFF'}`, // Adjust border color
//               backgroundColor: mode === 'light' ? '#4F4F4F' : '#4F4F4F', // Adjust background color
//               color: mode === 'light' ? 'white' : '#FFF', // Adjust text color
//               textTransform: 'none',
//               '&:hover': {
//                 backgroundColor: 'transparent', // No background color change on hover
//                 borderColor: mode === 'light' ? '#4F4F4F' : '#FFF', // Keep border color the same
//                 color: mode === 'light' ? '#4F4F4F' : '#FFF', // Adjust text color on hover
//               },
//             }}
//             autoFocus
//           >
//             {agreeText}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };
// export default ConfirmBoxModel;





// Define ConfirmBoxModelProps with titleFontSize as optional
interface ConfirmBoxModelProps {
  open: boolean;
  title: string;
  description: string;
  onAgree: () => void;
  styles?: React.CSSProperties;
  onDisagree: () => void;
  onClose: () => void;
  agreeText?: string;
  disagreeText?: string;
  titleFontSize?: string; // Optional prop for title font size
}

const ConfirmBoxModel: React.FC<ConfirmBoxModelProps> = ({
  open,
  title,
  description,
  onAgree,
  styles,
  onDisagree,
  onClose,
  agreeText = 'Agree',
  disagreeText = 'Disagree',
  titleFontSize, // Now it's optional
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const responsiveDialogStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // Responsive width (80% of the viewport width)
    maxWidth: '600px', // Adjusted maximum width
    borderRadius: '8px',
    textAlign: 'center',
  };

  return (
    <Box style={styles}>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={responsiveDialogStyle} // Apply the responsive dialog style
        BackdropProps={{
          style: { backgroundColor: 'transparent' }, // Remove grey transparent background
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography
            variant="text12"
            color={mode === 'light' ? '#54595E' : '#FFF'}
            sx={{
              display: 'block', // Ensure the title takes up the full width
              width: '100%', // Ensure it doesn't exceed the dialog width
              overflow: 'hidden', // Hide overflow
              whiteSpace: 'normal', // Allow wrapping
              lineHeight: '1.2', // Adjust line height for readability
              fontSize: titleFontSize || '16px', // Apply custom font size or default to '16px'
            }}
          >
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="text2"
              color={mode === 'light' ? '#54595E' : '#FFF'}
              sx={{
                whiteSpace: 'nowrap', // Prevent description wrapping
                overflow: 'hidden', // Hide overflow
                textOverflow: 'ellipsis', // Show ellipsis for overflow
              }}
            >
              {description}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={onDisagree}
            sx={{
              border: '1px solid',
              borderColor: mode === 'light' ? '#4F4F4F' : '#FFF',
              color: mode === 'light' ? '#4F4F4F' : '#FFF',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent', // No background color change on hover
                borderColor: mode === 'light' ? '#4F4F4F' : '#FFF',
                color: mode === 'light' ? '#4F4F4F' : '#FFF',
              },
            }}
          >
            {disagreeText}
          </Button>
          <Button
            onClick={onAgree}
            sx={{
              border: `1px solid ${mode === 'light' ? '#4F4F4F' : '#FFF'}`, // Adjust border color
              backgroundColor: mode === 'light' ? '#4F4F4F' : '#4F4F4F', // Adjust background color
              color: mode === 'light' ? 'white' : '#FFF', // Adjust text color
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent', // No background color change on hover
                borderColor: mode === 'light' ? '#4F4F4F' : '#FFF', // Keep border color the same
                color: mode === 'light' ? '#4F4F4F' : '#FFF', // Adjust text color on hover
              },
            }}
            autoFocus
          >
            {agreeText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmBoxModel;






