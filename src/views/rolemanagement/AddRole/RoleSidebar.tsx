import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Active, InActive, searchApplicationSidebar, searchBodyData } from "../../../constants/constants";
import { ObjIsEmpty } from "../../../utils/utils";
import { ApiHit } from "../../../constants/Apihit";
import { BodyDataApiResponse, roleComponentPermission, setRoleSideBar, setBodyData, setSingleRoleData, sidebarItem, setActiveScreenIndex, setActiveScreenName } from "../../../features/RoleSlice";
import toast from "react-hot-toast";
import CustomSwitch from "../../../components/ui/forms/CustomSwitch";
import { setApiJson } from "../../../features/RoleApiSlice";

const RoleSidebar = () => {

    const RoleManagementReducer = useSelector((state: RootState) => state.RoleSlice);
    const ApiReducer = useSelector((state: RootState) => state.RoleApiSlice);

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
        dispatch(setActiveScreenIndex(index + 1))
        dispatch(setActiveScreenName(ele.screenName))
        const result = await ApiHit({ page: 1, limit: 10, search: { usedById: ele?._id } }, searchBodyData);
        const bodyData = result as BodyDataApiResponse;
        if (result?.statusCode === 200) {
            dispatch(setBodyData(bodyData));
        }
    }

    const onCheckPermission = async (ele: sidebarItem, index: number, type: boolean) => {
        dispatch(setActiveScreenIndex(index + 1))
        dispatch(setActiveScreenName(ele.screenName))
        try {
            // Fetch the data
            const result = await ApiHit({ page: 1, limit: 10, search: { usedById: ele?._id } }, searchBodyData);
            const bodyData = result as BodyDataApiResponse;
            dispatch(setBodyData(bodyData));
            console.log('bodyData', bodyData);

            if (bodyData.data?.length !== 0) {
                if (result?.statusCode === 200) {
                    const roleData = RoleManagementReducer?.singleRoleData;
                    if (roleData.data) {
                        if (roleData?.data?.[0]?.permission) {
                            const permissions = roleData?.data?.[0]?.permission?.length !== 0 ? roleData?.data?.[0]?.permission : [];
                            const findIndex = permissions.findIndex(p => p.applicationSidebarDataId?._id === ele._id);  // Adjusted to use `_id`
                            if (findIndex < 0) {
                                givePermission(ele, index, type, bodyData);
                            } else {
                                const permission = { ...permissions[findIndex] };
                                console.log('permission', permission);

                                permission.status = permission?.status === "Active" ? "InActive" : "Active";

                                // Update bodyDataPermissions based on the selected type
                                permission.bodyData = permission.bodyData.map(item => {
                                    const updatedPermission = { ...item };
                                    if (!updatedPermission.bodyDataPermission) {
                                        updatedPermission.bodyDataPermission = { read: true, write: false, delete: false }
                                    }
                                    return updatedPermission;
                                });
                                const updatedPermissions = [
                                    ...permissions.slice(0, findIndex),
                                    permission,
                                    ...permissions.slice(findIndex + 1),
                                ];
                                const updatedRoleData = { ...roleData.data[0], permission: updatedPermissions };
                                dispatch(setSingleRoleData({ ...roleData, data: [updatedRoleData] }));
                            }
                        }
                    }
                }
            } else {
                alert('Component not found')
            }

        } catch (error) {
            console.log(error);
        }
    };

    const givePermission = async (ele: sidebarItem, index: number, type: boolean, bodyData: BodyDataApiResponse) => {
        if (bodyData?.data?.length !== 0) {
            const json: roleComponentPermission = {
                applicationSidebarDataId: ele,
                bodyData: bodyData?.data?.map((element) => ({
                    bodyDataId: element,
                    bodyDataPermission: { read: false, write: false, delete: false },
                })) || [],
                status: 'Active', // Ensure status is a string if it expects a string
            };

            const permission: roleComponentPermission[] = [json]; // Ensure permission is of type roleComponentPermission[]

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
                alert('Component not found')

            }
        } else {
            alert('Component not found')
        }
    };

    const onSwitchAdvancePermission = (name:string) => {
        if(ApiReducer?.apiJson?.[name] === 'Active'){
            const updatedJson = {
                ...ApiReducer?.apiJson,
                [name]: 'inActive',
            };
            dispatch(setApiJson(updatedJson))
        }else{
            const updatedJson = {
                ...ApiReducer?.apiJson,
                [name]: 'Active',
            };
            dispatch(setApiJson(updatedJson))
        }
    }

    console.log('ApiReducer', ApiReducer);
    console.log('RoleManagementReducer', RoleManagementReducer);

    return (
        <div className={`w-[20%] shadow-lg bg-lightGray rounded-lg`} style={{ height: height / 1.1 }}>
            <div className="flex justify-between text-sm p-3 border-b border-b-darkGray items-center">
                <p className="font-bold">List of Features</p>
            </div>
            {
                RoleManagementReducer?.singleRoleData?.data?.[0]?.roleType === 'superAdmin' &&
                <div className="m-3 my-10">
                    <p className="font-bold underline">Advance Features</p>
                    <div className="flex border-b border-b-darkGray items-center p-3 justify-between">
                        <p className="text-xs">Application Management</p>
                        <CustomSwitch onSwitch={() => onSwitchAdvancePermission('applicationManagement')} name="applicationManagement" checked={ApiReducer?.apiJson?.applicationManagement === 'Active' ? true : false} />
                    </div>
                    <div className="flex border-b border-b-darkGray items-center p-3 justify-between">
                        <p className="text-xs">Role Management</p>
                        <CustomSwitch onSwitch={() => onSwitchAdvancePermission('roleManagement')} name="roleManagement" checked={ApiReducer?.apiJson?.roleManagement === 'Active' ? true : false} />
                    </div>
                    <div className="flex border-b border-b-darkGray items-center p-3 justify-between">
                        <p className="text-xs">User Management</p>
                        <CustomSwitch onSwitch={() => onSwitchAdvancePermission('userManagement')} name="userManagement" checked={ApiReducer?.apiJson?.userManagement === 'Active' ? true : false} />
                    </div>
                </div>
                
            }
            <div>
                {RoleManagementReducer?.singleRoleData?.data?.[0]?.roleType === 'superAdmin' && <p className="font-bold underline m-3">Genral Features</p>}
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
                            <div className="flex border-b border-b-darkGray items-center p-3 justify-between">
                                <div key={i} onClick={() => onClickSidebarMenu(ele, i, true)} className={`cursor-pointer text-sm ${RoleManagementReducer?.activeScreenIndex === i + 1 ? 'text-primary' : ''}`}>
                                    <p>{ele?.screenName}</p>
                                </div>
                                <CustomSwitch checked={isChecked} onSwitch={() => onCheckPermission(ele, i, false)} name="radio" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default RoleSidebar;
