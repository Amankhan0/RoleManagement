import React from "react";

interface Props {
    title?: string,
    highlightBgColor?: string,
    defaultBgColor?: string,
    hightlightTextColor?: string,
    defaultTextColor?: string,
    hightlight?: boolean
}

const CustomStatus = ({ title, highlightBgColor, defaultBgColor, hightlight, defaultTextColor, hightlightTextColor }: Props) => {
    return (
        <p
            className={`w-20 p-1 text-center rounded-lg`}
            style={{ background: hightlight ? highlightBgColor : defaultBgColor, color: hightlight ? hightlightTextColor : defaultTextColor }}>
            {title}
        </p>
    );
};

export default CustomStatus;
