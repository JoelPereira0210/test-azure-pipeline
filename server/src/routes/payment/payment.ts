import { Society } from './../../types/society';
import axios from 'axios';
import express, { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import { razorpay } from '../../utils/razorpay';

import CryptoJS from 'crypto-js'

import { Orders } from 'razorpay/dist/types/orders';

import { CONFIG } from '../../utils/config';
import { AuthenticatedRequest, authenticateMembership } from '../../middlewares/authorizeUser';
import { authenticateToken } from '../../middlewares/authorizeUser';
import dotenv from 'dotenv';


// Load the appropriate .env file

const paymentRouter = express.Router();

const prisma = new PrismaClient();

dotenv.config();

const keyId = CONFIG.RAZORPAY_KEY_ID;
const keySecret = CONFIG.RAZORPAY_KEY_SECRET;



paymentRouter.post('/create-order', async (req: Request, res: Response) => {
    console.log("CREATE")
    try {

        const { amount, currency } = req.body;

        console.log('create-order body', req.body);

        const options = {

            amount: amount * 100, // amount in paise

            currency,

            receipt: `receipt_${Date.now()}`,

        };



        const order: Orders.RazorpayOrder = await razorpay.orders.create(options);

        // console.log("order",order)


        res.json({

            id: order.id,

            currency: order.currency,

            amount: order.amount,

            // order

        });

    } catch (error) {

        // console.log("crrat-ord",error);
        res.status(500).send(error);

    }

});

paymentRouter.post('/create-event-order', authenticateToken, authenticateMembership, async (req: Request, res: Response) => {
    console.log("CREATE")
    try {

        const { amount, currency } = req.body;

        console.log('create-order body', req.body);

        const options = {

            amount: amount * 100, // amount in paise

            currency,

            receipt: `receipt_${Date.now()}`,

        };



        const order: Orders.RazorpayOrder = await razorpay.orders.create(options);

        // console.log("order",order)


        res.json({

            id: order.id,

            currency: order.currency,

            amount: order.amount,

            // order

        });

    } catch (error) {

        // console.log("crrat-ord",error);
        res.status(500).send(error);

    }

});

paymentRouter.post('/create-membership-order', async (req: Request, res: Response) => {
    console.log("CREATE")
    try {

        const { amount, currency } = req.body;

        console.log('create-order body', req.body);

        const options = {

            amount: amount * 100, // amount in paise

            currency,

            receipt: `receipt_${Date.now()}`,

        };



        const order: Orders.RazorpayOrder = await razorpay.orders.create(options);

        // console.log("order",order)


        res.json({

            id: order.id,

            currency: order.currency,

            amount: order.amount,

            // order

        });

    } catch (error) {

        // console.log("crrat-ord",error);
        res.status(500).send(error);

    }

});

// paymentRouter.post('/verify-payment', async (req: Request, res: Response) => {
//     try {
//         const { paymentId, orderId, signature, eventId, amount, societyId } = req.body;
//         const secret = CONFIG.RAZORPAY_KEY_SECRET;
//         if (!secret) {
//             return res.status(500).send('Razorpay key secret is not defined');
//         }
//         const generatedSignature = CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, secret).toString(CryptoJS.enc.Hex);
//         if (generatedSignature === signature) {
//             // transactions start
//             try {


paymentRouter.post('/verify-payment', async (req: Request, res: Response) => {
    try {
        const { paymentId, orderId, signature, subscriptionId, duration, maxUsers, amount, societyId, userId, discountApplied, discountCode } = req.body;
        const secret = CONFIG.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return res.status(500).send('Razorpay key secret is not defined');
        }

        const generatedSignature = CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, secret).toString(CryptoJS.enc.Hex);
        if (generatedSignature !== signature) {
            return res.status(400).send('Invalid signature');
        }

        await prisma.$transaction(async (transactionPrisma) => {
            // const societyBankDetails = await transactionPrisma.bankDetails.findFirst({
            //     where: { societyId }
            // });
            // console.log("societyBankDetails", societyBankDetails)
            // if (!societyBankDetails) {
            //     throw new Error('Society bank details not found');
            // }

            const subscriptionPayment = await transactionPrisma.subscriptionPayments.create({
                data: {
                    subscriptionPaymentId: `subPay_${Date.now()}`,
                    userId: userId,
                    eventId: `NotApplicable_${Date.now()}`,
                    amount: Number(amount),
                    subscriptionPaymentDate: new Date(),
                    societyBankDetailId: '',
                    couponId: null,
                    subscriptionId: subscriptionId,
                    status: 'Completed',
                    gatewayResponse: JSON.stringify({ paymentId, orderId, signature }),
                    paymentId: paymentId,
                    createdById: userId,
                    numberOfRegistrations: 1
                }
            });
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + Number(duration));
            const societySubscription = await transactionPrisma.societySubscription.create({
                data: {
                    subscriptionId: subscriptionId,
                    societyId: societyId,
                    subscriptionPaymentID: subscriptionPayment.id,
                    subscriptionStartDate: startDate,
                    subscriptionEndDate: endDate,
                    isActive: true,
                    maxUsers: maxUsers,
                    createdById: userId
                }
            });
            if (!keyId || !keySecret) {
                throw new Error('Razorpay key ID or secret is undefined');
            }
            // const contactResponse = await axios.post('https://api.razorpay.com/v1/contacts', {
            //     name: "Recipient Name",
            //     email: "recipient@example.com",
            //     contact: "1234567890",
            //     type: "vendor", // or "customer" as appropriate
            // }, {
            //     auth: {
            //         username: keyId,
            //         password: keySecret,
            //     }
            // });
            // const contactId = contactResponse.data.id;
            // console.log("contactId", contactId)

            // const fundAccountResponse = await axios.post('https://api.razorpay.com/v1/fund_accounts', {
            //     contact_id: contactId,
            //     account_type: "bank_account",
            //     bank_account: {
            //         name: societyBankDetails.accountHolder,
            //         ifsc: societyBankDetails.IFSCCode,
            //         account_number: societyBankDetails.accountNumber
            //     }
            // }, {
            //     auth: {
            //         username: keyId,
            //         password: keySecret,
            //     }
            // });
            // const fundAccountId = fundAccountResponse.data.id;
            // console.log("fundAccount", fundAccountId)
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
            // console.log("payoutData", payOutData)
            // const payoutResponse = await axios.post('https://api.razorpay.com/v1/payouts', {
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
            // }, {
            //     auth: {
            //         username: keyId,
            //         password: keySecret,
            //     }
            // });

            // if (payoutResponse.data.status !== 'created') {
            //     throw new Error('Failed to create payout');
            // }


            // If a discount was applied, update the coupon usage

            if (discountApplied && discountCode) {
                console.log("Discount applied and discount code available");

                const coupon = await transactionPrisma.coupons.findUnique({
                    where: { couponCode: discountCode },
                });

                if (!coupon) {
                    throw new Error(`Coupon with code "${discountCode}" not found`);
                }

                const currentUses = parseInt(coupon.uses, 10); // Parse the 'uses' string to an integer
                const maxUsers = parseInt(coupon.maxUses, 10);

                if (isNaN(currentUses)) {
                    throw new Error(`Invalid uses value for coupon "${discountCode}"`);
                }

                if (currentUses >= maxUsers) {
                    throw new Error(`Coupon with code "${discountCode}" has no remaining uses`);
                }

                // Update the coupon's remaining uses
                await transactionPrisma.coupons.update({
                    where: { couponCode: discountCode },
                    data: {
                        uses: (currentUses + 1).toString(),
                        modifiedById: userId, // Update modifiedBy
                        SubscriptionPayments: {
                            connect: { id: subscriptionPayment.id }, // Link the subscription payment
                        },
                    },
                });
            }

            res.send('Payment verified and funds transferred successfully');
        });

    } catch (error) {
        console.error("Error in transaction:", error);
        res.status(500).send('An error occurred while processing the payment');
    }
});


paymentRouter.post('/verify-payment-membership', async (req: Request, res: Response) => {
    try {
        const { paymentId, orderId, signature, duration, maxUsers, amount, societyId, userId, discountApplied, discountCode } = req.body;
        const secret = CONFIG.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return res.status(500).send('Razorpay key secret is not defined');
        }

        const generatedSignature = CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, secret).toString(CryptoJS.enc.Hex);
        if (generatedSignature !== signature) {
            return res.status(400).send('Invalid signature');
        }

        await prisma.$transaction(async (transactionPrisma) => {
            // const societyBankDetails = await transactionPrisma.bankDetails.findFirst({
            //     where: { societyId }
            // });
            // console.log("societyBankDetails", societyBankDetails)
            // if (!societyBankDetails) {
            //     throw new Error('Society bank details not found');
            // }

            const subscriptionPayment = await transactionPrisma.subscriptionPayments.create({
                data: {
                    subscriptionPaymentId: `memPay_${Date.now()}`,
                    userId: userId,
                    eventId: `NotApplicable_${Date.now()}`,
                    amount: Number(amount),
                    subscriptionPaymentDate: new Date(),
                    societyBankDetailId: '',
                    couponId: null,
                    subscriptionId: '',
                    status: 'Completed',
                    gatewayResponse: JSON.stringify({ paymentId, orderId, signature }),
                    createdById: userId,
                    numberOfRegistrations: 1
                }
            });
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + Number(duration));

            if (!keyId || !keySecret) {
                throw new Error('Razorpay key ID or secret is undefined');
            }
            // const society = await transactionPrisma.event.findUnique({
            //     where: { eventId: chargeId }
            // })
            console.log("society", societyId)
            const bankDetails = await transactionPrisma.bankDetails.findUnique({
                where: { societyId: societyId }
            })
            console.log("bankDetails", bankDetails)

            const payoutData = {
                "account_number": `${CONFIG.HDSOFT_ACC_NO}`,
                "fund_account_id": bankDetails?.fundAccount,
                "amount": amount * 100, //convert paisa to rupees
                "currency": "INR",
                "mode": "NEFT",
                "purpose": "payout",
                "queue_if_low_balance": true,
                "reference_id": "orderId",
                // "narration": "Acme Corp Fund Transfer",
                // "notes": {
                //     "notes_key_1": "Tea, Earl Grey, Hot",
                //     "notes_key_2": "Tea, Earl Grey… decaf."
                // }
            }
            const payoutPayment = await axios.post(`${CONFIG.RAZORPAY_URL}/payouts`, payoutData,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                        ).toString("base64")}`,
                    },
                }
            )
            console.log("payoutPayment Payment Created:", payoutPayment);
            // console.log("Event Payment Created:", eventPayment);

            // if (discountApplied && discountCode) {
            //     console.log("Discount applied and discount code available");

            //     const coupon = await transactionPrisma.coupons.findUnique({
            //         where: { couponCode: discountCode },
            //     });

            //     if (!coupon) {
            //         throw new Error(`Coupon with code "${discountCode}" not found`);
            //     }

            //     const currentUses = parseInt(coupon.uses, 10); // Parse the 'uses' string to an integer
            //     const maxUsers = parseInt(coupon.maxUses, 10);

            //     if (isNaN(currentUses)) {
            //         throw new Error(`Invalid uses value for coupon "${discountCode}"`);
            //     }

            //     if (currentUses >= maxUsers) {
            //         throw new Error(`Coupon with code "${discountCode}" has no remaining uses`);
            //     }

            // Update the coupon's remaining uses
            //     await transactionPrisma.coupons.update({
            //         where: { couponCode: discountCode },
            //         data: {
            //             uses: (currentUses + 1).toString(),
            //             modifiedById: userId, // Update modifiedBy
            //             SubscriptionPayments: {
            //                 connect: { id: subscriptionPayment.id }, // Link the subscription payment
            //             },
            //         },
            //     });
            // }
            await transactionPrisma.user.update({
                where: { userId: userId },
                data: { membershipStatusId: 1 },
            });

            res.send('Payment verified and funds transferred successfully');
        });

    } catch (error) {
        console.error("Error in transaction:", error);
        res.status(500).send('An error occurred while processing the payment');
    }
});

paymentRouter.post('/verify-event-payment', async (req: Request, res: Response) => {
console.log("came here in /verify-event-payment")
    try {
        const {
            paymentId,
            orderId,
            signature,
            eventId,
            amount,
            userId,
            numberOfRegistrations,
        } = req.body;

        const secret = CONFIG.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return res.status(500).send('Razorpay key secret is not defined');
        }

        // Validate Razorpay signature
        const generatedSignature = CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, secret).toString(CryptoJS.enc.Hex);
        if (generatedSignature !== signature) {
            return res.status(400).send('Invalid signature');
        }

        await prisma.$transaction(async (transactionPrisma) => {
            // Create an entry for the event payment
            const eventPayment = await transactionPrisma.subscriptionPayments.create({
                data: {
                    subscriptionPaymentId: `eventPay_${Date.now()}`,
                    userId,
                    eventId,
                    amount: Number(amount),
                    subscriptionPaymentDate: new Date(),
                    societyBankDetailId: '',
                    subscriptionId: null,
                    couponId: null,
                    numberOfRegistrations: Number(numberOfRegistrations),
                    status: 'Completed',
                    gatewayResponse: JSON.stringify({ paymentId, orderId, signature }),
                    paymentId: paymentId,
                    createdById: userId,
                },
            });

            const society = await transactionPrisma.event.findUnique({
                where: { eventId: eventId }
            })
            console.log("Society data test", society)
            const bankDetails = await transactionPrisma.bankDetails.findUnique({
                where: { societyId: society?.societyId }
            })
            const payoutData = {
                "account_number": `${CONFIG.HDSOFT_ACC_NO}`,
                "fund_account_id": bankDetails?.fundAccount,
                "amount": amount * 100, //convert paisa to rupees
                "currency": "INR",
                "mode": "NEFT",
                "purpose": "payout",
                "queue_if_low_balance": true,
                "reference_id": "orderId",
                // "narration": "Acme Corp Fund Transfer",
                // "notes": {
                //     "notes_key_1": "Tea, Earl Grey, Hot",
                //     "notes_key_2": "Tea, Earl Grey… decaf."
                // }
            }
            console.log("bank details testing",bankDetails)
            console.log("payout data testing",payoutData)
            const payoutPayment = await axios.post(`${CONFIG.RAZORPAY_URL}/payouts`, payoutData,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                        ).toString("base64")}`,
                    },
                }
            )
            console.log("payoutPayment Payment Created:", payoutPayment);
            console.log("Event Payment Created:", eventPayment);

            res.status(200).send('Payment verified for event registration successful');
        });
    } catch (error) {
        console.error("Error in event payment transaction:", error);
        res.status(500).send('An error occurred while processing the event payment');
    }
});

paymentRouter.post('/register-free-event', authenticateToken, authenticateMembership, async (req: Request, res: Response) => {
    console.log('came here in /register-free-event')
    try {
        const { eventId, userId, numberOfRegistrations } = req.body;
        console.log("req.body in /register-free-event", req.body)

        // if (!eventId || !userId || !numberOfRegistrations) {
        //     return res.status(400).send('Missing required fields');
        // }

        await prisma.$transaction(async (transactionPrisma) => {
            // Create an entry for the free event registration
            const freeEventRegistration = await transactionPrisma.subscriptionPayments.create({
                data: {
                    subscriptionPaymentId: `freeEvent_${Date.now()}`, // Unique ID
                    userId,
                    eventId,
                    amount: 0, // Amount is zero for free events
                    subscriptionPaymentDate: new Date(),
                    societyBankDetailId: '',
                    subscriptionId: null,
                    couponId: null,
                    numberOfRegistrations: Number(numberOfRegistrations),
                    status: 'Completed', // Set status to "Completed" for free registration
                    gatewayResponse: JSON.stringify({ message: 'Free event registration' }), // Custom response for free registration
                    createdById: userId,
                },
            });

            console.log("Free Event Registration Created:", freeEventRegistration);

            res.status(200).send('Free event registration successful');
        });
    } catch (error) {
        console.error("Error in free event registration:", error);
        res.status(500).send('An error occurred while processing the free event registration');
    }
});


paymentRouter.post('/verify-charge-payment', async (req: Request, res: Response) => {
    try {
        const {
            paymentId,
            orderId,
            signature,
            chargeId,
            amount,
            userId,
        } = req.body;

        const secret = CONFIG.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return res.status(500).send('Razorpay key secret is not defined');
        }

        // Validate Razorpay signature
        const generatedSignature = CryptoJS.HmacSHA256(`${orderId}|${paymentId}`, secret).toString(CryptoJS.enc.Hex);
        if (generatedSignature !== signature) {
            return res.status(400).send('Invalid signature');
        }

        await prisma.$transaction(async (transactionPrisma) => {
            // Create an entry for the charge payment
            const chargePayment = await transactionPrisma.subscriptionPayments.create({
                data: {
                    subscriptionPaymentId: `chargePay_${Date.now()}`,
                    userId,
                    eventId: chargeId,
                    amount: Number(amount),
                    subscriptionPaymentDate: new Date(),
                    societyBankDetailId: '',
                    subscriptionId: null,
                    couponId: null,
                    numberOfRegistrations: 0,
                    status: 'Completed',
                    gatewayResponse: JSON.stringify({ paymentId, orderId, signature }),
                    paymentId: paymentId,
                    createdById: userId,
                },
            });
            const society = await transactionPrisma.event.findUnique({
                where: { eventId: chargeId }
            })
            console.log("society", society)
            const bankDetails = await transactionPrisma.bankDetails.findUnique({
                where: { societyId: society?.societyId }
            })
            console.log("bankDetails", bankDetails)

            const payoutData = {
                "account_number": `${CONFIG.HDSOFT_ACC_NO}`,
                "fund_account_id": bankDetails?.fundAccount,
                "amount": amount * 100, //convert paisa to rupees
                "currency": "INR",
                "mode": "NEFT",
                "purpose": "payout",
                "queue_if_low_balance": true,
                "reference_id": "orderId",
                // "narration": "Acme Corp Fund Transfer",
                // "notes": {
                //     "notes_key_1": "Tea, Earl Grey, Hot",
                //     "notes_key_2": "Tea, Earl Grey… decaf."
                // }
            }
            console.log('Payout testing data',payoutData)
            const payoutPayment = await axios.post(`${CONFIG.RAZORPAY_URL}/payouts`, payoutData,
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${CONFIG.RAZORPAY_KEY_ID}:${CONFIG.RAZORPAY_KEY_SECRET}`
                        ).toString("base64")}`,
                    },
                }
            )
            console.log("payoutPayment Payment Created:", payoutPayment);
            // console.log("Event Payment Created:", eventPayment);
            console.log("Charge Payment Created:", chargePayment);

            res.status(200).send('Payment verified for charges successful');
        });
    } catch (error) {
        console.error("Error in charges payment transaction:", error);
        res.status(500).send('An error occurred while processing the charges payment');
    }
});


paymentRouter.get('/validate-coupon', async (req: Request, res: Response) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        // Find the coupon by code
        const coupon = await prisma.coupons.findFirst({
            where: {
                couponCode: String(code),
                shouldPublish: true,
                isDeleted: 'NOT_DELETED',
            },
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        // Convert `uses` and `maxUses` to numbers before comparison
        const maxUses = parseInt(coupon.maxUses, 10); // Ensure it's treated as a number
        const currentUses = parseInt(coupon.uses, 10); // Ensure it's treated as a number

        if (currentUses >= maxUses) {
            return res.status(404).json({ message: "Coupon has expired" });
        }

        const remainingUses = maxUses - currentUses;

        // Respond with coupon details
        return res.status(200).json({
            message: "Coupon applied successfully",
            couponCode: coupon.couponCode,
            discountPercentage: coupon.discountPercentage,
            couponName: coupon.couponName,
            remainingUses: remainingUses,
        });
    } catch (error) {
        console.error("Error validating coupon:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



export default paymentRouter