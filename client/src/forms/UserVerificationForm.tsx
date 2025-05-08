import React, { useState } from 'react';
import InputField from '@/src/component/UI/InputField/InputField';
import { useForm, Controller, Form } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumberSchema, userVerificationSchema } from '../lib/zod/auth';
import { UserVerificationDataType as FormData } from '@/src/lib/types/registerNumber.types';
import { phoneNumberAction } from '../actions/auth';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/src/lib/constants/appRoutes';
import Button from '../component/UI/Button/Button';
import { Box, FormGroup, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import ButtonInput from '../component/UI/Button/Button';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import { verifySocietyUserAction } from '../actions/society';
// import TermsCheckbox from '../component/UI/Checkbox/TermsCheckbox';

const UserVerificationForm = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    const {
        handleSubmit,
        control,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(userVerificationSchema),
        defaultValues: {
            phoneNumber: props.phoneNumber,
            societyId: props.societyId,
            societyName: props.societyName

        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            console.log('data onSubmit', data);
            const response: any = await verifySocietyUserAction(data);
            if (response?.status === 200) {
                console.log('Res', response?.data);
                props.setSteps(2);
                // router.replace(AppRoutes.dashboard);
            }
        } catch (error) {
            console.log('Error', error);
        } finally {
            setLoading(false);
        }
    };
    console.log('eee', errors)

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...(!isLargeScreen && {
                    padding: '0 20px',
                }),
            }}
        >
            <Box
                sx={{
                    marginBottom: '110px',
                }}
            >
                {/* <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <InputField
              label="Mobile Number"
              type="text"
              // error={errors.phone_number?.message}
              error={errors.phone_number?.message}
              helperText={errors.phone_number?.message}
              {...field}
            />
          )}
        /> */}
                {/* <MobileInput
          name="phone_number"
          control={control}
          label={'Mobile Number'}
          placeholder="Mobile Number"
          rules={{ required: 'Mobile Number is required' }}
          country={'IN'}
        /> */}
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <MobileInput
                            name={field.name}
                            control={control}
                            readOnly={true}
                            required={true}
                            label="Mobile Number"
                            placeholder="Mobile Number"
                            error={errors.phoneNumber?.message}
                            country="IN"
                        />
                    )}
                />
                <Controller
                    name="societyName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <InputField
                            label="Society Name"
                            type="text"
                            required={true}
                            readOnly={true}
                            // error={errors.societyId?.message}
                            errorMessage={errors.societyName ? String(errors.societyName.message) : undefined}
                            // errorMessage={errors.societyId ? String(errors.societyId.message) : undefined}

                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                            }}
                            classes=""
                        />
                    )}
                />
                {/* <Controller
          control={control}
          name="terms_and_conditions"
          defaultValue={false}
          render={({ field }) => (
            <TermsCheckbox
              label="By signing up to create an account I accept Company’s"
              spanText="Terms of use & Privacy Policy."
              onClick={showTermsModal}
              error={errors?.terms_and_conditions?.message}
              classes=""
              {...field}
            />
          )}
        /> */}
            </Box>
            <ButtonInput
                loading={loading}
                text="Proceed"
                // disabled={isSubmitting}
                disabled={false}
                type="submit"
            />
        </form>
    );
};

export default UserVerificationForm;
