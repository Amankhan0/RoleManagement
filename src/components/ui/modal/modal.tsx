import React from "react";
import { crossMarkIcon } from "../../../components/icons/icons";

interface props {
    children?: React.ReactNode; // imp
    ModalTitle?: string,
    onClickClose?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const CustomModal = ({ children, ModalTitle, onClickClose }: props) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-lg w-1/2 mx-4">
                <div className='flex justify-between rounded-tl-lg rounded-tr-lg text-white p-2 bg-primary'>
                    <p>{ModalTitle}</p>
                    <p className="cursor-pointer" onClick={onClickClose}>{crossMarkIcon}</p>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
