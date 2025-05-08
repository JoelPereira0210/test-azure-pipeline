import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  AuthenticatedRequest,
  authenticateMembership,
  authenticateRole,
  authenticateToken,
} from '../../middlewares/authorizeUser';
import CryptoJS from 'crypto-js';
import { CONFIG } from '../../utils/config';
import { safeJsonStringify } from '../../utils/helperFunction';

const prisma = new PrismaClient();
const landingRouter = express.Router();
const env = process.env.NODE_ENV || 'development';
const secretKey = CONFIG.SECRET_KEY;

// landingRouter.get('/fetch-landing-section-data', async (req, res) => {
//     const { sectionType } = req.query;
   
//     if (!sectionType) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required parameter: sectionType',
//       });
//     }
   
//     try {
//       // Fetch the landing cards based on the section type
//       const landingCards = await prisma.landingCard.findMany({
//         where: {
//           type: sectionType, // `type` should match the enum type
//         },
//       });
   
//       // Extract landing card IDs
//       const landingCardIds = landingCards.map((card) => card.landingCardId);
   
//       // Fetch associated media data for the landing cards
      // const mediaData = await prisma.media.findMany({
      //   where: {
      //     tableId: {
      //       in: landingCardIds, // Match any of the landing card IDs
      //     },
      //     tableType: 'landingPage', // Ensure it matches the tableType
      //   },
      // });
   
//       // Combine landing cards with their associated media
//       const formattedLandingCards = landingCards.map((card) => {
//         const media = mediaData.find((m) => m.tableId === card.landingCardId);
//         return {
//           ...card,
//           imageBase64: media ? Buffer.from(media.data).toString('base64') : null, // Convert buffer to Base64
//           imageId: media ? media.id : null, // Add `imageId` if media exists, else `null`
//         };
//       });
   
//       res.status(200).json({
//         success: true,
//         data: formattedLandingCards,
//       });
//     } catch (error: any) {
//       console.error('Error fetching data:', error.message);
//       res.status(500).json({
//         success: false,
//         message: error.message || 'Internal Server Error',
//       });
//     }
//   });

// export default landingRouter;


landingRouter.get('/fetch-landing-section-data', async (req: Request, res: Response) => {
  const { sectionType } = req.query;
console.log("fetch landing data section",sectionType)
  if (!sectionType) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameter: sectionType',
    });
  }

  try {
    // Fetch the landing cards based on the section type
    const landingCards = await prisma.landingCard.findMany({
      where: {
        type: sectionType as any, // `type` should match the enum type
      },
    });

    // Extract landing card IDs
    const landingCardIds = landingCards.map((card) => card.landingCardId);

    // Fetch associated media data for the landing cards
    const mediaData = await prisma.media.findMany({
      where: {
        tableId: {
          in: landingCardIds, // Match any of the landing card IDs
        },
        tableType: 'landingPage', // Ensure it matches the tableType
      },
    });

    // Combine landing cards with their associated media
    const formattedLandingCards = landingCards.map((card) => {
      const media = mediaData.find((m) => m.tableId === card.landingCardId);
      return {
        ...card,
        imageBase64: media ? Buffer.from(media.data).toString('base64') : null, // Convert buffer to Base64
        imageId: media ? media.id : null, // Add `imageId` if media exists, else `null`
      };
    });

    // New Step: Fetch all records from the sliderCard table for matched landingCardId
    const sliderCards = await prisma.sliderCard.findMany({
      where: {
        landingCardId: {
          in: landingCardIds, // Maseedch any of the landing card IDs
        },
      },
    });
    console.log("slidercat",sliderCards)
    const sliderCardIds = sliderCards.map((card) => card.sliderCardId);
    console.log("sliderId",sliderCardIds)
    const mediaDataslider = await prisma.media.findMany({
      where: {
        tableId: {
          in: sliderCardIds, // Match any of the landing card IDs
        },
        tableType: 'landingPage', // Ensure it matches the tableType
      },
    });

    console.log("media",mediaDataslider)
    const formattedSliderCards = sliderCards.map((card) => {
      const media = mediaDataslider.find((m) => m.tableId === card.sliderCardId);
      return {
        ...card,
        imageBase64: media ? Buffer.from(media.data).toString('base64') : null, // Convert buffer to Base64
        imageId: media ? media.id : null, // Add `imageId` if media exists, else `null`
      };
    });
    console.log('Fetched SliderCard Records:', formattedSliderCards); // Log all matched records

    res.status(200).json({
      success: true,
      data: formattedLandingCards,
      formattedSliderCards, // Include all sliderCard records in the response if needed
    });
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
});

export default landingRouter;