import { fetchLandingSectionData } from '@/src/actions/landingPage';
import { Box, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import Parser from "html-react-parser";

interface LandingPageData {
  cardTitle: string;
  cardDescription: string;
  cardSubTitle: string;
  buttonText: string;
}

const AboutPage = () => {
  const [landingPageData, setLandingPageData] = useState([]);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  useEffect(() => {
    const getTheLandingSectionData = async () => {
      try {
        const response = await fetchLandingSectionData('ABOUT_US');
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

  return (
    <Box
      sx={{
        padding: { xs: '16px', md: '0px 147px' },
        position: 'relative',
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start', // Ensure all content aligns at the top
          mt: 4, // Add top margin
        }}
      >
        {/* Text Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
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
        </Grid>










        {/* Image Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // Align image with top
            position: 'relative', // Ensure proper alignment
          }}
        >
          {landingPageData.map((data, index) => (
                         <Box key={index}>
          <img
           src={`data:image/png;base64,${data.imageBase64}`}
            alt="Community Illustration"
            style={{
              maxWidth: '100%',
              height: 'auto',
              marginTop: 0, // Remove any extra margin
            }}
          />
          </Box>))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutPage;