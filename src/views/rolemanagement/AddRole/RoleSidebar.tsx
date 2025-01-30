import { userIcon, usersIcon } from "../../../components/icons/icons";
import CustomInput from "../../../components/ui/forms/CustomInput";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setApiJson } from "../../../features/apireducer";
import { Active, clientPanel, InActive, searchApplicationSidebar, searchBodyData, superAdminPanel } from "../../../constants/constants";
import { ObjIsEmpty } from "../../../utils/utils";
import { ApiHit } from "../../../constants/Apihit";
import { BodyDataApiResponse, BodyDataItem, roleApiResponse, roleComponentPermission, roleDataArr, rolePermission, setActiveScreenIndex, setRoleSideBar, setBodyData, setSingleRoleData, sidebarItem } from "../../../features/rolemanagementreducer";

const RoleSidebar = () => {

    const ApiReducer = useSelector((state: RootState) => state.ApiReducer);
    const RoleManagementReducer = useSelector((state: RootState) => state.RoleManagementReducer);

    const dispatch = useDispatch()

    var height = window.innerHeight

    useEffect(() => {
        if (!ObjIsEmpty(RoleManagementReducer?.singleRoleData) && ObjIsEmpty(RoleManagementReducer?.sidebarData)) {
            fetchSideBarData()
        }
    }, [RoleManagementReducer])

    const fetchSideBarData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: {
                type: RoleManagementReducer?.singleRoleData?.data?.[0]?.roleType
            }
        }
        ApiHit(json, searchApplicationSidebar).then(res => {
            if (res?.statusCode === 200) {
                dispatch(setRoleSideBar(res))
            }
        })
    }

    const onClickSideBarMenu = (i: number) => {
        dispatch(setActiveScreenIndex(i + 1))
        dispatch(setBodyData({}))
    }

    const onCheckPermission = (screenName: string, id: string, index: number,type:boolean) => {
        ApiHit({ page: 1, limit: 10, search: { usedById: id } }, searchBodyData)
            .then((result) => {
                if (result.statusCode !== 200) return;
                const bodyData = result as BodyDataApiResponse;
                dispatch(setActiveScreenIndex(index));
                dispatch(setBodyData(bodyData));
                const oldData = RoleManagementReducer?.singleRoleData;
                if (!oldData?.data?.[0]) return;
                const role = oldData.data[0];
                const componentPermissions: roleComponentPermission[] = result?.data?.map((item: BodyDataItem) => ({
                    componentName: item.componentName || '',
                    status: item.status || '',
                    hits: item.hits || '',
                    permissions: item.permissions || { write: false, read: false, delete: false }
                })) || [];
                let updatedPermissions = role.permissions || [];
                const existingPermissionIndex = updatedPermissions.findIndex(p => p.screenName === screenName);
                if (existingPermissionIndex !== -1) {
                    updatedPermissions = updatedPermissions.map((p, idx) =>
                        idx === existingPermissionIndex ? { ...p, status: p.status === Active ? type?Active:InActive : type?InActive:Active } : p
                    );
                } else {
                    updatedPermissions = [
                        ...updatedPermissions,
                        { screenName, status: type?InActive:Active, componentPermissions }
                    ];
                }
                const updatedRole: roleDataArr = { ...role, permissions: updatedPermissions };
                const finalData: roleApiResponse = { ...oldData, data: [updatedRole] };
                dispatch(setSingleRoleData(finalData));
            });
    };

    console.log(RoleManagementReducer);
    

    return (
        <div className={`w-[20%] shadow-lg bg-lightGray rounded-lg`} style={{ height: height / 1.1 }}>
            <div className="flex justify-between text-sm p-3 border-b border-b-darkGray items-center">
                <p className="font-bold">List of Features</p>
            </div>
            <div>
                {
                    RoleManagementReducer?.sidebarData?.data?.map((ele: sidebarItem, i: number) => {
                        const oldData = RoleManagementReducer?.singleRoleData;
                        let isChecked = false;
                        if (oldData?.data?.[0]) {
                            const role = oldData.data[0];
                            if (role.permissions) {
                                const existingPermission = role.permissions.find(p => p.screenName === ele.screenName);
                                if (existingPermission?.status === Active) {
                                    isChecked = true;
                                }
                            }
                        }
                        return (
                            ele.status === Active &&
                            <div key={i} className="flex gap-2 border-b border-b-darkGray items-center p-3">
                                <input onChange={() => onCheckPermission(ele?.screenName, ele._id,i,false)} checked={isChecked} type="checkbox" />
                                <div key={i} onClick={() => onCheckPermission(ele?.screenName, ele._id,i,true)} className={`cursor-pointer text-sm ${RoleManagementReducer?.activeScreenIndex === i + 1 ? 'text-primary' : ''}`}>
                                    <p>{ele?.screenName}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default RoleSidebar;
