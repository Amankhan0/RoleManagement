import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { BodyDataApiResponse, BodyDataItem, permissions, setBodyData, setSingleRoleData } from "../../../features/RoleSlice";
import { Active, searchBodyData } from "../../../constants/constants";
import { ApiHit } from "../../../constants/Apihit";
import { ObjIsEmpty } from "../../../utils/utils";
import toast from "react-hot-toast";
import CustomTitle from "../../../components/ui/title/CustomTitle";

const RoleBody = () => {

    const RoleManagementReducer = useSelector((state: RootState) => state.RoleSlice);
    const dispatch = useDispatch()

    useEffect(() => {
        if (ObjIsEmpty(RoleManagementReducer?.bodyData) && RoleManagementReducer?.activeScreenIndex !== 0) {
            fetchBodyData()
        }
    }, [RoleManagementReducer])

    const fetchBodyData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: {
                usedById: RoleManagementReducer?.sidebarData?.data?.[RoleManagementReducer?.activeScreenIndex - 1]?._id
            }
        }
        ApiHit(json, searchBodyData).then((result) => {
            const bodyData = result as BodyDataApiResponse;
            dispatch(setBodyData(bodyData));
        })
            .catch((error) => {
                console.error("API hit failed", error);
            });
    }

    const onCheckPermission = (key: keyof permissions, componentName: string) => {
        const roleData = RoleManagementReducer?.singleRoleData;
        if (roleData.data && Array.isArray(roleData.data) && roleData.data[0]?.permission) {
            const index = roleData.data[0].permission.findIndex((ele) => {
                if (Array.isArray(ele.bodyDataId)) {
                    return ele.bodyDataId.some((item) => item.componentName === componentName);
                } else if (ele.bodyDataId) {
                    return ele.bodyDataId.componentName === componentName;
                }
                return false;
            });
            if (index < 0) {
                toast.error('Give sidebar menu permission first.');
            } else {
                const updatedRoleData = JSON.parse(JSON.stringify(roleData));
                const updatedPermission = [...updatedRoleData.data[0].permission];
                const permission = { ...updatedPermission[index] };
                if (permission.bodyDataPermission) {
                    permission.bodyDataPermission[key] = permission.bodyDataPermission[key] ? false : true;
                }
                updatedPermission[index] = permission;
                updatedRoleData.data[0].permission = updatedPermission;
                dispatch(setSingleRoleData(updatedRoleData));
            }
        }

    };

    return (
        <div className="w-[80%] bg-lightGray rounded-lg ml-5 p-5 shadow-lg">
            <div className="grid grid-cols-3 gap-10 m-10">
                {
                    RoleManagementReducer?.bodyData?.data?.map(
                        (ele: BodyDataItem, i: number) => {
                            const roleData = RoleManagementReducer?.singleRoleData;
                            let permission;
                            if (roleData?.data?.[0]?.permission) {
                                const index = roleData.data[0].permission.findIndex((element) => {
                                    if (Array.isArray(element.bodyDataId)) {
                                        return element.bodyDataId.some((item) => item.componentName === ele.componentName);
                                    } else if (element.bodyDataId) {
                                        return element.bodyDataId.componentName === ele.componentName;
                                    }
                                    return false;
                                });

                                if (index >= 0) {
                                    permission = roleData.data[0].permission[index];
                                }
                            }
                            const writePermission = permission?.bodyDataPermission?.write ?? false;
                            const readPermission = permission?.bodyDataPermission?.read ?? false;
                            const deletePermission = permission?.bodyDataPermission?.delete ?? false;
                            return (
                                ele.status === Active &&
                                <div className="bg-darkGray rounded-lg h-44" key={i}>
                                    <div className="flex justify-between p-2 h-[20%] bg-darkGray border rounded-t-lg">
                                        <p className="w-max h-max">{ele.componentName}</p>
                                    </div>
                                    <div className="border rounded-b-lg border-darkGray bg-lightGray h-[60%] flex justify-center items-center">
                                        <p className="text-5xl text-primary">{ele.hits}</p>
                                        <div>
                                            <p className="mt-5 text-xs">Hits</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-around gap-2 mt-1 px-4">
                                        <div className="flex gap-2">
                                            <CustomTitle className="text-base" title="Write :" />
                                            <input onChange={() => onCheckPermission('write', ele.componentName || '')} checked={writePermission} type="checkbox" />
                                        </div>
                                        <div className="flex gap-2">
                                            <CustomTitle className="text-base" title="Read :" />
                                            <input onChange={() => onCheckPermission('read', ele.componentName || '')} checked={readPermission} type="checkbox" />
                                        </div>
                                        <div className="flex gap-2">
                                            <CustomTitle className="text-base" title="Delete :" />
                                            <input onChange={() => onCheckPermission('delete', ele.componentName || '')} checked={deletePermission} type="checkbox" />
                                        </div>
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

export default RoleBody;
