import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Active, InActive, searchApplicationSidebar, searchBodyData } from "../../../constants/constants";
import { ObjIsEmpty } from "../../../utils/utils";
import { ApiHit } from "../../../constants/Apihit";
import { BodyDataApiResponse, roleComponentPermission, setRoleSideBar, setBodyData, setSingleRoleData, sidebarItem, setActiveScreenIndex } from "../../../features/RoleSlice";
import toast from "react-hot-toast";
import CustomSwitch from "../../../components/ui/forms/CustomSwitch";

const RoleSidebar = () => {

    const RoleManagementReducer = useSelector((state: RootState) => state.RoleSlice);

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

    const onClickSidebarMenu = async (ele: sidebarItem, index: number, type: boolean,) => {
        dispatch(setActiveScreenIndex(index+1))
        const result = await ApiHit({ page: 1, limit: 10, search: { usedById: ele?._id } }, searchBodyData);
        const bodyData = result as BodyDataApiResponse;
        if (result?.statusCode === 200) {
            dispatch(setBodyData(bodyData));
        }
    }

    const onCheckPermission = async (ele: sidebarItem, index: number, type: boolean) => {
        try {
            const result = await ApiHit({ page: 1, limit: 10, search: { usedById: ele?._id } }, searchBodyData);
            const bodyData = result as BodyDataApiResponse;
            dispatch(setBodyData(bodyData));
            if (result?.statusCode === 200) {
                const roleData = RoleManagementReducer?.singleRoleData;
                if (roleData.data) {
                    const permissions = roleData?.data?.[0]?.permission || [];
                    const findIndex = permissions.findIndex(p => p.applicationSidebarDataId?.screenName === ele.screenName);
                    if (findIndex < 0) {
                        givePermission(ele, index, type, bodyData);
                    } else {

                        
                        const permission = { ...permissions[findIndex] };
                        permission.status = permission?.status === Active ? InActive : Active;

                        console.log('permission',permission);
                        

                        // const updatedPermissions = [
                        //     ...permissions.slice(0, findIndex),
                        //     permission,
                        //     ...permissions.slice(findIndex + 1),
                        // ];

                        // const updatedRoleData = { ...roleData.data[0], permission: updatedPermissions };
                        // dispatch(setSingleRoleData({ ...roleData, data: [updatedRoleData] }));
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const givePermission = async (ele: sidebarItem, index: number, type: boolean, bodyData: BodyDataApiResponse) => {
        const permission = bodyData?.data?.map((element) => ({
            bodyDataId: element,
            bodyDataPermission: { read: false, write: false, delete: false },
            applicationSidebarDataId: element?.usedById,
            status: Active,
        })) || [];

        console.log(permission);
        
        
        if (permission.length > 0) {
            const roleData = RoleManagementReducer?.singleRoleData;
            if (roleData.data) {
                const updated = roleData?.data?.[0]?.permission?.length
                    ? { ...roleData.data[0], permission: [...roleData.data[0].permission, ...permission] }
                    : { ...roleData.data[0], permission };

                if (updated) {
                    dispatch(setSingleRoleData({ ...roleData, data: [updated] }));
                } else {
                    console.error("Failed to update role data: updated is undefined.");
                }
            }
        } else {
            toast.error(`Component not found`);
        }
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
                            if (role.permission) {
                                const existingPermission = role.permission.find(p => p.applicationSidebarDataId?.screenName === ele.screenName);
                                if (existingPermission?.status === Active) {
                                    isChecked = true;
                                }
                            }
                        }
                        return (
                            ele.status === Active &&
                            <div key={i} className="flex border-b border-b-darkGray items-center p-3 justify-between">
                                <div key={i} onClick={() => onClickSidebarMenu(ele, i, true)} className={`cursor-pointer text-sm ${RoleManagementReducer?.activeScreenIndex === i + 1 ? 'text-primary' : ''}`}>
                                    <p>{ele?.screenName}</p>
                                </div>
                                <CustomSwitch className="cursor-pointer" checked={isChecked} onSwitch={() => onCheckPermission(ele, i, false)} name="radio"/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default RoleSidebar;
