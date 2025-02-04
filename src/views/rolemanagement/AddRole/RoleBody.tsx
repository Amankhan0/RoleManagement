import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { BodyDataApiResponse, bodyDataArr, BodyDataItem, permissions, roleComponentPermission, roleDataArr, setBodyData, setSingleRoleData } from "../../../features/RoleSlice";
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

        // Ensure data is available and valid
        if (roleData?.data && Array.isArray(roleData.data) && roleData.data[0]?.permission) {
            const findPermissionScreenIndex = roleData?.data[0]?.permission?.findIndex((item: roleComponentPermission) =>
                item.applicationSidebarDataId?.screenName === RoleManagementReducer?.activeScreenName
            );
            console.log('findPermissionScreenIndex', findPermissionScreenIndex);

            if (findPermissionScreenIndex !== undefined && findPermissionScreenIndex !== -1) {
                const index = roleData?.data[0]?.permission[findPermissionScreenIndex]?.bodyData?.findIndex((element) => {
                    console.log(element);
                    
                    return element.bodyDataId?.componentName === componentName;
                });
                console.log('index',index);
                console.log('componentName',componentName);
                
                
                if (index === undefined || index < 0) {

                } else {
                    // Clone the role data and update the permission
                    const updatedRoleData = JSON.parse(JSON.stringify(roleData));
                    const updatedPermission = [...updatedRoleData.data[0].permission];
                    const permission = { ...updatedPermission[findPermissionScreenIndex]?.bodyData[index] };

                    console.log('permission', permission);

                    if (permission.bodyDataPermission) {
                        // Toggle the permission based on the key
                        permission.bodyDataPermission[key] = !permission.bodyDataPermission[key];
                    }

                    updatedPermission[findPermissionScreenIndex].bodyData[index] = permission;
                    updatedRoleData.data[0].permission = updatedPermission;

                    // Dispatch updated role data
                    dispatch(setSingleRoleData(updatedRoleData));
                }
            } else {
                toast.error('Give sidebar menu permission first.');
            }
        }
    };


    console.log('RoleManagementReducer---',RoleManagementReducer);


    return (
        <div className="w-[80%] bg-lightGray rounded-lg ml-5 p-5 shadow-lg">
            <div className="grid grid-cols-3 gap-10 m-10">
                {
                    RoleManagementReducer?.bodyData?.data?.map((ele: BodyDataItem, i: number) => {
                        var componentName = ele.componentName; var findPermissionScreenIndex = RoleManagementReducer?.singleRoleData?.data?.[0]?.permission?.findIndex((item: roleComponentPermission) =>
                            item.applicationSidebarDataId?.screenName === RoleManagementReducer?.activeScreenName
                        );
                        let writePermission = false;
                        let readPermission = false;
                        let deletePermission = false;
                        if (findPermissionScreenIndex !== undefined && findPermissionScreenIndex !== -1) {
                            var index = RoleManagementReducer?.singleRoleData?.data?.[0]?.permission?.[findPermissionScreenIndex]?.bodyData?.findIndex((element) => {
                                return element.bodyDataId?.componentName === componentName;
                            });
                            if (index !== undefined && index !== -1) {
                                writePermission = RoleManagementReducer?.singleRoleData?.data?.[0]?.permission?.[findPermissionScreenIndex]?.bodyData?.[index]?.bodyDataPermission?.write || false;
                                readPermission = RoleManagementReducer?.singleRoleData?.data?.[0]?.permission?.[findPermissionScreenIndex]?.bodyData?.[index]?.bodyDataPermission?.read || false;
                                deletePermission = RoleManagementReducer?.singleRoleData?.data?.[0]?.permission?.[findPermissionScreenIndex]?.bodyData?.[index]?.bodyDataPermission?.delete || false;
                            }
                        }
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
