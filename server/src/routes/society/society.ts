import bcrypt from 'bcryptjs';
import express, { Request, Response, Router } from 'express';
const societyRouter = express.Router();
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, authenticateRole, authenticateToken } from '../../middlewares/authorizeUser';
import { CONFIG } from '../../utils/config';
import { safeJsonStringify } from '../../utils/helperFunction';
import CryptoJS from 'crypto-js';
import { error } from 'console';
import axios from 'axios';
const prisma = new PrismaClient();

societyRouter.post('/signup', async (req, res) => {
  const { username, password, phone_number } = req.body;
  // const client = await pool.connect();
  try {
    // await client.query('BEGIN');
    const saltRounds = parseInt(CONFIG.SALT_ROUNDS || '12', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // const result = await client.query('INSERT INTO users (username, password, phone_number) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, phone_number]);
    // await client.query('COMMIT');
    // res.status(201).json(result.rows[0]);
  } catch (err) {
    // await client.query('ROLLBACK');
    res.status(400).json({ error: err });
  } finally {
    // client.release();
  }
});
societyRouter.get('/', async (req: Request, res: Response) => {
  try {
    // const { societyId } = req.params
    console.log("REQ", req.query.societyId)
    const encryptedSocietyId = req.query.societyId as string;

    // const encryptedSocietyId = req.query.societyId as string;
    // const eventType = req.query.eventType as string; // Add eventType to the query
    console.log("encryptedSocietyId KEYYyyyyyyyy", encryptedSocietyId);
    console.log(CONFIG.SECRET_KEY);
    // console.log("Event Type:", eventType);

    if (!encryptedSocietyId) {
      return res.status(400).json({ error: 'societyId is required AAASADA' });
    }

    // Decrypt the societyId
    const bytes = CryptoJS.AES.decrypt(encryptedSocietyId, CONFIG.SECRET_KEY || '');
    console.log("bytes is ", bytes);
    const societyId = bytes.toString(CryptoJS.enc.Utf8);
    console.log("societyId is ", societyId);

    if (!societyId) {
      throw new Error('Failed to decrypt society ID');
    }
    console.log("societyId", societyId)
    const society = await prisma.society.findUnique({
      where: {
        societyId,
      },
      // include: {
      //   members: {
      //     include: {
      //       user: true,  // Fetch all related user data
      //     },
      //   },
      // },
    });
    if (society?.logoId) {
      const logo = await prisma.media.findUnique({
        where: { id: society?.logoId }
      })
      // const societyLogo = logo?.data?.toString('base64')
      const societyLogo = logo?.data ? Buffer.from(logo.data).toString('base64') : null;
      // console.log("LOGO", logo.data)
      // console.log("LOGO", societyLogo)
      return res.status(200).json(JSON.parse(safeJsonStringify({ society, societyLogo })));
    }
    else {
      return res.status(200).json(JSON.parse(safeJsonStringify({ society })));

    }
    // return res.status(200).json(JSON.parse(safeJsonStringify({ society })));
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})
societyRouter.get('/restricted-society/:societyId', async (req: Request, res: Response) => {
  try {
    const { societyId } = req.params
    console.log("societyIdDdddd", societyId)
    const society = await prisma.society.findUnique({
      where: {
        societyId,
      },
      include: {
        // members: {
        //   include: {
        //     user: true,  // Fetch all related user data
        //   },
        // },
      },
    });
    if (society?.logoId) {
      const logo = await prisma.media.findUnique({
        where: { id: society?.logoId }
      })
      // const societyLogo = logo?.data?.toString('base64')
      const societyLogo = logo?.data ? Buffer.from(logo.data).toString('base64') : null;
      // console.log("LOGO", logo.data)
      // console.log("LOGO", societyLogo)
      return res.status(200).json(JSON.parse(safeJsonStringify({ society, societyLogo })));
    }
    else {
      return res.status(200).json(JSON.parse(safeJsonStringify({ society })));

    }

  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})
societyRouter.post('/:id/bank-details', authenticateToken, authenticateRole, async (req: AuthenticatedRequest, res: Response) => {
  const { societyId, bank, accountNumber, IFSCCode, accountName, branchName, createdById }: any = req.body;

  try {
    // Validate the request body
    if (!societyId || !bank || !accountNumber || !IFSCCode || !accountName || !branchName || !createdById) {
      return res.status(400).send('Missing required fields');
    }
    // Check if bank details already exist for the society
    const existingBankDetail = await prisma.bankDetails.findFirst({
      where: { societyId: societyId }
    });

    if (existingBankDetail) {
      return res.status(400).json({
        message: 'Bank details for this society already exist'
      });
    }
    else {
      await prisma.$transaction(async (prisma) => {


        const society = await prisma.society.findUnique({
          where: societyId
        })
        const user = await prisma.user.findUnique({
          where: { userId: req?.user?.id }
        })
        let newBankDetails = await prisma.bankDetails.create({
          data: {
            societyId,
            bank,
            accountNumber,
            IFSCCode,
            accountName,
            branchName,
            createdDate: new Date(),
            createdById,
            modifiedDate: new Date(),
            modifiedById: createdById,
            isDeleted: false, // Set to true if needed
          }
        });
        const contactResponse = await axios.post(`${CONFIG.RAZORPAY_URL}/contacts`, {
          name: `${society?.societyName}`,
          // email: "recipient@example.com",
          contact: `${user?.phoneNumber}`,
          type: "vendor", // or "customer" as appropriate
        }, {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
            ).toString("base64")}`,
          },
        });
        const contactId = contactResponse?.data?.id;
        console.log("contactId", contactId)

        const fundAccountResponse = await axios.post('https://api.razorpay.com/v1/fund_accounts', {
          contact_id: contactId,
          account_type: "bank_account",
          bank_account: {
            name: newBankDetails.accountName,
            ifsc: newBankDetails.IFSCCode,
            account_number: newBankDetails.accountNumber
          }
        }, {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
            ).toString("base64")}`,
          },
        });
        const fundAccountId = fundAccountResponse.data.id;
        console.log("fundAccount", fundAccountId)
        newBankDetails = await prisma.bankDetails.update({
          where: {
            societyId: societyId
          },
          data: {
            contactId: contactId,
            fundAccount: fundAccountId
          }
        });
        // const payOutData = {
        //     account_number: societyBankDetails.accountNumber,
        //     fund_account_id: fundAccountId,
        //     amount,
        //     currency: 'INR',
        //     mode: 'IMPS',
        //     purpose: 'subscription_payment',
        //     queue_if_low_balance: true,
        //     reference_id: "Acme Transaction ID 12345",
        //     narration: "Acme Corp Fund Transfer",
        //     notes: `Payment for subscription by user`,
        // }

        // Create a new bank details entry
        // const newBankDetails = await prisma.bankDetails.create({
        //   data: {
        //     societyId,
        //     bank,
        //     accountNumber,
        //     IFSCCode,
        //     accountName,
        //     branchName,
        //     createdDate: new Date(),
        //     createdById,
        //     modifiedDate: new Date(),
        //     modifiedById: createdById,
        //     isDeleted: false, // Set to true if needed
        //   }
        // });

        res.status(201).json(newBankDetails);
      })
    }
  } catch (error) {
    console.error('Error adding bank details:', error);
    res.status(500).send('Internal Server Error');
  }
});
societyRouter.post('/:id/add-members', authenticateToken, authenticateRole, async (req: any, res: Response) => {
  const data = req.body;

  try {
    await prisma.$transaction(async (prisma) => {
      const addMembers = await Promise.all(
        data.map(async (member: any) => {
          const { phone_number, firstName, lastName } = member;
          let user = await prisma.user.findUnique({
            where: { phoneNumber: phone_number }
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                phoneNumber: phone_number,
                firstName,
                lastName,
                flatNumber: "",
                buildingDoorNumber: "",
                address: "",
                state: "",
                streetName: "",
                country: "",
                pincode: "",
                password: "",
                isAdmin: false,
              },
            });

            const membershipId = await prisma.membershipStatus.findFirst({
              where: {
                status: 'invite'
              }
            });

            if (membershipId) {
              user = await prisma.user.update({
                where: {
                  userId: user.userId
                },
                data: {
                  membershipStatusId: membershipId.id
                }
              });
            }

            const memberRole = await prisma.committeeRoleMaster.findFirst({
              where: {
                designationName: 'member'
              },
            });

            if (memberRole) {
              const societyMember = await prisma.societyMember.create({
                data: {
                  userId: user.userId,
                  societyId: req.role.societyId,
                  roleId: memberRole.designationId,
                  isAdmin: false
                }
              });

              console.log("User after ID update", societyMember);
            }
          }
        })
      );
      // Sent SMS here to all membee

      return res.json({ success: true, message: 'Members added successfully.' });
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
societyRouter.post('/:societyId/society-manifest', async (req: Request, res: Response) => {
  try {
    const { societyId } = req.params;
    // console.log("SIDdddd")
    // console.log("ID", societyId);
    const society = await prisma.society.findUnique({
      where: { societyId }
    })
    if (society?.logoId) {
      const logo = await prisma.media.findUnique({
        where: { id: society?.logoId }
      })
      const societyLogo = logo?.data ? Buffer.from(logo.data).toString('base64') : null;
      console.log("society", society)
      // console.log("societyLogo", societyLogo)
      return res.status(200).json({ society, societyLogo })
    }
    else {
      return res.status(200).json({ society })

    }
  } catch (error) {
    console.log("error", error)
  }
})
societyRouter.get('/:societyId/subscription-details', authenticateToken, authenticateRole, async (req: Request, res: Response) => {
  console.log("SOCU", req.params)
  try {
    const { societyId } = req.params;

    const societySubscription = await prisma.societySubscription.findMany({
      where: { societyId },
      include: {
        subscriptionMaster: true
      },

    })
    // Check if there is at least one subscription for the society
    if (!societySubscription || societySubscription.length === 0) {
      console.log("SOCU", error)
      return res.status(404).json({ message: "No subscription found for this society." });
    }
    // const planDetails = await prisma.subscriptionMaster.findUnique({
    //   where: { subscriptionId: societySubscription[0].subscriptionId }
    // })
    console.log("societySubscription", societySubscription)
    // console.log("planDetails", planDetails)
    return res.status(200).json({
      societySubscription
      // , planDetails
    })
  } catch (error) {
    console.log("/:societyId/subscription-details", error)
    return res.status(500).json("Internal Server Error")
  }
})

export default societyRouter;
