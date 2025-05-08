import { createContext, useState } from 'react';

export const CouponsContext = createContext(null);

export const CouponsProvider = ({ children }) => {
    const [createCoupon, setCreateCoupon] = useState(false);
    const [CouponActionType, setCouponActionType] = useState("Add new Coupon");
    const [couponId, setCouponId] = useState('');
    const [couponName, setCouponName] = useState('');
    const [expiryDate, setexpiryDate] = useState('');
    const [couponMemberStatus, setCouponMemberStatus] = useState(false)
    const [editCouponData, setEditCouponData] = useState(null);
    const [fetchData, setFetchData] = useState(true);
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
                expiryDate,
                setCouponName,
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
