import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setApiJson } from "../../../features/apireducer";
import cn from "../../../utils/class-names";

interface props {
    name: string; // imp
    className?: string;
    checked?: boolean;
    onSwitch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomSwitch = ({ className, onSwitch, name, checked }: props) => {

    const ApiReducer = useSelector((state: RootState) => state.ApiReducer);
    const dispatch = useDispatch()

    const onSwitchClick = () => {
        if (ApiReducer?.apiJson?.[name]) {
            const updatedJson = {
                ...ApiReducer?.apiJson,
                [name]: true,
            };
            dispatch(setApiJson(updatedJson))
        } else {
            const updatedJson = {
                ...ApiReducer?.apiJson,
                [name]: false,
            };
            dispatch(setApiJson(updatedJson))
        }
    }

    return (
        <label className="inline-flex items-center cursor-pointer">
            <input onChange={onSwitch ? onSwitch : () => onSwitchClick()} type="checkbox" checked={checked} className="sr-only peer" />
            <div className={cn(`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600 ${className}`)}></div>
        </label>
    );
};

export default CustomSwitch;