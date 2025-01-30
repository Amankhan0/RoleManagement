import React from "react";
import cn from "../../../utils/class-names";

interface props {
    title?: string; // imp
    className?: string;
}

const CustomTitle = ({ title,className }: props) => {

    return (
        <div>
            <p className={cn(`text-lg ${className}`)}>{title}</p>
        </div>
    );
};

export default CustomTitle;
