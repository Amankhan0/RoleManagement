import React, { useEffect, useState } from "react";
import CustomButton from "../../components/ui/forms/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { plusIcon, trashBinIcon } from "../../components/icons/icons";
import { BodyDataApiResponse, BodyDataItem, PanelTypes, setBodyData, setBodyModal, setPanelData } from "../../features/applicationmanagement";
import CustomSwitch from "../../components/ui/forms/CustomSwitch";
import { Active, deleteBodyData, InActive, searchBodyData, updateBodyData } from "../../constants/constants";
import { ApiHit } from "../../constants/Apihit";
import { ObjIsEmpty } from "../../utils/utils";
import toast from "react-hot-toast";

const ApplicationManagementBody = () => {

    const ApplicationManagementReducer = useSelector((state: RootState) => state.ApplicationManagementReducer);
    const dispatch = useDispatch()

    useEffect(() => {
        if (ObjIsEmpty(ApplicationManagementReducer?.bodyData) && ApplicationManagementReducer?.activeScreenIndex !== 0) {
            fetchBodyData()
        }
    }, [ApplicationManagementReducer])

    const fetchBodyData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: {
                usedById: ApplicationManagementReducer?.sidebarData?.data?.[ApplicationManagementReducer?.activeScreenIndex - 1]?._id
            }
        }
        ApiHit(json, searchBodyData).then((result) => {
            const bodyData = result as BodyDataApiResponse; // Type assertion for 'data'
            dispatch(setBodyData(bodyData)); // Dispatch the sidebarItems
        })
            .catch((error) => {
                console.error("API hit failed", error); // Handle errors
            });
    }

    const onClickBodyComponents = () => {
        dispatch(setBodyModal(true))
    }

    const onDeleteComponent = (index: number, id: string) => {
        const confirmation = window.confirm('Are you sure you want to delete this component?');
        if (confirmation) {
            var json = {
                _id: id
            }
            ApiHit(json, deleteBodyData).then(result => {
                if (result.statusCode === 204) {
                    dispatch(setBodyData({}))
                }
            })
        }
    };

    const onSwitch = (index: number, ele: BodyDataItem) => {
        const confirmation = window.confirm(`Are you sure you want to ${ele.status === 'Active' ? 'InActive' : 'Active'} component`);
        if (confirmation) {
            const updatedEle = {
                _id:ele._id,
                status: ele.status === 'Active' ? 'InActive' : 'Active'
            };
            ApiHit(updatedEle,updateBodyData).then(result=>{
                if(result.statusCode === 200){
                    toast.success(ele.status === 'Active' ? 'Component Has Activated' : 'Component Has Inactived')
                    dispatch(setBodyData({}))
                }
            })
        }
    };

    return (
        <div className="w-[80%] bg-lightGray rounded-lg ml-5 p-5 shadow-lg">
            {
                ApplicationManagementReducer?.activeScreenIndex !== 0 &&
                <CustomButton onClick={() => onClickBodyComponents()} icon={plusIcon} title="Add Components" />
            }
            <div className="grid grid-cols-4 gap-10 m-10">
                {
                    ApplicationManagementReducer?.bodyData?.data?.map(
                        (ele: BodyDataItem, i: number) => {
                            return (
                                <div className="bg-darkGray rounded-lg h-44" key={i}>
                                    <div className="flex justify-between p-2 h-[20%] bg-darkGray border rounded-t-lg">
                                        <p className="w-max h-max">{ele.componentName}</p>
                                        <i className="text-red cursor-pointer" onClick={() => onDeleteComponent(i, ele?._id)}>
                                            {trashBinIcon}
                                        </i>
                                    </div>
                                    <div className="border rounded-b-lg border-darkGray bg-lightGray h-[60%] flex justify-center items-center">
                                        <p className="text-5xl text-primary">{ele.hits}</p>
                                        <div>
                                            <p className="mt-5 text-xs">Hits</p>
                                        </div>
                                    </div>
                                    <div className="h-[20%] flex items-center justify-between px-2">
                                        <p>{ele.status}</p>
                                        <CustomSwitch checked={ele.status === Active ? true : false} onSwitch={() => onSwitch(i, ele)} name="status" />
                                    </div>
                                </div>
                            );
                        }
                    )
                }

            </div>
        </div>
    );
};

export default ApplicationManagementBody;
