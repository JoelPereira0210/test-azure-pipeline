import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPasswordSchema } from '../lib/zod/auth';
import { createPasswordDataType as FormData } from '@/src/lib/types/registerNumber.types';
import { loginAction, fetchLoggedInUserdata } from '../actions/auth';
import { useRouter } from 'next/navigation';
import Button from '../component/UI/Button/Button';
import { Box, useMediaQuery } from '@mui/material';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import InputField from '@/src/component/UI/InputField/InputField';
import toast from 'react-hot-toast';
import { acceptUserAction, checkMembership } from '../actions/society';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PaymentContext } from '../component/context/PaymentContext';

type Props = {
    phoneNumber: string;
    societyId: string;
    useId?: string;
};



const CreatePasswordForm = (props: Props) => {
    console.log("Props passed to CreatePasswordForm:", props);

    const {
        paymentItemAmount,
        setPaymentItemAmount,
        paymentItemName,
        setPaymentItemName,
        paymentItemId,
        setPaymentItemId,
        paymentItemSection,
        setPaymentItemSection,
        eventRegistrationCount,
        subscriptionDuration,
        setSubscriptionDuration,
        subscriptionMaxUsers,
        setSubscriptionMaxUsers
    } = useContext(PaymentContext);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [membershipAmount, setMembershipAmount] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isLargeScreen = useMediaQuery('(min-width:768px)');
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createPasswordSchema),
        mode: 'onBlur',
    });
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


    const onSubmit = async (data: FormData) => {
        console.log('DATA', data);


        try {
            setLoading(true);
            const payload = {
                phoneNumber: props?.phoneNumber,
                societyId: props?.societyId,
                ...data
            }
            console.log("payload", payload)
            const response: any = await acceptUserAction(payload);
            console.log('res', response);
            console.log(response.status)
            if (response?.status === 200) {
                // window.location.href = "/signup?signin"
                //     const loggedInUserData = await fetchLoggedInUserdata();

                //     if (loggedInUserData) {
                //         window.location.href = '/committee';
                //     }
                const { membershipFeeAmount } = response.data;
                setMembershipAmount(membershipFeeAmount);

                // Update PaymentContext values
                setPaymentItemAmount(membershipFeeAmount);
                router.push('/membership-checkout')

            }
            else if (response?.status === 209) {
                window.location.href = '/signup?signin';

                // window.location.href = '/membership-checkout';
            }
        } catch (error) {
            // toast.error("ERROR")
            console.error('Error', error);
        } finally {
            setLoading(false);
        }
    };
    console.log("data", membershipAmount, paymentItemAmount)



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
                <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <InputField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            required={true}
                            placeholder="Password"
                            onPaste={(e) => e.preventDefault()}
                            // error={errors.password?.message}
                            errorMessage={errors.password ? String(errors.password.message) : undefined}
                            icon={
                                showPassword ? (
                                    <VisibilityOff
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={togglePasswordVisibility}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <Visibility
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={togglePasswordVisibility}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                )
                            }
                            infoText={['Cannot contain your name or email address', 'At least 8 characters', 'Contains a number and symbol']}
                        />
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <InputField
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...field}
                            required={true}
                            placeholder="Confirm Password"
                            onPaste={(e) => e.preventDefault()}
                            // errorMessage={errors.confirmPassword?.message}
                            errorMessage={errors.confirmPassword ? String(errors.confirmPassword.message) : undefined}
                            icon={
                                showConfirmPassword ? (
                                    <VisibilityOff
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={toggleConfirmPasswordVisibility}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <Visibility
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={toggleConfirmPasswordVisibility}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                )
                            }
                            infoText={['Password should match']}

                        />
                    )}
                />
            </Box>
            <Button loading={loading} text="Register" type="submit" disabled={false} />
        </form>
    );
};

export default CreatePasswordForm;
