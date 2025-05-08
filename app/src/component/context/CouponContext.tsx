import { createContext, useState, ReactNode } from 'react';

export const CouponsContext = createContext<any>(null);

interface CouponsProviderProps {
  children: ReactNode;
}

export const CouponsProvider: React.FC<CouponsProviderProps> = ({ children }) => {
    const [createCoupon, setCreateCoupon] = useState<boolean>(false);
    const [CouponActionType, setCouponActionType] = useState<string>("Add new Coupon");
    const [couponId, setCouponId] = useState<string>('');
    const [couponName, setCouponName] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [couponMemberStatus, setCouponMemberStatus] = useState<boolean>(false);
    const [editCouponData, setEditCouponData] = useState<any>(null);
    const [fetchData, setFetchData] = useState<boolean>(true);

    return (
        <CouponsContext.Provider
            value={{
                createCoupon,
                setCreateCoupon,
                CouponActionType,
                setCouponActionType,
                couponId,
                setCouponId,
                couponName,
                setCouponName,
                expiryDate,
                setExpiryDate,  // Fixed missing setter
                couponMemberStatus,
                setCouponMemberStatus,
                editCouponData,
                setEditCouponData,
                fetchData,
                setFetchData
            }}
        >
            {children}
        </CouponsContext.Provider>
    );
};