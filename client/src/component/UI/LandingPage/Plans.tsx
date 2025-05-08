import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Parser from "html-react-parser";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fetchLandingSectionData } from '@/src/actions/landingPage';
import { getPublishedSubscriptions } from '@/src/actions/auth';

export default function SubscriptionSwiper() {
  const [landingPageData, setLandingPageData] = useState([]);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    const getTheLandingSectionData = async () => {
      try {
        const response = await fetchLandingSectionData('PLANS');
        console.log('getTheLandingSectionData in headers', response.data); // Update the state with fetched data
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  const isMobile = useMediaQuery('(max-width: 600px)'); // Check if the screen is mobile

  const handleNavigation = (direction) => {
    if (direction === 'left') {
      setActiveCard((prev) =>
        prev === 0 ? subscriptions.length - 1 : prev - 1
      );
    } else {
      setActiveCard((prev) =>
        prev === subscriptions.length - 1 ? 0 : prev + 1
      );
    }
  };

  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getPublishedSubscriptions();
        if (response) {
          setActiveCard(3);
          setSubscriptions(response.data); // Assuming `response.data` contains the subscriptions.
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptions();
  }, []);
  console.log('Fetched Subscriptions:', subscriptions);

  return (
    <Box
      sx={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '7rem',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          border: '1px solid #1F64FF',
          padding: '8px 28px',
          borderRadius: '4px',
          left: { md: '11%', lg: '11%', xl: '11%', sm: '7%', xs: '7%' },
          position: 'absolute',
          top: { md: 32, lg: 32, xl: 32, xs: 17, sm: 17 },
        }}
      >
        {landingPageData.map((data, index) => (
          <Box key={index}>
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
        ))}
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          mb: '1rem',
          mt: { md: '4%', lg: '4%', xl: '4%', sm: '22%', xs: '22%' },
        }}
      >
        {landingPageData.map((data, index) => (
                         <Box key={index}>
          <Typography
            variant="h4"
            fontWeight={600}
            fontSize={{ xs: 22, sm: 24, md: 43, xl: 43, lg: 43 }} // Adjust font size for different screen sizes
            color="#1F64FF"
            gutterBottom
            sx={{ marginTop: { xs: '-5%', sm: '-5%' } }}
          >
        {data.cardTitle}
          </Typography>
          <Typography
            variant="body1"
            color="#00002259"
            sx={{
              fontSize: {
                xs: '13px',
                sm: '13px',
                md: '20px',
                xl: '20px',
                lg: '20px',
              },
            }} // Adjust font size for description
          >
                        {Parser(data.cardDescription)}
          </Typography>
          <Typography
            variant="h6"
            color="#000022BF"
            fontWeight={600}
            sx={{
              fontSize: {
                xs: '13px',
                sm: '13px',
                md: '20px',
                xl: '20px',
                lg: '20px',
              },
              mt: { xs: '16%', sm: '16%', md: '1%', lg: '1%', xl: '1%' },
            }} // Adjust font size for "Figure out ..."
          >
            {data.cardSubTitle}
          </Typography>
        </Box>))}
      </Box>

      {/* Conditionally render based on screen size */}
      {isMobile ? (
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              borderRadius: '12px',
              backgroundColor: '#0056F6',
              color: '#FFF',
              width: '100%',
              maxWidth: '350px',
              height: '310px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              padding: '24px',
              marginTop: '-41%',
            }}
          >
            {subscriptions.length > 0 && (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {subscriptions[activeCard]?.planName}
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold', my: 1 }}>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontWeight: 'normal',
                      color: '#00002259',
                      ml: 0.5,
                      left: '1%',
                      position: 'relative',
                      top: '-28px',
                    }}
                  >
                    Rs.
                  </Typography>{' '}
                  {subscriptions[activeCard]?.price}
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      color: '#00002259',
                      fontWeight: 'normal',
                      ml: 0.5,
                      verticalAlign: 'middle',
                    }}
                  >
                    /m
                  </Typography>
                </Typography>
                <ul
                  style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: '17px',
                    marginLeft: '-43%',
                  }}
                >
                  <li style={{ marginBottom: '8px' }}>
                    ✔ {subscriptions[activeCard]?.duration} Months <br />
                    <li style={{ marginLeft: '-20%' }}>
                      ✔ {subscriptions[activeCard]?.maxUsers} Uses{' '}
                    </li>
                  </li>
                </ul>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#FFF',
                    color: '#0056F6',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    padding: '7px 33px',
                    boxShadow: 'none',
                  }}
                >
                  Subscribe
                </Button>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              mt: 2,
              gap: '10%',
            }}
          >
            <IconButton
             className="swiper-button-prev desktop-prev-next-btn"
              onClick={() => handleNavigation('left')}
              sx={{
                color: '#FEFEFF',
                border: '2px solid #0056F6',
                borderRadius: '50%',
                padding: '8px',
                fontSize: '1rem',
                backgroundColor: '#1F64FF',
                '&:hover': {
                  backgroundColor: '#1F64FF', // Keep the background color the same on hover
                },
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={() => handleNavigation('right')}
               className="swiper-button-next .desktop-prev-next-btn"
              sx={{
                color: '#FEFEFF',
                border: '2px solid #0056F6',
                borderRadius: '50%',
                padding: '8px',
                fontSize: '1rem',
                backgroundColor: '#1F64FF',
                '&:hover': {
                  backgroundColor: '#1F64FF', // Keep the background color the same on hover
                },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Container>
      ) : (
        <Box
          sx={{
            maxWidth: '1200px',
            overflow: 'hidden',
            margin: '0 auto',
            marginTop: '-5%',
          }}
        >
          <Box sx={{ marginRight: '-63px', marginLeft: '-61px' }}>
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
              navigation={true}
              modules={[EffectCoverflow, Navigation]}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
              }}
            >
              {subscriptions.map((plan, index) => (
                <SwiperSlide
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                    // const swiper = e.target.closest('.swiper').swiper;
                    // swiper.slideToLoop(index, 0);
                    const target = e.target as HTMLElement; // Cast to HTMLElement
                    const swiperElement = target.closest('.swiper') as HTMLElement | null;
            
                    if (swiperElement && 'swiper' in swiperElement) {
                        const swiper = (swiperElement as any).swiper; // Safely access swiper
                        swiper.slideToLoop(index, 0);
                    }
                  }}
                >
                  <Box
                    sx={{
                      border:
                        activeIndex === index
                          ? '2px solid #007FFF'
                          : '1px solid #ddd',
                      borderRadius: activeIndex === index ?"30px" : '16px',
                      textAlign: 'center',
                      padding: '2rem',
                      backgroundColor:
                        activeIndex === index ? '#007FFF' : '#fff',
                      color: activeIndex === index ? '#fff' : '#000',
                      transform:
                        activeIndex === index ? 'scale(1.05)' : 'scale(0.9)',
                      transition: 'all 0.3s ease',
                      height: 'auto',
                    }}
                  >
                    <Box sx={{ marginTop: '10%', marginBottom: '-6%' }}>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        mb={1}
                        fontSize={20}
                        sx={{ position: 'relative', top: '10px' }}
                      >
                        {plan.planName}
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight={800}
                        marginTop={1}
                        color={activeIndex === index ? 'inherit' : '#000000'}
                        sx={{ position: 'relative', top: '10px' }}
                      >
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            fontWeight: 'normal',
                            color: '#00002259',
                            ml: 0.5,
                            left: '1%',
                            position: 'relative',
                            top: '-28px',
                          }}
                        >
                          Rs.
                        </Typography>{' '}
                        {plan.price}
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{
                            color: '#00002259',
                            fontWeight: 'normal',
                            ml: 0.5,
                            verticalAlign: 'middle',
                          }}
                        >
                          /m
                        </Typography>
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      mt={2}
                      color={activeIndex === index ? '#FFFFFF' : '#000000'}
                      sx={{
                        lineHeight: '1.8',
                        textAlign: 'justify',
                        fontSize: '16px',
                        marginTop: '3%',
                        position: 'relative',
                        top: '80px',
                        left: '33px',
                      }}
                    >
                      ✔ {plan.duration} Months
                      <br />✔ {plan.maxUsers} Uses
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{
                        width: '90%',
                        padding: '4%',
                        marginTop: '60%',
                        backgroundColor:
                          activeIndex === index ? '#fff' : '#007FFF',
                        color: activeIndex === index ? '#1F64FF' : '#FFFFFF',
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor:
                            activeIndex === index ? '#fff' : '#007FFF', // Keep the background color the same on hover
                        },
                        fontWeight: activeIndex === index ? '700' : '',
                      }}
                    >
                      {index === 0 ? 'Get Free' : 'Subscribe'}
                    </Button>
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
