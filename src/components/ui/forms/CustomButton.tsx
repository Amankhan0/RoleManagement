import React from "react";
import { plusIcon } from "../../icons/icons";
import { buttonClass } from "../../../constants/constants";
import cn from "../../../utils/class-names";

interface props {
    title?: string;
    className?: string;
    iconClass?: string;
    titleClass?: string;
    placeholder?: string;
    type?: string;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    id?: string;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
}

const CustomButton = ({ title, className, onClick, iconClass, titleClass, icon, type }: props) => {
    return (
        type !== 'loader' ?
            <div onClick={onClick} className={cn(`${buttonClass} ${className}`)}>
                <div className="flex gap-2 items-center">
                    {icon && <i className={cn(`text-white ${iconClass}`)}>{icon}</i>}
                    <p className={cn(`text-white ${titleClass}`)}>{title}</p>
                </div>
            </div>
            :
            <button className={cn(`${buttonClass} ${className}`)}>
                <div className="w-max text-white">
                    <div className="flex gap-x-2 items-center">
                        <div className="spinner w-4 h-4 animate-spin  rounded-full border-[2px] border-white"></div>
                        <div>Loading.....</div>
                    </div>
                </div>
            </button>
    );
};

export default CustomButton;