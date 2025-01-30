import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/ui/forms/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { plusIcon, trashBinIcon } from "../../../components/icons/icons";
import { BodyDataApiResponse, BodyDataItem, permissions, setBodyData, setSingleRoleData } from "../../../features/rolemanagementreducer";
import CustomSwitch from "../../../components/ui/forms/CustomSwitch";
import { Active, deleteBodyData, InActive, searchBodyData, updateBodyData } from "../../../constants/constants";
import { ApiHit } from "../../../constants/Apihit";
import { ObjIsEmpty } from "../../../utils/utils";
import toast from "react-hot-toast";
import CustomTitle from "../../../components/ui/title/CustomTitle";

const RoleBody = () => {

    const RoleManagementReducer = useSelector((state: RootState) => state.RoleManagementReducer);
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
            const bodyData = result as BodyDataApiResponse; // Type assertion for 'data'
            dispatch(setBodyData(bodyData)); // Dispatch the sidebarItems
        })
            .catch((error) => {
                console.error("API hit failed", error); // Handle errors
            });
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
        const confirmation = window.confirm(`Are you sure you want to ${ele.status === Active ? InActive : Active} component`);
        if (confirmation) {
            const updatedEle = {
                _id: ele._id,
                status: ele.status === Active ? InActive : Active
            };
            ApiHit(updatedEle, updateBodyData).then(result => {
                if (result.statusCode === 200) {
                    toast.success(ele.status === Active ? 'Component Has Activated' : 'Component Has Inactived')
                    dispatch(setBodyData({}))
                }
            })
        }
    };

    const onCheckPermission = (key: keyof permissions, componentName: string) => {
        const oldData = RoleManagementReducer?.singleRoleData;
        if (oldData?.data?.[0]) {
            const role = oldData.data[0];
            if (role.permissions) {
                const componentIndex = role.permissions[RoleManagementReducer?.activeScreenIndex].componentPermissions.findIndex(
                    (p) => p.componentName === componentName
                );
                const componentPermissions = [...role.permissions[RoleManagementReducer?.activeScreenIndex].componentPermissions];
                const permissions = { ...componentPermissions[componentIndex].permissions }; 
                if (permissions[key] !== undefined) {
                    permissions[key] = !permissions[key];
                }
                componentPermissions[componentIndex] = {
                    ...componentPermissions[componentIndex],
                    permissions
                };
                const updatedRole = {
                    ...role,
                    permissions: [
                        ...role.permissions.slice(0, RoleManagementReducer?.activeScreenIndex),
                        {
                            ...role.permissions[RoleManagementReducer?.activeScreenIndex],
                            componentPermissions
                        },
                        ...role.permissions.slice(RoleManagementReducer?.activeScreenIndex + 1)
                    ]
                };
                const updatedState = {
                    ...oldData,
                    data: [updatedRole]
                };
                dispatch(setSingleRoleData(updatedState));
            }
        }
    };

    return (
        <div className="w-[80%] bg-lightGray rounded-lg ml-5 p-5 shadow-lg">
            <div className="grid grid-cols-3 gap-10 m-10">
                {
                    RoleManagementReducer?.bodyData?.data?.map(
                        (ele: BodyDataItem, i: number) => {
                            const rolePermission = RoleManagementReducer?.singleRoleData?.data?.[0]?.permissions?.find(
                                (perm) => perm.componentPermissions.some((comp) => comp.componentName === ele.componentName)
                            );
                            const componentPermissions = rolePermission?.componentPermissions.find(
                                (comp) => comp.componentName === ele.componentName
                            );
                            const writePermission = componentPermissions?.permissions?.write || false;
                            const readPermission = componentPermissions?.permissions?.read || false;
                            const deletePermission = componentPermissions?.permissions?.delete || false;
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
