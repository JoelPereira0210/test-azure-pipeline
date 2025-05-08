import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import {
    generateOTP,
    createPhoneNumber,
    compareString,
    hashString,
    createBase64,
    encryptValues,
    safeJsonStringify,
} from '../../utils/helperFunction';
import { CONFIG } from '../../utils/config';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import {
    authenticateRole,
    authenticateSuperAdmin,
    authenticateToken,
} from '../../middlewares/authorizeUser';
import parsePhoneNumberFromString from 'libphonenumber-js';
const env = process.env.NODE_ENV || 'development';
const secretKey = CONFIG.SECRET_KEY;

// Load the appropriate .env file
dotenv.config({ path: `.env.${env}` });
const superAdminRouter = express.Router();
const prisma = new PrismaClient();

superAdminRouter.get('/subscriptions',
     authenticateToken, 
     authenticateSuperAdmin, 
     async (req: any, res: Response) => {
    const param = req.query.type;


    try {
        const userId = req.user?.id;
        let subscriptions;
        switch (param) {
            case 'active': {
                subscriptions = await prisma.subscriptionMaster.findMany({
                    where: { shouldPublish: true, isDeleted: 'NOT_DELETED' },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                break;
            }
            case 'draft': {
                subscriptions = await prisma.subscriptionMaster.findMany({
                    where: { shouldPublish: false, isDeleted: 'NOT_DELETED' },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                // console.log("draft", subscriptions)

                break;
            }
            case 'deleted': {
                subscriptions = await prisma.subscriptionMaster.findMany({
                    where: { isDeleted: 'SOFT_DELETED' },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                // console.log("deleted", subscriptions)
                break;
            }
            default: {
                subscriptions = await prisma.subscriptionMaster.findMany({
                    orderBy: {
                        createdAt: 'asc'
                    }
                });
                break;
            }
        }
        // subscriptions = await prisma.subscriptionMaster.findMany({
        //     orderBy: {
        //         createdAt: 'asc'
        //     }
        // });
        return res.json(JSON.parse(safeJsonStringify(subscriptions)));
    } catch (error) {
        console.log("error", error)
        return res.json({ error: error });
    }
});
superAdminRouter.post('/create-subscription',
     authenticateToken, authenticateSuperAdmin,
      async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const body = req.body;
        // console.log("uid", userId)
        const subscription = await prisma.subscriptionMaster.create({
            data: {
                planName: body?.planName,
                planDescription: body?.planDescription,
                maxUsers: body?.maxUsers,
                duration: body?.duration,
                price: body?.amount,
                createdById: userId,
                modifiedById: userId,
                createdAt: new Date(),
                modifiedAt: new Date(),
                shouldPublish: body?.shouldPublish
            }
        })
        return res.status(200).json(JSON.parse(safeJsonStringify({ subscription })))
    } catch (error) {
        console.log("error", error)
        return res.json({ error: error });
    }
});
superAdminRouter.patch('/update-subscription/:subscriptionId',
     authenticateToken, authenticateSuperAdmin, 
     async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { subscriptionId } = req.params;
        const body = req.body;
        const subscription = await prisma.subscriptionMaster.update({
            where: { subscriptionId },
            data: {
                planName: body?.planName,
                planDescription: body?.planDescription,
                maxUsers: body?.maxUsers,
                duration: body?.duration,
                price: body?.amount,
                createdById: userId,
                modifiedById: userId,
                modifiedAt: new Date(),
                shouldPublish: body?.shouldPublish
            }
        })
        return res.status(200).json(JSON.parse(safeJsonStringify({ subscription })))
        // console.log("uid", userId)
        // const subscription = await prisma.subscriptionMaster.create({
        //     data: {
        //         planName: body?.planName,
        //         maxUsers: Number(body?.maxUsers),
        //         duration: Number(body?.duration),
        //         price: Number(body?.amount),
        //         createdById: userId,
        //         modifiedById: userId,
        //         createdAt: new Date()
        //     }
        // })
        // return res.status(200).json(JSON.parse(safeJsonStringify({ subscription })))
    } catch (error) {
        console.log("error", error)
        return res.json({ error: error });
    }
});
superAdminRouter.delete('/delete-subscription/:subscriptionId', 
    authenticateToken, authenticateSuperAdmin,
     async (req: any, res: Response) => {
    try {
        let { subscriptionId } = req.params;
        let { isDeleted } = req.body
        // subscriptionId = JSON.stringify(subscriptionId)
        console.log("subscriptionId", subscriptionId)
        console.log("isDeleted", isDeleted)
        let deleted = await prisma.subscriptionMaster.update({
            where: { subscriptionId },
            data: {
                isDeleted: isDeleted
            }
        })

        console.log("deleted subscription", deleted)
        return res.status(200).json({ message: "Subscription deleted", deleted })
    } catch (error) {
        console.log("error while deleting subscription", error)
        return res.status(500).json({ message: "error while deleting subscription" })
    }
})
superAdminRouter.get('/coupons',
     authenticateToken, authenticateSuperAdmin,
      async (req: any, res: Response) => {
    const param = req.query.type;


    try {
        const userId = req.user.id;
        let coupons;
        switch (param) {
            case 'active': {
                coupons = await prisma.coupons.findMany({
                    where: {
                        shouldPublish: true, isDeleted: 'NOT_DELETED',
                        uses: {
                            lt: prisma.coupons.fields.maxUses
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                break;
            }
            case 'expired': {
                coupons = await prisma.coupons.findMany({
                    where: {
                        isDeleted: 'NOT_DELETED',
                        uses: {
                            gte: prisma.coupons.fields.maxUses
                        }
                    }

                })
                break;
            }
            case 'draft': {
                coupons = await prisma.coupons.findMany({
                    where: {
                        shouldPublish: false, isDeleted: 'NOT_DELETED',
                        uses: {
                            lt: prisma.coupons.fields.maxUses
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                // console.log("draft", coupons)

                break;
            }
            case 'deleted': {
                coupons = await prisma.coupons.findMany({
                    where: { isDeleted: 'SOFT_DELETED' },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                // console.log("deleted", coupons)
                break;
            }
            default: {
                coupons = await prisma.coupons.findMany({
                    orderBy: {
                        createdAt: 'asc'
                    }
                });
                break;
            }
        }
        // coupons = await prisma.coupons.findMany({
        //     orderBy: {
        //         createdAt: 'asc'
        //     }
        // });
        return res.json(JSON.parse(safeJsonStringify(coupons)));
    } catch (error) {
        console.log("error", error)
        return res.json({ error: error });
    }
});
superAdminRouter.post('/create-coupon', 
    authenticateToken, authenticateSuperAdmin, 
    async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const body = req.body;
        console.log("uid", userId)
        console.log("ddd",req.body)
        const coupon = await prisma.coupons.create({
            data: {
                couponName: body?.couponName,
                couponCode: body?.couponCode,
                uses: '0',
                expiryDate: new Date(body?.expiryDate),
                maxUses: body?.maxUses,
                couponDescription: body?.couponDescription,
                societyId: body?.societyId,
                discountPercentage: body?.percentage,
                createdById: userId,
                modifiedById: userId,
                createdAt: new Date(),
                modifiedAt: new Date(),
                shouldPublish: body?.shouldPublish
            }
        })
        return res.status(200).json(JSON.parse(safeJsonStringify({ coupon })))
    } catch (error: any) {
        console.log("error", error)
        if (error?.code === "P2002") {
            return res.status(500).json({ message: 'Coupon code already exists' });
        } else {
            return res.status(500).json({ error: error });
        }
    }
});
superAdminRouter.patch('/update-coupon/:couponId',
     authenticateToken, authenticateSuperAdmin, 
     async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { couponId } = req.params;
        console.log("couponId", couponId)
        const body = req.body;
        const coupon = await prisma.coupons.update({
            where: { couponId },
            data: {
                couponName: body?.couponName,
                couponCode: body?.couponCode,
                expiryDate: new Date(body?.expiryDate),
                maxUses: body?.maxUses,
                couponDescription: body?.couponDescription,
                societyId: body?.societyId,
                discountPercentage: body?.percentage,
                modifiedById: userId,
                modifiedAt: new Date(),
                shouldPublish: body?.shouldPublish
            }
        })
        return res.status(200).json(JSON.parse(safeJsonStringify({ coupon })))
        // console.log("uid", userId)
        // const coupon = await prisma.coupons.create({
        //     data: {
        //         planName: body?.planName,
        //         maxUsers: Number(body?.maxUsers),
        //         duration: Number(body?.duration),
        //         price: Number(body?.amount),
        //         createdById: userId,
        //         modifiedById: userId,
        //         createdAt: new Date()
        //     }
        // })
        // return res.status(200).json(JSON.parse(safeJsonStringify({ coupon })))
    } catch (error) {
        console.log("error", error)
        return res.json({ error: error });
    }
});
superAdminRouter.delete('/delete-coupon/:couponId',
     authenticateToken, authenticateSuperAdmin,
      async (req: any, res: Response) => {
    try {
        let { couponId } = req.params;
        let { isDeleted } = req.body
        // couponId = JSON.stringify(couponId)
        console.log("couponId", couponId)
        console.log("isDeleted", isDeleted)
        let deleted = await prisma.coupons.update({
            where: { couponId },
            data: {
                isDeleted: isDeleted
            }
        })

        console.log("deleted coupon", deleted)
        return res.status(200).json({ message: "Subscription deleted", deleted })
    } catch (error) {
        console.log("error while deleting coupon", error)
        return res.status(500).json({ message: "error while deleting coupon" })
    }
})

superAdminRouter.get('/bank-details',
     authenticateToken, authenticateSuperAdmin,
      async (req: any, res: Response) => {
    try {
        console.log("user", req.user.id)
        const bankDetails = await prisma.bankDetails.findUnique({
            where: {
                id: 'super-admin-bank-id'
            }
        })
        return res.status(200).json(bankDetails)
    }
    catch (error) {
        console.log("error", error)
        return res.status(500).json(error)

    }
})
superAdminRouter.patch('/bank-details', 
    authenticateToken, authenticateSuperAdmin, 
    async (req: any, res: Response) => {
    try {
        const data = req.body;
        const userId = req.user.id;
        const bankDetails = await prisma.bankDetails.update({
            where: {
                id: 'super-admin-bank-id'
            },
            data: {
                accountName: data?.accountHolder,
                accountNumber: data?.accountNumber,
                bank: data?.bank,
                branchName: data?.address,
                IFSCCode: data?.IFSCCode,
                modifiedById: req.user.userId,
                modifiedDate: new Date(),
            }
        })
        return res.status(200).json(bankDetails)

    }
    catch (error) {
        console.log("error", error)
        return res.status(500).json(error)

    }
})




superAdminRouter.get('/societies',
     authenticateToken, authenticateSuperAdmin, 
     async (req: any, res: Response) => {
    try {
        const societies = await prisma.society.findMany({
            select: {
                societyId: true,
                societyName: true,
                address: true,
            }
        });
        return res.status(200).json(societies);
    } catch (error) {
        console.error("Error fetching societies:", error);
        return res.status(500).json({ error: "An error occurred while fetching societies." });
    }
});

//create a Landing Card
superAdminRouter.post(
  '/create-landing-card',
  async (req: any, res: Response) => {
    const { cardTitle, cardSubTitle, cardDescription, email, phoneNumber, buttonText, type, imageBase64 } =
      req.body;

    try {

          // Check if a 'contact' type already exists
    if (type === 'CONTACT') {
      const existingContactCard =  await prisma.landingCard.findFirst({where:{
        type:'CONTACT'
      }});

      if (existingContactCard) {
        return res.status(400).json({
          message: 'Only one "contact" type is allowed.',
        });
      }
    }

      // Insert landing card data into the landingCard table using Prisma
      const newLandingCard = await prisma.landingCard.create({
        data: {
          cardTitle: cardTitle,
          cardSubTitle: cardSubTitle,
          cardDescription: cardDescription,
          email: email,
          buttonText:buttonText,
          phoneNumber: phoneNumber,
          type: type, // This should match the enum defined in the Prisma schema
        },
      });

      console.log('New Landing Card Created:', newLandingCard);

      // Insert image data into the Media table
      if (imageBase64) {
        await prisma.media.create({
          data: {
            data: imageBase64, // Base64 image data
            type: 'image',
            tableId: newLandingCard.landingCardId, // Use the ID of the newly created landing card
            tableType: 'landingPage', // Define the table type
          },
        });

        console.log('Image added to Media table for Landing Card ID:', newLandingCard.landingCardId);
      }

      // Send the response with the newly created landing card
      res.status(200).json({
        success: true,
        message: 'Landing Card created successfully',
        data: JSON.parse(safeJsonStringify(newLandingCard)),
      });
    } catch (error: any) {
      console.error('Error creating landing card:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  }
);

//create a Slider Card
superAdminRouter.post(
    '/create-slider-card',
    async (req: any, res: Response) => {
      const { cardTitle, cardSubTitle, cardDescription, source,linkedLandingCardId,imageBase64 } =
        req.body;
  
      try {
        // Insert slider card data into the SliderCards table using Prisma
        const newSliderCard = await prisma.sliderCard.create({
          data: {
            cardTitle: cardTitle,
            cardSubTitle: cardSubTitle,
            cardDescription: cardDescription,
            source: source, // Optional field for additional information
            landingCardId:linkedLandingCardId

          },
        });
  
        console.log('New Slider Card Created:', newSliderCard);

         // Insert image data into the Media table
      if (imageBase64) {
        await prisma.media.create({
          data: {
            data: imageBase64, // Base64 image data
            type: 'image',
            tableId: newSliderCard.sliderCardId, // Use the ID of the newly created landing card
            tableType: 'landingPage', // Define the table type
          },
        });

        console.log('Image added to Media table for Slider Card ID:', newSliderCard.sliderCardId);
      }
  
        // Send the response with the newly created slider card
        res.status(200).json({
          success: true,
          message: 'Slider Card created successfully',
          data: JSON.parse(safeJsonStringify(newSliderCard)),
        });
      } catch (error: any) {
        console.error('Error creating slider card:', error.message);
        res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    }
  );
  
// Edit landing card
superAdminRouter.put(
  '/edit-landing-card',
  async (req: any, res: Response) => {
    const {
      landingCardId,
      cardTitle,
      cardSubTitle,
      cardDescription,
      email,
      buttonText,
      phoneNumber,
      type,
      imageBase64, // New field for image data
    } = req.body;

    try {

       // Ensure the ID is provided for editing
       if (!landingCardId) {
        return res.status(400).json({
          success: false,
          message: 'Landing Card ID is required for updating',
        });
      }

      // Update the landing card in the landingCard table
      const updatedLandingCard = await prisma.landingCard.update({
        where: {
          landingCardId: landingCardId, // Use the unique identifier to locate the record
        },
        data: {
          cardTitle: cardTitle,
          cardSubTitle: cardSubTitle,
          cardDescription: cardDescription,
          email: email,
          buttonText:buttonText,
          phoneNumber:phoneNumber,
          type: type, // This should match the enum defined in the Prisma schema
        },
      });

      console.log('Landing Card Updated:', updatedLandingCard);

      // If imageBase64 is provided, update the media table
      if (imageBase64) {
        const existingMedia = await prisma.media.findFirst({
          where: {
            tableId: landingCardId,
            tableType: 'landingPage',
          },
        });

        if (existingMedia) {
          // Update the existing media record
          await prisma.media.update({
            where: {
              id: existingMedia.id,
            },
            data: {
              data: imageBase64, // Update the image data
              type:'image'
            },
          });

          console.log('Media Updated for Landing Card:', landingCardId);
        } else {
          // Create a new media record if none exists
          await prisma.media.create({
            data: {
              tableId: landingCardId,
              tableType: 'landingPage',
              data: imageBase64, // Set the new image data
              type:'image'
            },
          });

          console.log('New Media Created for Landing Card:', landingCardId);
        }
      }

      // Send the response with the updated landing card
      res.status(200).json({
        success: true,
        message: 'Landing Card and Media updated successfully',
        data: JSON.parse(safeJsonStringify(updatedLandingCard)),
      });
    } catch (error: any) {
      console.error('Error updating landing card:', error.message);
      if (error.code === 'P2025') {
        // Prisma error for record not found
        res.status(404).json({
          success: false,
          message: 'Landing Card not found',
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
        });
      }
    }
  }
);



  //edit slider card
  superAdminRouter.put(
    '/edit-slider-card',
    async (req: any, res: Response) => {
      const {
        sliderCardId,
        cardTitle,
        cardSubTitle,
        cardDescription,
        source,
        linkedLandingCardId,
        imageBase64, // New field for image data
      } = req.body;
  
      try {
        // Ensure the ID is provided for editing
        if (!sliderCardId) {
          return res.status(400).json({
            success: false,
            message: 'Slider Card ID is required for updating',
          });
        }
  
        // Update the slider card in the SliderCards table
        const updatedSliderCard = await prisma.sliderCard.update({
          where: {
            sliderCardId: sliderCardId, // Match by ID
          },
          data: {
            cardTitle: cardTitle || undefined, // Update only if provided
            cardSubTitle: cardSubTitle || undefined,
            cardDescription: cardDescription || undefined,
            source: source || undefined,
            landingCardId:linkedLandingCardId || null
          },
        });
  
        console.log('Slider Card Updated:', updatedSliderCard);
  
        // If imageBase64 is provided, update the media table
        if (imageBase64) {
          const existingMedia = await prisma.media.findFirst({
            where: {
              tableId: sliderCardId,
              tableType: 'landingPage', // Ensure the tableType matches the context
            },
          });
  
          if (existingMedia) {
            // Update the existing media record
            await prisma.media.update({
              where: {
                id: existingMedia.id,
              },
              data: {
                data: imageBase64, // Update the image data
                type: 'image', // Type can remain 'image'
              },
            });
  
            console.log('Media Updated for Slider Card:', sliderCardId);
          } else {
            // Create a new media record if none exists
            await prisma.media.create({
              data: {
                tableId: sliderCardId,
                tableType: 'landingPage', // Ensure the tableType matches the context
                data: imageBase64, // Set the new image data
                type: 'image', // Type can remain 'image'
              },
            });
  
            console.log('New Media Created for Slider Card:', sliderCardId);
          }
        }
  
        // Send the response with the updated slider card
        res.status(200).json({
          success: true,
          message: 'Slider Card and Media updated successfully',
          data: JSON.parse(safeJsonStringify(updatedSliderCard)),
        });
      } catch (error: any) {
        console.error('Error updating slider card:', error.message);
        if (error.code === 'P2025') {
          // Prisma error for record not found
          res.status(404).json({
            success: false,
            message: 'Slider Card not found',
          });
        } else {
          res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
          });
        }
      }
    }
  );
  
  
  //delete the whole landing card
  superAdminRouter.delete("/delete-landing-card/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Start a transaction to delete the landing card and associated media
      const [deletedMedia, deletedLandingCard] = await prisma.$transaction([
        prisma.media.deleteMany({
          where: {
            tableId: id, // Match the LandingCard ID
            tableType: "landingPage", // Ensure it matches the correct tableType
          },
        }),
        prisma.landingCard.delete({
          where: { landingCardId: id },
        }),
      ]);
  
      console.log("Media Deleted:", deletedMedia);
      console.log("Landing Card Deleted:", deletedLandingCard);
  
      res.status(200).json({
        success: true,
        message: "Landing Card and associated media deleted successfully",
        data: {
          landingCard: deletedLandingCard,
          media: deletedMedia,
        },
      });
    } catch (error) {
      console.error("Error deleting Landing Card or associated media:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  
  
  // For SliderCards
  superAdminRouter.delete("/delete-slider-card/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedSliderCard = await prisma.sliderCard.delete({
        where: { sliderCardId: id }, // Ensure the ID is parsed as an integer
      });
  
      console.log("Slider Card Deleted:", deletedSliderCard);
  
      res.status(200).json({
        success: true,
        message: "Slider Card deleted successfully",
        data: deletedSliderCard,
      });
    } catch (error) {
      console.error("Error deleting Slider Card:", error);
      res.status(500).json({
        success: false,
        message:  "Internal Server Error",
      });
    }
  });
  
  //delete landing card indiviual media only
  superAdminRouter.delete('/delete-landing-card-media/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.media.delete({
        where: { 
          id
         },
      });
      res.status(200).json({ success: true, message: 'Media deleted successfully' });
    } catch (error) {
      console.error('Error deleting media:', error);
      res.status(500).json({ success: false, message: 'Failed to delete media' });
    }
  });


    //delete slider card indiviual media only
    superAdminRouter.delete('/delete-slider-card-media/:id', async (req, res) => {
      const { id } = req.params;
      try {
        await prisma.media.delete({
          where: { 
            id
           },
        });
        res.status(200).json({ success: true, message: 'Media deleted successfully' });
      } catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).json({ success: false, message: 'Failed to delete media' });
      }
    });
  
  
//display all landing cards data to superAdmin

superAdminRouter.get('/fetch-landing-cards', async (req: Request, res: Response) => {
  try {
      // Extract limit & offset from query parameters
      const limit = parseInt(req.query.limit as string, 10) || 10; // Default: 10 records per page
      const offset = parseInt(req.query.offset as string, 10) || 0; // Default: start from 0
  
    // Fetch all landing cards
    const landingCard = await prisma.landingCard.findMany({
      skip: offset,
      take: limit,
    });

    const totalRecords = await prisma.landingCard.count();

    // Fetch associated media data for the landing cards
    const landingCardIds = landingCard.map((card) => card.landingCardId);

    const mediaData = await prisma.media.findMany({
      where: {
        tableId: {
          in: landingCardIds, // Match any of the landing card IDs
        },
        tableType: 'landingPage', // Ensure it matches the tableType
      },
    });

    // Combine landing cards with their associated media
    const formattedlandingCard = landingCard.map((card) => {
      const media = mediaData.find((m) => m.tableId === card.landingCardId);
      // console.log("mediaa",media)
      return {
        ...card,
        imageBase64: media ? Buffer.from(media.data).toString('base64') : null, // Convert buffer to Base64
        imageId: media ? media.id : null, // Add `imageId` if media exists, else `null`
        totalRecords
      };
    });

    console.log('Fetched Landing Cards with Media:', formattedlandingCard);

    res.status(200).json({
      success: true,
      data: formattedlandingCard,
    });
  } catch (error: any) {
    console.error('Error fetching landing cards:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
});

superAdminRouter.get('/fetch-slider-cards', async (req: any, res: Response) => {
  try {
      // Extract limit & offset from query parameters
      const limit = parseInt(req.query.limit as string, 10) || 10; // Default: 10 records per page
      const offset = parseInt(req.query.offset as string, 10) || 0; // Default: start from 0
  
    // Fetch all slider cards
    const sliderCards = await prisma.sliderCard.findMany({
      skip: offset,
      take: limit,
    });

    const totalRecords = await prisma.landingCard.count();

    // Fetch associated media data for the slider cards
    const sliderCardIds = sliderCards.map((card) => card.sliderCardId);

    const mediaData = await prisma.media.findMany({
      where: {
        tableId: {
          in: sliderCardIds, // Match any of the slider card IDs
        },
        tableType: 'landingPage', // Ensure it matches the tableType
      },
    });

    // Combine slider cards with their associated media
    const formattedSliderCards = sliderCards.map((card) => {
      const media = mediaData.find((m) => m.tableId === card.sliderCardId);
      return {
        ...card,
        imageBase64: media ? Buffer.from(media.data).toString('base64') : null, // Convert buffer to Base64
        imageId: media ? media.id : null, // Add `imageId` if media exists, else `null`
        totalRecords
      };
    });

    console.log('Fetched Slider Cards with Media:', formattedSliderCards);

    res.status(200).json({
      success: true,
      data: formattedSliderCards,
    });
  } catch (error: any) {
    console.error('Error fetching slider cards:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
});

export default superAdminRouter;

