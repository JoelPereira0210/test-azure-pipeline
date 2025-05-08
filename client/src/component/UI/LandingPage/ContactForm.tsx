
// import { Box, TextField, Typography, Link } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import PhoneIcon from '@mui/icons-material/Phone';
// import Parser from 'html-react-parser';
// import MailIcon from '@mui/icons-material/Mail';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import { fetchLandingSectionData } from '@/src/actions/landingPage';
// import Footer from './Footer';

// const ContactFormLandingPage = () => {
//   const [landingPageData, setLandingPageData] = useState([]);
//   const [base64Image, setBase64Image] = useState<string | null>(null);

//   useEffect(() => {
//     const getTheLandingSectionData = async () => {
//       try {
//         const response = await fetchLandingSectionData('CONTACT');
//         setLandingPageData(response?.data || []);
//         if (response?.data.imageBase64) {
//           setBase64Image(response.data.imageBase64);
//         }
//       } catch (error) {
//         console.error('Error fetching landing section data:', error);
//       }
//     };
//     getTheLandingSectionData();
//   }, []);

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     message: '',
//   });

//   const [errors, setErrors] = useState({
//     firstName: false,
//     lastName: false,
//     email: false,
//     phone: false,
//     message: false,
//   });

//   const handleInputChange =
//     (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: e.target.value,
//       }));

//       setErrors((prev) => ({
//         ...prev,
//         [field]: false,
//       }));
//     };

//   const handleSendMessage = () => {
//     const newErrors = {
//       firstName: formData.firstName.trim() === '',
//       lastName: formData.lastName.trim() === '',
//       email: formData.email.trim() === '',
//       phone: formData.phone.trim() === '',
//       message: formData.message.trim() === '',
//     };

//     setErrors(newErrors);

//     if (Object.values(newErrors).some((error) => error)) {
//       return;
//     }

//     console.log('Form submitted successfully:', formData);
//   };

//   return (
//     <Box
//       sx={{ position: 'relative', overflowX: 'hidden', background: '#C4DBF7' }}
//     >
//       {/* Top Decoration */}
//       <Box
//         sx={{
//           width: '104%',
//           height: '12px',
//           backgroundColor: '#1F64FF',
//           transform: 'rotate(-5.5deg)',
//           transformOrigin: 'left',
//           marginTop: '10%',
//         }}
//       ></Box>

//       <Box
//         sx={{
//           width: '100%',
//           height: '100%',
//           '&::after': {
//             content: '""',
//             position: 'absolute',
//             width: '202%',
//             height: '276px',
//             // marginTop: '-2px',
//             // marginLeft: { xl: '-1%', md: '0%', sm: '0%', xs: '0%' }, // Adjust marginLeft for smaller screens
//           //  background:{sm:"orange"},
//             background: 'white',
//             transform: {
//               xs: 'rotate(-5.2deg)', // Rotation for small screens
//               sm: 'rotate(-5.7deg)', // Rotation for small screens
//               md: 'rotate(-5.5deg)', // Rotation for medium screens
//               lg: 'rotate(-5.5deg)', // Rotation for large screens
//               xl: 'rotate(-5.5deg)', // Rotation for extra-large screens
//             },
//             transformOrigin: 'left',

//             top: { md: '-22.7%', lg: '-15.4%', xl: '6.9%' },
//             bottom: { xs: '96%', sm: '88.2%' },
//             // bottom: {
//             //   xs: '1105px', // Position from the bottom for extra small screens
//             //   sm: '1105px', // Position for small screens
//             //   md: '413px', // Position for medium screens
//             //   lg: '372px', // Position for large screens
//             //   xl: '263px', // Position for extra-large screens
//             // },
//             right: { xl: '-2.8%', xs: '-96%' },
//           },
//         }}
//       >
//         {/* Content Section */}
//         <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               width: '84%',
//               margin: '0 auto 2%',
//             }}
//           >
//             {landingPageData.map((data, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   flexWrap: 'wrap',
//                   width: '100%',
//                   marginTop: '10px',
//                   flexDirection: { xs: 'column-reverse', sm: 'row' },
//                 }}
//               >
//                 {/* Contact Info */}
//                 <Box
//                   sx={{
//                     width: { xs: '100%', sm: '48%' },
//                     backgroundColor: '#1F64FF',
//                     padding: '42px 30px 46px 30px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     marginBottom: { xs: '20px', sm: '0' },
//                   }}
//                 >
//                   <Typography
//                     variant="h5"
//                     sx={{ fontWeight: 'bold', color: '#fff' }}
//                   >
//                     {data.cardTitle}
//                   </Typography>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       marginTop: '60px',
//                     }}
//                   >
//                     <PhoneIcon sx={{ color: '#fff', marginRight: '8px' }} />
//                     <Typography sx={{ color: '#fff' }}>
//                       {data.phoneNumber}
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       marginTop: '51px',
//                     }}
//                   >
//                     <MailIcon sx={{ color: '#fff', marginRight: '8px' }} />
//                     <Typography sx={{ color: '#fff' }}>{data.email}</Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'flex-start',
//                       marginTop: '51px',
//                     }}
//                   >
//                     <LocationOnIcon
//                       sx={{ color: '#fff', marginRight: '8px' }}
//                     />
//                     <Typography sx={{ color: '#fff', wordBreak: 'break-word' }}>
//                       {Parser(data.cardDescription)}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 {/* Contact Form */}
//                 <Box
//                   sx={{
//                     width: { xs: '100%', sm: '48%' },
//                     padding: '41px 0 61px 0',
//                     position: 'relative',
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: '0',
//                       left: '0',
//                       border: '1px solid #1F64FF',
//                       padding: '10px 20px',
//                     }}
//                   >
//                     <Typography sx={{ color: '#1F64FF', fontWeight: 'bold' }}>
//                       CONTACT US
//                     </Typography>
//                   </Box>

//                   <Box
//                     sx={{
//                       display: 'flex',
//                       flexWrap: 'wrap',
//                       gap: '10px',
//                       marginTop: '30px',
//                     }}
//                   >
//                     {[
//                       { placeholder: 'First Name', field: 'firstName' },
//                       { placeholder: 'Last Name', field: 'lastName' },
//                     ].map(({ placeholder, field }) => (
//                       <Box
//                         key={field}
//                         sx={{ width: '48%', position: 'relative' }}
//                       >
//                         <TextField
//                           placeholder={placeholder}
//                           value={formData[field]}
//                           onChange={handleInputChange(field)}
//                           sx={{ width: '100%', marginBottom: '20px' }}
//                         />
//                         {errors[field] && (
//                           <Typography
//                             sx={{
//                               position: 'absolute',
//                               top: '74%',
//                               left: '0',
//                               color: 'red',
//                               fontSize: '12px',
//                               marginTop: '5px',
//                               zIndex: '10',
//                             }}
//                           >
//                             {`${placeholder} is required`}
//                           </Typography>
//                         )}
//                       </Box>
//                     ))}
//                     {[
//                       { placeholder: 'Email', field: 'email' },
//                       { placeholder: 'Phone', field: 'phone' },
//                     ].map(({ placeholder, field }) => (
//                       <Box
//                         key={field}
//                         sx={{ width: '48%', position: 'relative' }}
//                       >
//                         <TextField
//                           placeholder={placeholder}
//                           value={formData[field]}
//                           onChange={handleInputChange(field)}
//                           sx={{ width: '100%', marginBottom: '20px' }}
//                         />
//                         {errors[field] && (
//                           <Typography
//                             sx={{
//                               position: 'absolute',
//                               top: '74%',
//                               left: '0',
//                               color: 'red',
//                               fontSize: '12px',
//                               marginTop: '5px',
//                               zIndex: '10',
//                             }}
//                           >
//                             {`${placeholder} is required`}
//                           </Typography>
//                         )}
//                       </Box>
//                     ))}

//                     {/* Adjust spacing for the message field */}
//                     <Box sx={{ width: '100%', position: 'relative' }}>
//                       <TextField
//                         placeholder="Write a message"
//                         multiline
//                         rows={3}
//                         value={formData.message}
//                         onChange={handleInputChange('message')}
//                         sx={{ width: '100%', marginBottom: '20px' }}
//                       />
//                       {errors.message && (
//                         <Typography
//                           sx={{
//                             position: 'absolute',
//                             top: '86%',
//                             left: '0',
//                             color: 'red',
//                             fontSize: '12px',
//                             marginTop: '5px',
//                             zIndex: '10',
//                           }}
//                         >
//                           Message is required
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>

//                   {/* Submit Button */}
//                   <Box
//                     onClick={handleSendMessage}
//                     sx={{
//                       cursor: 'pointer',
//                       backgroundColor: '#1F64FF',
//                       padding: '10px 20px',
//                       marginTop: '20px',
//                       textAlign: 'center',width:"fit-content"
//                     }}
//                   >
//                     <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
//                       {data.buttonText || 'Send Message'}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             ))}

           
//           </Box>

//           <Footer/>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ContactFormLandingPage;


import { Box, TextField, Typography, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import Parser from 'html-react-parser';
import MailIcon from '@mui/icons-material/Mail';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchLandingSectionData } from '@/src/actions/landingPage';
import Footer from './Footer';

const ContactFormLandingPage = () => {
  const [landingPageData, setLandingPageData] = useState([]);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    const getTheLandingSectionData = async () => {
      try {
        const response = await fetchLandingSectionData('CONTACT');
        setLandingPageData(response?.data || []);
        if (response?.data.imageBase64) {
          setBase64Image(response.data.imageBase64);
        }
      } catch (error) {
        console.error('Error fetching landing section data:', error);
      }
    };
    getTheLandingSectionData();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    message: false,
  });

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    };

  const handleSendMessage = () => {
    const newErrors = {
      firstName: formData.firstName.trim() === '',
      lastName: formData.lastName.trim() === '',
      email: formData.email.trim() === '',
      phone: formData.phone.trim() === '',
      message: formData.message.trim() === '',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    console.log('Form submitted successfully:', formData);
  };

  return (
    <Box
      sx={{ position: 'relative', overflowX: 'hidden', background: '#C4DBF7' }}
    >
      {/* Top Decoration */}
      <Box
        sx={{
          width: '104%',
          height: '12px',
          backgroundColor: '#1F64FF',
          transform: 'rotate(-5.5deg)',
          transformOrigin: 'left',
          marginTop: '10%',
        }}
      ></Box>

      <Box
        sx={{
          width: '100%',
          height: '100%',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '202%',
            height: '276px',
            // marginTop: '-2px',
            // marginLeft: { xl: '-1%', md: '0%', sm: '0%', xs: '0%' }, // Adjust marginLeft for smaller screens
          //  background:{sm:"orange"},
            background: 'white',
            transform: {
              xs: 'rotate(-5.2deg)', // Rotation for small screens
              sm: 'rotate(-5.7deg)', // Rotation for small screens
              md: 'rotate(-5.5deg)', // Rotation for medium screens
              lg: 'rotate(-5.5deg)', // Rotation for large screens
              xl: 'rotate(-5.5deg)', // Rotation for extra-large screens
            },
            transformOrigin: 'left',

            top: { md: '-22.7%', lg: '-15.4%', xl: '2.9%' },
            bottom: { xs: '96%', sm: '88.2%' },
            // bottom: {
            //   xs: '1105px', // Position from the bottom for extra small screens
            //   sm: '1105px', // Position for small screens
            //   md: '413px', // Position for medium screens
            //   lg: '372px', // Position for large screens
            //   xl: '263px', // Position for extra-large screens
            // },
            right: { xl: '-2.8%', xs: '-96%' },
          },
        }}
      >
        {/* Content Section */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '84%',
              margin: '0 auto 2%',
            }}
          >
            {landingPageData.map((data, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  width: '100%',
                  marginTop: '10px',
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                }}
              >
                {/* Contact Info */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: '48%' },
                    backgroundColor: '#1F64FF',
                    padding: '42px 30px 46px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: { xs: '20px', sm: '0' },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: '#fff' }}
                  >
                    {data.cardTitle}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '60px',
                    }}
                  >
                    <PhoneIcon sx={{ color: '#fff', marginRight: '8px' }} />
                    <Typography sx={{ color: '#fff' }}>
                      {data.phoneNumber}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '51px',
                    }}
                  >
                    <MailIcon sx={{ color: '#fff', marginRight: '8px' }} />
                    <Typography sx={{ color: '#fff' }}>{data.email}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginTop: '51px',
                    }}
                  >
                    <LocationOnIcon
                      sx={{ color: '#fff', marginRight: '8px' }}
                    />
                    <Typography sx={{ color: '#fff', wordBreak: 'break-word' }}>
                      {Parser(data.cardDescription)}
                    </Typography>
                  </Box>
                </Box>

                {/* Contact Form */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: '48%' },
                    padding: '41px 0 61px 0',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '0',
                      left: '0',backgroundColor:"#F6F6F6",
                      border: '1px solid #1F64FF',
                      padding: '10px 20px',
                    }}
                  >
                    <Typography sx={{ color: '#1F64FF', fontWeight: 'bold' }}>
                      CONTACT US
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginTop: '30px',
                    }}
                  >
                    {[
                      { placeholder: 'First Name', field: 'firstName' },
                      { placeholder: 'Last Name', field: 'lastName' },
                    ].map(({ placeholder, field }) => (
                      <Box
                        key={field}
                        sx={{ width: '48%', position: 'relative' ,}}
                      >
                        <TextField
                          placeholder={placeholder}
                          value={formData[field]}
                          onChange={handleInputChange(field)}
                          sx={{ width: '100%', marginBottom: '20px',backgroundColor:"#F6F6F6",border:"2px solid #1F64FF" }}
                        />
                        {errors[field] && (
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '74%',
                              left: '0',
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '5px',
                              zIndex: '10',
                            }}
                          >
                            {`${placeholder} is required`}
                          </Typography>
                        )}
                      </Box>
                    ))}
                    {[
                      { placeholder: 'Email', field: 'email' },
                      { placeholder: 'Phone', field: 'phone' },
                    ].map(({ placeholder, field }) => (
                      <Box
                        key={field}
                        sx={{ width: '48%', position: 'relative' }}
                      >
                        <TextField
                          placeholder={placeholder}
                          value={formData[field]}
                          onChange={handleInputChange(field)}
                          sx={{ width: '100%', marginBottom: '20px',backgroundColor:"#F6F6F6",border:"2px solid #1F64FF"  }}
                        />
                        {errors[field] && (
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '74%',
                              left: '0',
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '5px',
                              zIndex: '10',
                            }}
                          >
                            {`${placeholder} is required`}
                          </Typography>
                        )}
                      </Box>
                    ))}

                    {/* Adjust spacing for the message field */}
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <TextField
                        placeholder="Write a message"
                        multiline
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange('message')}
                        sx={{ width: '100%', marginBottom: '20px',backgroundColor:"#F6F6F6",border:"2px solid #1F64FF"  }}
                      />
                      {errors.message && (
                        <Typography
                          sx={{
                            position: 'absolute',
                            top: '86%',
                            left: '0',
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '5px',
                            zIndex: '10',
                          }}
                        >
                          Message is required
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Submit Button */}
                  <Box
                    onClick={handleSendMessage}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: '#1F64FF',
                      padding: '10px 20px',
                      marginTop: '20px',
                      textAlign: 'center',width:"fit-content"
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {data.buttonText || 'Send Message'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

           
          </Box>

          <Footer/>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactFormLandingPage;