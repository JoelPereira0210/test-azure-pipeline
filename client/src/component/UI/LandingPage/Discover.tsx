
// 'use client';
// import React, { useEffect, useState } from 'react';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { Box, Typography, Button, IconButton, Container } from '@mui/material';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, EffectCoverflow } from 'swiper/modules';
// import 'swiper/css';
// import Parser from 'html-react-parser';
// import 'swiper/css/navigation';
// import { ImQuotesLeft } from 'react-icons/im';
// import { ImQuotesRight } from 'react-icons/im';
// import { fetchLandingSectionData } from '@/src/actions/landingPage';

// export default function Plans() {
//   const [landingPageData, setLandingPageData] = useState([]);
//   const [base64Image, setBase64Image] = useState<string | null>(null);
//   const [sliderData, setSliderData] = useState([]);
//   useEffect(() => {
//     const getTheLandingSectionData = async () => {
//       try {
//         const response = await fetchLandingSectionData('DISCOVER');
//         console.log('getTheLandingSectionData in header', response);
//         setLandingPageData(response?.data || []); // Set landing cards from response
//         setSliderData(response?.formattedSliderCards
//           || []);
//         // setLandingPageData(response); // Set landing page data
//         // setSliderData(response?.sliderCards || []); // Set slider cards from response
//         if (response?.formattedSliderCards?.length > 0) {
//           const firstSliderCardImage = response.formattedSliderCards[0].imageBase64;
//           if (firstSliderCardImage) {
//             setBase64Image(firstSliderCardImage);
//           }
//         }
  
//         if (response?.[0]?.imageBase64) {
//           setBase64Image(response[0].imageBase64);
//         }
//       } catch (error) {
//         console.error('Error fetching landing section data:', error);
//       }
//     };
//     getTheLandingSectionData();
//   }, []);

//   console.log('sliderData', sliderData);
//   console.log('landingPageData', landingPageData);

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeCard, setActiveCard] = useState(0);

//   const isMobile = useMediaQuery('(max-width: 600px)'); // Check if the screen is mobile

//   const handleNavigation = (direction) => {
//     if (direction === 'left') {
//       setActiveCard((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
//     } else {
//       setActiveCard((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
//     }
//   };

//   return (
//     <Box
//       sx={{
//         mt: { xs: '29px', sm: '29px' },
//         padding: { xs: '16px', md: '34px 147px 0px 147px' },
//         position: 'relative',
//       }}
//     >
//       <Box
//         sx={{
//           mt: { xs: 9, md: 8 },
//           textAlign: 'left',
//         }}
//       >
//         {landingPageData.map((data, index) => (
//           <Box key={index}>
//             <Box
//               sx={{
//                 backgroundColor: 'white',
//                 border: '1px solid #1F64FF',
//                 padding: '8px 16px',
//                 borderRadius: '4px',
//                 position: 'absolute',
//                 top: { md: 32, lg: 32, xl: 32, xs: 17, sm: 17 },

//                 zIndex: 1, // Ensure it stays on top
//               }}
//             >
//               <Typography
//                 variant="overline"
//                 sx={{
//                   fontWeight: 'bold',
//                   color: '#1F64FF',
//                 }}
//               >
//                 {data.buttonText}
//               </Typography>
//             </Box>
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: 'bold',
//                 color: '#1F64FF',
//               }}
//             >
//               {data.cardTitle}
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 color: '#73788C',
//                 mt: { xs: 2, md: 2 },
//               }}
//             >
//               {Parser(data.cardDescription)}
//             </Typography>
//           </Box>
//         ))}
//       </Box>

//       {/* Cards Section */}

//       {isMobile ? (
//         <Container
//         maxWidth="md"
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           flexDirection: 'column',
//           position: 'relative', // Ensure relative positioning for absolute child elements
//         }}
//       >
//         {/* Card Section */}
//         <Box
//           sx={{
//             boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
//             border: '1px solid #E5E5E599',
//             // maxWidth: '978px',
//             width:"85%",
//             overflow: 'hidden',
//             margin: '0 auto',
//             marginTop: '6%',
//             padding: '16px', // Add padding inside the card
//             position: 'relative', // Relative positioning for the card
//           }}
//         >
//           {sliderData.length > 0 && (
//             <>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   gap: '27%',
//                   padding: '10px 10px 10px 10px',
//                 }}
//               >
//                 <Box sx={{ textAlign: 'justify', wordBreak: 'break-all',width:"max-content" }}>
//                   <Typography fontWeight={700} mb={1} fontSize={24}>
//                     {sliderData[activeCard]?.cardTitle}
//                   </Typography>
//                   <Box sx={{width:"max-content"}}>
//                   <Typography fontSize={15} mt={1}>
//                     {sliderData[activeCard]?.cardSubTitle}
//                   </Typography></Box>
//                   <Box sx={{width:"max-content"}}>
//                   <Typography fontSize={10} mt={3}>
//                     {sliderData[activeCard]?.source}
//                   </Typography></Box>
//                 </Box>
//                 <Box>
//                   <img
//                     // src="/images/percentage.png"
//                     src={`data:image/png;base64,${sliderData[activeCard]?.imageBase64}`}
//                     alt="Description of image"
//                     style={{ width: '100%', height: 'auto' }}
//                   />
//                 </Box>
//               </Box>
//             </>
//           )}
//         </Box>
      
//         {/* Back Arrow */}
//         <IconButton
//           onClick={() => handleNavigation('left')}
//           sx={{
//             position: 'absolute',
//             left: '-11px', // Space between the left arrow and the card
//             top: '55%',
//             transform: 'translateY(-50%)',
//             zIndex: 10,
//             color: '#FEFEFF',
//             border: '2px solid #0056F6',
//             borderRadius: '50%',
//             backgroundColor: '#1F64FF',
//             '&:hover': {
//               backgroundColor: '#1F64FF',
//             },
//           }}
//         >
//           <ArrowBackIosIcon />
//         </IconButton>
      
//         {/* Forward Arrow */}
//         <IconButton
//           onClick={() => handleNavigation('right')}
//           sx={{
//             position: 'absolute',
//             right: '-11px', // Space between the right arrow and the card
//             top: '55%',
//             transform: 'translateY(-50%)',
//             zIndex: 10,
//             color: '#FEFEFF',
//             border: '2px solid #0056F6',
//             borderRadius: '50%',
//             backgroundColor: '#1F64FF',
//             '&:hover': {
//               backgroundColor: '#1F64FF',
//             },
//           }}
//         >
//           <ArrowForwardIosIcon />
//         </IconButton>
//       </Container>
      
//       ) : (
//         <Box
//           sx={{
//             maxWidth: '978px',
//             overflow: 'hidden',
//             margin: '0 auto',
//             marginTop: '-3%',
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'flex-end',
//               width: '100%',
//               mt: 5,
//               gap: '4%',
//               marginBottom: '9%',
//             }}
//           >
//             <IconButton
//               className="swiper-button-prev desktop-prev-next-btn"
//               sx={{
//                 color: '#FEFEFF',
//                 border: '2px solid #0056F6',
//                 borderRadius: '50%',
//                 width: '40px', // Adjusted size for smaller circle
//                 height: '2rem', // Adjusted size for smaller circle
//                 padding: '28px', // Reduced padding for smaller icons
//                 backgroundColor: '#1F64FF',
//                 mr: 1,
//                 '&:hover': {
//                   backgroundColor: '#1F64FF', // Keep the background color the same on hover
//                 },
//               }}
//             ></IconButton>
//             <IconButton
//               className="swiper-button-next .desktop-prev-next-btn"
//               sx={{
//                 color: '#FEFEFF',
//                 border: '2px solid #0056F6',
//                 borderRadius: '50%',
//                 width: '40px', // Adjusted size for smaller circle
//                 height: '40px', // Adjusted size for smaller circle
//                 padding: '28px', // Reduced padding for smaller icons
//                 backgroundColor: '#1F64FF',
//                 ml: 1,
//                 '&:hover': {
//                   backgroundColor: '#1F64FF', // Keep the background color the same on hover
//                 },
//               }}
//             ></IconButton>
//           </Box>
//           <Box
//             sx={{ marginRight: '-73px', marginLeft: '-62px', display: 'block' }}
//           >
//             <Swiper
//               effect="coverflow"
//               grabCursor={true}
//               centeredSlides={true}
//               slidesPerView={3}
//               loop={true}
//               onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
//               coverflowEffect={{
//                 rotate: -2,
//                 stretch: 40,
//                 depth: 10,
//                 modifier: 1,
//                 slideShadows: false,
//               }}
//               spaceBetween={0}
//               navigation={{
//                 nextEl: '.swiper-button-next',
//                 prevEl: '.swiper-button-prev',
//               }}
//               modules={[EffectCoverflow, Navigation]}
//               breakpoints={{
//                 320: { slidesPerView: 1 },
//                 768: { slidesPerView: 3 },
//               }}
//             >
//               {sliderData.map((plan, index) => (
//                 <SwiperSlide key={index}>
//                   <Box
//                     sx={{
//                       marginTop: activeIndex === index ? '3%' : '7%',
//                       marginBottom: activeIndex === index ? '12px' : '',
//                       marginLeft: activeIndex === index ? '4%' : '-2px',
//                       marginRight: activeIndex === index ? '4%' : '11px',
//                       // border:
//                       //   activeIndex === index
//                       //     ? '2px solid #007FFF'
//                       //     : '1px solid #ddd',
//                       boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
//                       border: '1px solid #E5E5E599',
//                       borderRadius: '16px',
//                       textAlign: 'center',
//                       padding: activeIndex === index ? '2.9rem' : '2rem',
//                       backgroundColor:
//                         activeIndex === index ? '#FFFFFF' : '#fff',
//                       color: '#000',
//                       transform:
//                         activeIndex === index ? 'scale(1.05)' : 'scale(0.9)',
//                       transition: 'all 0.3s ease',
//                       height: 'auto',
//                     }}
//                   >
//                     <Box sx={{ display: 'flex', gap: '4%' }}>
//                       <Box>
//                         <Box
//                           sx={{ textAlign: 'justify', wordBreak: 'break-all' ,width:"max-content"}}
//                         >
//                           <Typography fontWeight={700} mb={1} fontSize={24}>
//                             {plan.cardTitle}
//                           </Typography>
//                         </Box>
//                         <Box
//                           sx={{
//                             textAlign: 'justify',
//                             marginTop: '-6%',
//                             wordBreak: 'break-all',width:"max-content"
//                           }}
//                         >
//                           <Typography fontSize={15}>
//                             {plan.cardSubTitle}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ textAlign: 'justify', marginTop: '31%' ,width:"max-content"}}>
//                           <Typography fontSize={10} mt={2}>
//                             {plan.source}
//                           </Typography>
//                         </Box>
//                       </Box>

//                       <Box sx={{width:"fit-content"}}>
//                         <img
//                           // src="/images/percentage.png"
//                           src={`data:image/png;base64,${plan.imageBase64}`}
//                           alt="Description of image"
//                           style={{ width: '50%', height: 'auto',marginLeft:"30%"
//                            }}
//                         />
//                       </Box>
//                     </Box>
//                   </Box>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// }


'use client';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Typography, Button, IconButton, Container } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import Parser from 'html-react-parser';
import 'swiper/css/navigation';
import { ImQuotesLeft } from 'react-icons/im';
import { ImQuotesRight } from 'react-icons/im';
import { fetchLandingSectionData } from '@/src/actions/landingPage';

export default function Plans() {
  const [landingPageData, setLandingPageData] = useState([]);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [sliderData, setSliderData] = useState([]);
  useEffect(() => {
    const getTheLandingSectionData = async () => {
      try {
        const response = await fetchLandingSectionData('DISCOVER');
        console.log('getTheLandingSectionData in header', response);
        setLandingPageData(response?.data || []); // Set landing cards from response
        setSliderData(response?.formattedSliderCards
          || []);
        // setLandingPageData(response); // Set landing page data
        // setSliderData(response?.sliderCards || []); // Set slider cards from response
        if (response?.formattedSliderCards?.length > 0) {
          const firstSliderCardImage = response.formattedSliderCards[0].imageBase64;
          if (firstSliderCardImage) {
            setBase64Image(firstSliderCardImage);
          }
        }
  
        if (response?.[0]?.imageBase64) {
          setBase64Image(response[0].imageBase64);
        }
      } catch (error) {
        console.error('Error fetching landing section data:', error);
      }
    };
    getTheLandingSectionData();
  }, []);

  console.log('sliderData', sliderData);
  console.log('landingPageData', landingPageData);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  const isMobile = useMediaQuery('(max-width: 600px)'); // Check if the screen is mobile

  const handleNavigation = (direction) => {
    if (direction === 'left') {
      setActiveCard((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
    } else {
      setActiveCard((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <Box
      sx={{
        mt: { xs: '29px', sm: '29px' },
        padding: { xs: '16px', md: '34px 147px 0px 147px' },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          mt: { xs: 9, md: 8 },
          textAlign: 'left',
        }}
      >
        {landingPageData.map((data, index) => (
          <Box key={index}>
            <Box
              sx={{
                backgroundColor: 'white',
                border: '1px solid #1F64FF',
                padding: '8px 16px',
                borderRadius: '4px',
                position: 'absolute',
                top: { md: 32, lg: 32, xl: 32, xs: 17, sm: 17 },

                zIndex: 1, // Ensure it stays on top
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 'bold',
                  color: '#1F64FF',
                }}
              >
                {data.buttonText}
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1F64FF',
              }}
            >
              {data.cardTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#73788C',
                mt: { xs: 2, md: 2 },
              }}
            >
              {Parser(data.cardDescription)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Cards Section */}

      {isMobile ? (
        <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative', // Ensure relative positioning for absolute child elements
        }}
      >
        {/* Card Section */}
        <Box
          sx={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E5E5E599',
            // maxWidth: '978px',
            width:"85%",
            overflow: 'hidden',
            margin: '0 auto',
            marginTop: '6%',
            padding: '16px', // Add padding inside the card
            position: 'relative', // Relative positioning for the card
          }}
        >
          {sliderData.length > 0 && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: '27%',
                  padding: '10px 10px 10px 10px',
                }}
              >
                <Box sx={{ textAlign: 'justify', wordBreak: 'break-all',width:"max-content" }}>
                  <Typography fontWeight={700} mb={1} fontSize={24}>
                    {sliderData[activeCard]?.cardTitle}
                  </Typography>
                  <Box sx={{width:"max-content"}}>
                  <Typography fontSize={15} mt={1}>
                    {sliderData[activeCard]?.cardSubTitle}
                  </Typography></Box>
                  <Box sx={{width:"max-content"}}>
                  <Typography fontSize={10} mt={3}>
                    {sliderData[activeCard]?.source}
                  </Typography></Box>
                </Box>
                <Box>
                  <img
                    // src="/images/percentage.png"
                    src={`data:image/png;base64,${sliderData[activeCard]?.imageBase64}`}
                    alt="Description of image"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      
        {/* Back Arrow */}
        <IconButton
          onClick={() => handleNavigation('left')}
          sx={{
            position: 'absolute',
            left: '-11px', // Space between the left arrow and the card
            top: '55%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: '#FEFEFF',
            border: '2px solid #0056F6',
            borderRadius: '50%',
            backgroundColor: '#1F64FF',
            '&:hover': {
              backgroundColor: '#1F64FF',
            },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      
        {/* Forward Arrow */}
        <IconButton
          onClick={() => handleNavigation('right')}
          sx={{
            position: 'absolute',
            right: '-11px', // Space between the right arrow and the card
            top: '55%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: '#FEFEFF',
            border: '2px solid #0056F6',
            borderRadius: '50%',
            backgroundColor: '#1F64FF',
            '&:hover': {
              backgroundColor: '#1F64FF',
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Container>
      
      ) : (
        <Box
          sx={{
            maxWidth: '978px',
            overflow: 'hidden',
            margin: '0 auto',
            marginTop: '-3%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              mt: 5,
              gap: '4%',
              marginBottom: '9%',
            }}
          >
            <IconButton
              className="swiper-button-prev desktop-prev-next-btn"
              sx={{
                color: '#FEFEFF',
                border: '2px solid #0056F6',
                borderRadius: '50%',
                width: '40px', // Adjusted size for smaller circle
                height: '2rem', // Adjusted size for smaller circle
                padding: '28px', // Reduced padding for smaller icons
                backgroundColor: '#1F64FF',
                mr: 1,
                '&:hover': {
                  backgroundColor: '#1F64FF', // Keep the background color the same on hover
                },
              }}
            ></IconButton>
            <IconButton
              className="swiper-button-next .desktop-prev-next-btn"
              sx={{
                color: '#FEFEFF',
                border: '2px solid #0056F6',
                borderRadius: '50%',
                width: '40px', // Adjusted size for smaller circle
                height: '40px', // Adjusted size for smaller circle
                padding: '28px', // Reduced padding for smaller icons
                backgroundColor: '#1F64FF',
                ml: 1,
                '&:hover': {
                  backgroundColor: '#1F64FF', // Keep the background color the same on hover
                },
              }}
            ></IconButton>
          </Box>
          <Box
            sx={{ marginRight: '-73px', marginLeft: '-62px', display: 'block' }}
          >
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              loop={true}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              coverflowEffect={{
                rotate: -2,
                stretch: 40,
                depth: 10,
                modifier: 1,
                slideShadows: false,
              }}
              spaceBetween={0}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              modules={[EffectCoverflow, Navigation]}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
              }}
            >
              {sliderData.map((plan, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      marginTop: activeIndex === index ? '3%' : '7%',
                      marginBottom: activeIndex === index ? '12px' : '',
                      marginLeft: activeIndex === index ? '4%' : '-2px',
                      marginRight: activeIndex === index ? '4%' : '11px',
                      // border:
                      //   activeIndex === index
                      //     ? '2px solid #007FFF'
                      //     : '1px solid #ddd',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                      border: '1px solid #E5E5E599',
                      borderRadius: '16px',
                      textAlign: 'center',
                      padding: activeIndex === index ? '2.9rem' : '2rem',
                      backgroundColor:
                        activeIndex === index ? '#FFFFFF' : '#fff',
                      color: '#000',
                      transform:
                        activeIndex === index ? 'scale(1.05)' : 'scale(0.9)',
                      transition: 'all 0.3s ease',
                      height: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: '4%' }}>
                      <Box>
                        <Box
                          sx={{ textAlign: 'justify', wordBreak: 'break-all' ,width:"max-content"}}
                        >
                          <Typography fontWeight={700} mb={1} fontSize={24}>
                            {plan.cardTitle}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            textAlign: 'justify',
                            marginTop: '-6%',
                            wordBreak: 'break-all',width:"max-content"
                          }}
                        >
                          <Typography fontSize={15}>
                            {plan.cardSubTitle}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'justify', marginTop: '31%' ,width:"max-content"}}>
                          <Typography fontSize={10} mt={2}>
                            {plan.source}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{width:"fit-content"}}>
                        <img
                          // src="/images/percentage.png"
                          src={`data:image/png;base64,${plan.imageBase64}`}
                          alt="Description of image"
                          style={{ width: '50%', height: 'auto',marginLeft:"30%"
                           }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      )}
    </Box>
  );
}