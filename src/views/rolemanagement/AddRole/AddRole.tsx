import React, { useEffect, useState } from "react";
import RoleSidebar from "./RoleSidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { ObjIsEmpty } from "../../../utils/utils";
import { ApiHit } from "../../../constants/Apihit";
import { clientPanel, searchRole, updateRole } from "../../../constants/constants";
import { roleApiResponse, setRoleSideBar, setBodyData, setSingleRoleData, setActiveScreenIndex, setRoleData } from "../../../features/RoleSlice";
import RoleBody from "./RoleBody";
import CustomTitle from "../../../components/ui/title/CustomTitle";
import { leftArrow, saveIcon, userIcon, usersIcon } from "../../../components/icons/icons";
import { NavLink } from "react-router-dom";
import CustomButton from "../../../components/ui/forms/CustomButton";
import toast from "react-hot-toast";
import { setApiJson } from "../../../features/RoleApiSlice";

interface Props {
    id?: string;
    setPage?: (value: string) => void;
}

const AddRole = ({ id, setPage }: Props) => {

    const RoleManagementReducer = useSelector((state: RootState) => state.RoleSlice);
    const ApiReducer = useSelector((state: RootState) => state.RoleApiSlice);
    const dispatch = useDispatch()
    useEffect(() => {
        if (ObjIsEmpty(RoleManagementReducer?.singleRoleData)) {
            fetchRollData()
        }
    }, [RoleManagementReducer])

    const fetchRollData = () => {
        var json = {
            page: 1,
            limit: 10,
            search: {
                _id: id
            }
        }
        ApiHit(json, searchRole).then(res => {
            const roleData = res as roleApiResponse;
            if (roleData?.statusCode === 200) {
                dispatch(setSingleRoleData(roleData))
                if (roleData?.data && roleData.data.length > 0 && roleData.data[0]?.advancePermission) {
                    const updatedJson = {
                        ...ApiReducer?.apiJson,
                        applicationManagement: roleData.data[0].advancePermission.applicationManagement === 'Active' ? 'Active' : 'inActive',
                        userManagement: roleData.data[0].advancePermission.userManagement === 'Active' ? 'Active' : 'inActive',
                        roleManagement: roleData.data[0].advancePermission.roleManagement === 'Active' ? 'Active' : 'inActive'
                    };
                    dispatch(setApiJson(updatedJson));
                }

            }
        })
    }

    const onClickSavePanel = () => {
        var id = RoleManagementReducer?.singleRoleData?.data?.[0]?._id
        var permission = RoleManagementReducer?.singleRoleData?.data?.[0]?.permission
        var json = {
            _id: id,
            permission: permission,
            advancePermission: {
                applicationManagement: ApiReducer?.apiJson?.applicationManagement === 'Active' ? 'Active' : 'inActive',
                userManagement: ApiReducer?.apiJson?.userManagement === 'Active' ? 'Active' : 'inActive',
                roleManagement: ApiReducer?.apiJson?.roleManagement === 'Active' ? 'Active' : 'inActive'
            }
        }
        ApiHit(json, updateRole).then(res => {
            const roleData = res as roleApiResponse;
            if (roleData?.statusCode === 200) {
                toast.success('Role updated successfully')
                dispatch(setSingleRoleData({}))
                dispatch(setRoleSideBar({}))
                dispatch(setBodyData({}))
                dispatch(setActiveScreenIndex(0))
                dispatch(setActiveScreenIndex(0))
                dispatch(setSingleRoleData({}))
            }
        })
    }

    const onClickBack = () => {
        if (setPage) {
            setPage('')
        }
        dispatch(setSingleRoleData({}))
        dispatch(setActiveScreenIndex(0))
        dispatch(setBodyData({}))
        dispatch(setRoleData({}))
        dispatch(setRoleSideBar({}))
    }

    console.log('Apired',ApiReducer);
    

    return (
        <div className="m-10">
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-10">
                    <div onClick={() => onClickBack()} className="flex gap-2 items-center bg-lightGray px-3 rounded-lg hover:text-primary">
                        <i>{leftArrow}</i>
                        <CustomTitle title="Back" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <CustomTitle title="Role Name :" />
                        <CustomTitle title={RoleManagementReducer?.singleRoleData?.data?.[0]?.roleName} />
                    </div>
                    <div className="flex gap-2 items-center">
                        <CustomTitle title="Role Type :" />
                        <CustomTitle title={RoleManagementReducer?.singleRoleData?.data?.[0]?.roleType} />
                        {
                            RoleManagementReducer?.singleRoleData?.data?.[0]?.roleType === clientPanel ?
                                <i className="border rounded-lg p-1">{usersIcon}</i> :
                                <i className="border rounded-lg p-1">{userIcon}</i>
                        }
                    </div>
                </div>
                <div>
                    <CustomButton icon={saveIcon} className={`${!RoleManagementReducer?.singleRoleData?.data?.[0]?.permission && 'bg-lightGray'}`} titleClass={`${!RoleManagementReducer?.singleRoleData?.data?.[0]?.permission && 'text-black'}`} iconClass={`${!RoleManagementReducer?.singleRoleData?.data?.[0]?.permission && 'text-black'}`} onClick={() => RoleManagementReducer?.singleRoleData?.data?.[0]?.permission ? onClickSavePanel() : console.log('dfdf')} title="Save Panel" />
                </div>
            </div>
            <div className="flex gap-4">
                <RoleSidebar />
                <RoleBody />
            </div>
        </div>
    );
};

export default AddRole;
