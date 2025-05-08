'use client';

import React, { useState, useEffect } from 'react';
import '@/src/app/(routes)/(authenticated)/events/style.scss';
import { Box, Typography, useTheme } from '@mui/material';
import BaseContainer from '@/src/component/UI/Basecontainer';
import ButtonInput from '@/src/component/UI/Button/Button';
import { bankDetailsAction, updateBankDetailsAction } from '@/src/actions/superAdmin';
import Popup from 'reactjs-popup';
import { CancelOutlined } from '@mui/icons-material';
import InputField from '@/src/component/UI/InputField/InputField';
import { Controller, useForm } from 'react-hook-form';
import { EditBankDetailsTypes as FormValues } from '@/src/lib/types/superAdminTypes';
import { bankDetailsSchema } from '@/src/lib/zod/superAdmin';
import { zodResolver } from '@hookform/resolvers/zod';

const BankDetailPill = ({ text }: { text: string }) => (
    <Box sx={{
        width: '618px',
        padding: '16px',
        maxHeight: '56px',
        marginBottom: '20px',
        borderRadius: '10px',
        border: '1px solid rgba(162,161,168,0.2)',
        '@media(max-width:768px)': { width: '100%' },
    }}>
        <Typography variant='text2' fontWeight={600}>{text}</Typography>
    </Box>
);

const BankDetails: React.FC = () => {
    const [bankDetails, setBankDetails] = useState(null);
    const [editDetails, setEditDetails] = useState(false);
    const theme = useTheme();
    const mode = theme?.palette?.mode;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(bankDetailsSchema),
        // defaultValues: {
        //     accountNumber: bankDetails?.accountNumber,
        //     accountHolder: bankDetails?.accountHolder,
        //     bank: bankDetails?.bank,
        //     address: bankDetails?.address,
        //     IFSCCode: bankDetails?.IFSCCode
        // }
    });

    const fetchBankDetails = async () => {
        const details = await bankDetailsAction();
        console.log("details", details);
        setBankDetails(details);
        if (details) {
            reset({
                bankAccountNumber: details?.accountNumber,
                accountName: details?.accountHolder,
                bank: details?.bank,
                // address: details?.address,
                ifscCode: details?.IFSCCode
            })
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []);
    const onSubmit = async (data: FormValues) => {
        
        console.log("On Submit", data);
        try {
            const response = await updateBankDetailsAction(data);
            console.log("rrr", response)
            if (response.status === 200) {
                fetchBankDetails();
                setEditDetails(false)
            }

        } catch (error) {
            console.log("error", error)
        }
    };
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {bankDetails ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'calc(100% - 240px)',
                    border: '1px solid #A2A1A833',
                    height: '90vh',
                    borderRadius: '20px',
                    '@media(max-width:768px)': { width: '100%' },
                }}>
                    <Box sx={{ margin: '40px 20px' }}>
                        {bankDetails?.accountNumber && <BankDetailPill text={bankDetails.accountNumber} />}
                        {bankDetails?.accountHolder && <BankDetailPill text={bankDetails.accountHolder} />}
                        {bankDetails?.bank && <BankDetailPill text={bankDetails.bank} />}
                        {bankDetails?.accountHolder && <BankDetailPill text={bankDetails.accountHolder} />}
                        {bankDetails?.IFSCCode && <BankDetailPill text={bankDetails.IFSCCode} />}
                        <ButtonInput type='button' text='Change' disabled={false} loading={false} styles={{
                            maxWidth: '210px',

                        }}
                            onClick={() => {
                                setEditDetails(true)
                            }}
                        />
                    </Box>

                </Box>
            ) : (
                <BaseContainer text="No Bank Details">
                    <ButtonInput
                        type='button'
                        text='Add Bank Details'
                        disabled={false}
                        loading={false}
                        styles={{ maxWidth: '230px' }}
                    />
                </BaseContainer>
            )}
            {editDetails && (
                <Popup
                    className='bank-modal'
                    contentStyle={{
                        background: mode === 'light' ? 'white' : 'black'
                    }}
                    closeOnDocumentClick
                    position="right center"
                    modal
                    onClose={() => {
                        setEditDetails(false)
                    }}
                    open={editDetails}
                >
                    <Box sx={{
                        padding: '10px 20px'
                    }}
                        className="all-content"
                    >
                        <Box className="header"
                            sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                                gutterBottom
                                sx={{
                                    color:
                                        mode === 'light'
                                            ? 'var(--tw-text-light-mainText)'
                                            : 'var(--tw-text-dark-mainText)',
                                }}
                            >
                                Edit Bank Details
                            </Typography>
                            <Box
                                onClick={() => {
                                    setEditDetails(false)
                                }}
                            >
                                <CancelOutlined />
                            </Box>
                        </Box>
                        <Box sx={{ marginTop: '1.4rem' }}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="bankAccountNumber"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <InputField
                                            type='text'
                                            label={'Bank Account Number'}
                                            {...field}
                                            required={true}
                                            placeholder="Bank Account Number"
                                            errorMessage={errors.bankAccountNumber?.message}
                                        />
                                    )}
                                />


                                <Controller
                                    name="accountName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputField
                                            type='text'
                                            label={'Bank Account Holder'}
                                            {...field}
                                            required={true}
                                            placeholder="Bank Account Holder"
                                            errorMessage={errors.accountName?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="bank"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputField
                                            type='text'
                                            label={'Bank Name'}
                                            {...field}
                                            required={true}
                                            placeholder="Bank Name"
                                            errorMessage={errors.bank?.message}
                                        />
                                    )}
                                />



                                <Controller
                                    name="branchName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputField
                                            type='text'
                                            label={'Bank Address'}
                                            {...field}
                                            required={true}
                                            placeholder="Bank Address"
                                            errorMessage={errors.branchName?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="ifscCode"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputField
                                            type='text'
                                            label={'IFSC Code'}
                                            {...field}
                                            required={true}
                                            placeholder="IFSC Code"
                                            errorMessage={errors.ifscCode?.message}
                                        />
                                    )}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '16px',
                                        marginTop: '16px',
                                        '@media(max-width:768px)': {
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }
                                    }}
                                >
                                    <ButtonInput type='submit' text='Update' disabled={false} loading={false} styles={{
                                        maxWidth: '210px',

                                    }}
                                        onClick={() => {
                                            setEditDetails(true)
                                            // reset({
                                            //     accountNumber: bankDetails?.accountNumber,
                                            //     accountHolder: bankDetails?.accountHolder,
                                            //     bank: bankDetails?.bank,
                                            //     address: bankDetails?.address,
                                            //     IFSCCode: bankDetails?.IFSCCode
                                            // })
                                        }}
                                    />
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Popup>
            )}
        </Box>
    );
};

export default BankDetails;
