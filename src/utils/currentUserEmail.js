import React from 'react';
import { useSelector } from 'react-redux';

const currentUserEmail = () => {
    const { user } = useSelector((state) => state.auth) || {};
    const email = user?.email || "";
    return (
        `${email}`
    );
};

export default currentUserEmail;