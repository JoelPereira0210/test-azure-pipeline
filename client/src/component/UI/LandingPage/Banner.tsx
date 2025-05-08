// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Link from 'next/link';
// import { Typography } from '@mui/material';
// import { fetchLandingSectionData } from '@/src/actions/landingPage';
// import Parser from 'html-react-parser';
// type Props = {};
// interface LandingPageData {
//   cardTitle: string;
//   cardDescription: string;
//   cardSubTitle: string;
//   buttonText: string;
// }

// const Banner = (props: Props) => {
//   const [landingPageData, setLandingPageData] = useState([]);
//   const [base64Image, setBase64Image] = useState<string | null>(null);

//   useEffect(() => {
//     const getTheLandingSectionData = async () => {
//       try {
//         const response = await fetchLandingSectionData('HEADER');
//         console.log('getTheLandingSectionData in header', response.data); // Update the state with fetched data
//         // console.log('getTheLandingSectionData in header for image', response.data[0].imageBase64); // Update the state with fetched data
//         // setLandingPageData(response);
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

//   console.log('landing page in State', base64Image);
//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         overflowX: 'hidden',
//         overflowY: 'hidden',
//       }}
//     >
//       <Box
//         sx={{
//           background: '#C4DBF7',
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: { xs: 'column', md: 'row' },
//             alignItems: { xs: 'center', md: 'flex-start' },
//             justifyContent: 'space-between',
//             padding: { xs: 2, md: 5 },
//             // marginTop: { xs: 2, md: '-4rem' },
//             flex: 1,
//             // background: 'blue'
//           }}
//         >
//           <Box
//             sx={{
//               width: { xs: '100%', md: '38%' },
//               textAlign: { xs: 'center', md: 'left' },
//               padding: 2,
//               marginTop: { xs: '0rem', sm: '0rem', md: '5rem', lg: '5rem' },
//               marginLeft: { xs: 0, md: '5rem' },
//               // background: 'blue'
//             }}
//           >
//             {landingPageData.map((data, index) => (
//               <Box key={index}>
//                 <Typography
//                   sx={{
//                     fontSize: {
//                       xs: '23px', // Small screen font size
//                       sm: '23px', // Small-medium screen font size
//                       md: '48px', // Medium and larger screens font size
//                       lg: '48px',
//                       xl: '48px',
//                     },
//                     color: '#1F64FF',
//                     margin: 0,
//                   }}
//                 >
//                   {data.cardTitle}{' '}
//                   <span style={{ fontWeight: '700' }}>{data.cardSubTitle}</span>
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: '18px',
//                     color: '#7B7B7B',
//                     fontWeight: '400',
//                     marginBottom: '20px',
//                     display: { xs: 'none', md: 'block' },
//                   }}
//                 >
//                   {Parser(data.cardDescription)}
//                 </Typography>
//                 {/* </Box>
//           ))} */}
//                 <Button
//                   variant="contained"
//                   sx={{
//                     display: { xs: 'none', md: 'block' },
//                     backgroundColor: '#1F64FF',
//                     color: '#fff',
//                     textTransform: 'none',
//                     fontWeight: '500',
//                     '&:hover': { backgroundColor: '#1653cc' },
//                   }}
//                 >
//                   <Link
//                     href="/register"
//                     style={{ textDecoration: 'none', color: '#fff' }}
//                   >
//                     {data.buttonText}
//                   </Link>
//                 </Button>
//               </Box>
//             ))}
//           </Box>

//           <Box
//             sx={{
//               width: { xs: '100%', md: '50%' },
//               display: 'flex',
//               justifyContent: 'center',marginLeft:{sm:"243px",xs:"114px"},
//               marginTop: { xs: '-11px', sm: '-11px', md: '0' },
//             }}
//           >
//              {landingPageData.map((data, index) => (
//               <Box key={index}>
//             <img
//               // src={base64Image || "/images/team.png"}
//               src={`data:image/png;base64,${data.imageBase64}`}
//               alt="Home Page Image"
//               style={{
//                 width: '70%',
//                 height: 'auto',
//                 objectFit: 'contain',
//               }}
//             />
//             </Box>))}
//           </Box>
//           <Box></Box>
//           <Box>
//             {landingPageData.map((data, index) => (
//               <Box key={index}>
//                 <Typography
//                   sx={{
//                     fontSize: '13px',
//                     color: '#7B7B7B',
//                     fontWeight: '400',
//                     marginBottom: '20px',
//                     display: { xs: 'block', md: 'none' }, // Visible only on mobile view
//                     textAlign: 'center', // Center align for better appearance
//                     padding: '0 16px', // Optional padding for spacing
//                   }}
//                 >
//                   {Parser(data.cardDescription)}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             display: { xs: 'flex', md: 'none' },
//             justifyContent: 'center',
//             marginTop: 2,
//           }}
//         >
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#1F64FF',
//               color: '#fff',
//               textTransform: 'none',
//               fontWeight: '500',
//               '&:hover': { backgroundColor: '#1653cc' },
//             }}
//           >
//             <Link
//               href="/register"
//               style={{ textDecoration: 'none', color: '#fff' }}
//             >
//               Register Society
//             </Link>
//           </Button>
//         </Box>
//         <Box
//           sx={{
//             width: '202%',
//             height: {
//               sm: '13px',
//               xs: '13px',
//               md: '21px',
//               lg: '12px',
//               xl: '12px',
//             },
//             backgroundColor: '#1F64FF',
//             transform: {
//               xs: 'rotate(-9deg)', // Small screens
//               sm: 'rotate(-9deg)', // Small-medium screens
//               md: 'rotate(-6deg)', // Medium screens and up
//               lg: 'rotate(-6deg)', // Large screens
//               xl: 'rotate(-5.3deg)', // Extra large screens
//             },
//             transformOrigin: 'left',
//             marginTop: { xs: '20%', md: '4%' },
//           }}
//         ></Box>
//       </Box>
//       <Box
//         sx={{
//           // '::after': {
//           // content: '""',
//           position: 'absolute',
//           width: '202%',
//           height: '134px',
//           marginTop: '-2px',
//           marginLeft: '0',
//           background: 'white',
//           transform: {
//             xs: 'rotate(-9deg)', // Small screens
//             sm: 'rotate(-9deg)', // Small-medium screens
//             md: 'rotate(-6deg)', // Medium screens and up
//             lg: 'rotate(-6deg)', // Large screens
//             xl: 'rotate(-5.3deg)', // Extra large screens
//           },
//           transformOrigin: 'left',
//           '::after': {
//             content: '""',
//             position: 'absolute',
//             width: '202%',
//             height: '134px',
//             background: 'white',
//             bottom: '-35px',
//             right: '0',
//           },
//           // }
//         }}
//       ></Box>
//     </Box>
//   );
// };

// export default Banner;

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { Typography } from '@mui/material';
import { fetchLandingSectionData } from '@/src/actions/landingPage';
import Parser from 'html-react-parser';
type Props = {};
interface LandingPageData {
  cardTitle: string;
  cardDescription: string;
  cardSubTitle: string;
  buttonText: string;
}

const Banner = (props: Props) => {
  const [landingPageData, setLandingPageData] = useState([]);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    const getTheLandingSectionData = async () => {
      try {
        const response = await fetchLandingSectionData('HEADER');
        console.log('getTheLandingSectionData in header', response.data); // Update the state with fetched data
        // console.log('getTheLandingSectionData in header for image', response.data[0].imageBase64); // Update the state with fetched data
        // setLandingPageData(response);
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

  console.log('landing page in State', base64Image);
  return (
    <Box
      sx={{
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'hidden',
      }}
    >
      <Box
        sx={{
          background: '#C4DBF7',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
            padding: { xs: 2, md: 5 },
            // marginTop: { xs: 2, md: '-4rem' },
            flex: 1,
            // background: 'blue'
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: '38%' },
              textAlign: { xs: 'center', md: 'left' },
              padding: 2,
              marginTop: { xs: '0rem', sm: '0rem', md: '5rem', lg: '1rem' },
              marginLeft: { xs: 0, md: '5rem' },
              // background: 'blue'
            }}
          >
            {landingPageData.map((data, index) => (
              <Box key={index}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: '23px', // Small screen font size
                      sm: '23px', // Small-medium screen font size
                      md: '48px', // Medium and larger screens font size
                      lg: '48px',
                      xl: '42px',
                    },
                    color: '#1F64FF',
                    margin: 0,
                  }}
                >
                  {data.cardTitle}{' '}
                  <span style={{ fontWeight: '700' }}>{data.cardSubTitle}</span>
                </Typography>

                <Typography
                  sx={{
                    fontSize: '18px',
                    color: '#7B7B7B',
                    fontWeight: '400',
                    marginBottom: '20px',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  {Parser(data.cardDescription)}
                </Typography>
                {/* </Box>
          ))} */}
                <Button
                  variant="contained"
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    backgroundColor: '#1F64FF',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: '500',
                    '&:hover': { backgroundColor: '#1653cc' },
                  }}
                >
                  <Link
                    href="/register"
                    style={{ textDecoration: 'none', color: '#fff' }}
                  >
                    {data.buttonText}
                  </Link>
                </Button>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              justifyContent: 'center', marginLeft: { sm: "243px", xs: "114px" },
              marginTop: { xs: '-11px', sm: '-11px', md: '0' },
            }}
          >
            {landingPageData.map((data, index) => (
              <Box key={index}>
                <img
                  // src={base64Image || "/images/team.png"}
                  src={`data:image/png;base64,${data.imageBase64}`}
                  alt="Home Page Image"
                  style={{
                    width: '70%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </Box>))}
          </Box>
          <Box></Box>
          <Box>
            {landingPageData.map((data, index) => (
              <Box key={index}>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: '#7B7B7B',
                    fontWeight: '400',
                    marginBottom: '20px',
                    display: { xs: 'block', md: 'none' }, // Visible only on mobile view
                    textAlign: 'center', // Center align for better appearance
                    padding: '0 16px', // Optional padding for spacing
                  }}
                >
                  {Parser(data.cardDescription)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1F64FF',
              color: '#fff',
              textTransform: 'none',
              fontWeight: '500',
              '&:hover': { backgroundColor: '#1653cc' },
            }}
          >
            <Link
              href="/register"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              Register Society
            </Link>
          </Button>
        </Box>
        <Box
          sx={{
            width: '202%',
            height: {
              sm: '13px',
              xs: '13px',
              md: '21px',
              lg: '12px',
              xl: '12px',
            },
            backgroundColor: '#1F64FF',
            transform: {
              xs: 'rotate(-9deg)', // Small screens
              sm: 'rotate(-9deg)', // Small-medium screens
              md: 'rotate(-6deg)', // Medium screens and up
              lg: 'rotate(-6deg)', // Large screens
              xl: 'rotate(-5.3deg)', // Extra large screens
            },
            transformOrigin: 'left',
            marginTop: { xs: '20%', md: '4%' },
          }}
        ></Box>
      </Box>
      <Box
        sx={{
          // '::after': {
          // content: '""',
          position: 'absolute',
          width: '202%',
          height: '134px',
          marginTop: '-2px',
          marginLeft: '0',
          background: 'white',
          transform: {
            xs: 'rotate(-9deg)', // Small screens
            sm: 'rotate(-9deg)', // Small-medium screens
            md: 'rotate(-6deg)', // Medium screens and up
            lg: 'rotate(-6deg)', // Large screens
            xl: 'rotate(-5.3deg)', // Extra large screens
          },
          transformOrigin: 'left',
          '::after': {
            content: '""',
            position: 'absolute',
            width: '202%',
            height: '134px',
            background: 'white',
            bottom: '-35px',
            right: '0',
          },
          // }
        }}
      ></Box>
    </Box>
  );
};

export default Banner;
