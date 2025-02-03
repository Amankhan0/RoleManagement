import { title } from "process";
import React from "react";

interface Props {
    title?: string;
    loader?: boolean;
    icon?: React.ReactNode;
    hoverColor?:string;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const CustomIconWithText = ({ icon, title, loader,onClick }: Props) => {
    return (
        <center onClick={onClick} className={`cursor-pointer w-16 hover:bg-lightGray rounded-lg px-1 pt-1`}>
            {
                !loader ?
                    <i>{icon}</i> :
                    <div className="spinner w-4 h-4 animate-spin  rounded-full border-[2px] border-black"></div>
            }
            <p className="text-[10px]">{!loader?title:'loading....'}</p>
        </center>
    );
};

export default CustomIconWithText;
