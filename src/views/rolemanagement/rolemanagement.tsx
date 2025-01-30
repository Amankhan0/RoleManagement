import React, { useEffect, useState } from "react";
import CustomTitle from "../../components/ui/title/CustomTitle";
import CustomButton from "../../components/ui/forms/CustomButton";
import CustomTable from "../../components/ui/table/CustomTable";
import { addRole, clientPanel, InActive, searchRole, superAdminPanel, tableThClass } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { ApiHit } from "../../constants/Apihit";
import CustomModal from "../../components/ui/modal/modal";
import CustomInput from "../../components/ui/forms/CustomInput";
import { plusIcon, userIcon, usersIcon } from "../../components/icons/icons";
import { setApiJson, setApiJsonError } from "../../features/apireducer";
import toast from "react-hot-toast";
import { setRoleData } from "../../features/rolemanagementreducer";
import { ObjIsEmpty } from "../../utils/utils";
import { NavLink } from "react-router-dom";

const RoleManagement = () => {

    const RoleManagementReducer = useSelector((state: RootState) => state.RoleManagementReducer);
    const ApiReducer = useSelector((state: RootState) => state.ApiReducer);
    const PaginationReducer = useSelector((state: RootState) => state.PaginationReducer);
    const dispatch = useDispatch()

    const [modal, setModal] = useState(false)
    var th = ['#', 'Name', 'Age', 'Staus', 'Action']

    useEffect(() => {
        if (ObjIsEmpty(RoleManagementReducer?.doc)) {
            fetchData()
        }
    }, [RoleManagementReducer, PaginationReducer])

    const fetchData = () => {
        var json = {
            page: PaginationReducer?.pagination?.page,
            limit: PaginationReducer?.pagination?.limit,
            search: {

            }
        }
        ApiHit(json, searchRole).then((result) => {
            if (result?.statusCode === 200) {
                dispatch(setRoleData(result))
            }
        })
    }

    let td
    td = RoleManagementReducer?.doc?.data?.map((ele, index) => {
        return (
            <tr>
                <th className={tableThClass}>{index + 1}</th>
                <th className={tableThClass}>{ele.roleName}</th>
                <th className={tableThClass}>{ele.roleType}</th>
                <th className={tableThClass}>{ele.status}</th>
                <th className={tableThClass}>{<NavLink to={'/addrole/'+ele?._id}>Give Permission</NavLink>}</th>
            </tr>
        )
    })

    const onChangeType = (type: string) => {
        const updatedJson = {
            ...ApiReducer?.apiJson,
            roleType: type,
        };
        dispatch(setApiJson(updatedJson))
    }

    const onAddRole = () => {
        dispatch(setApiJsonError({}))
        if (ApiReducer?.apiJson?.roleType === '' || !ApiReducer?.apiJson?.roleType) {
            dispatch(setApiJsonError({ roleType: "Role type is required" }))
        }
        else if (ApiReducer?.apiJson?.roleName === '' || !ApiReducer?.apiJson?.roleName) {
            dispatch(setApiJsonError({ roleName: "Role name is required" }))
        }
        else {
            var json = {
                roleName: ApiReducer?.apiJson?.roleName,
                roleType: ApiReducer?.apiJson?.roleType,
                status: InActive
            }
            ApiHit(json, addRole).then(res => {
                if (res?.statusCode === 201) {
                    toast.success('Role added successfully')
                    dispatch(setApiJsonError({}))
                    dispatch(setApiJson({}))
                    setModal(false)
                    dispatch(setRoleData({}))
                }
            })
        }
    }

    const setDataNull = () => {
        dispatch(setRoleData({}))
    }

    return (
        <div className="m-10">
            <div className="w-full bg-lightGray p-4 rounded-lg flex justify-between items-center">
                <CustomTitle title="Role Management" />
                <CustomButton onClick={() => setModal(true)} title="Add New Role" />
            </div>
            <div className="mt-10">
                <CustomTable setDataNull={setDataNull} th={th} td={td} totalPages={RoleManagementReducer?.doc?.totalPages} />
            </div>
            {
                modal &&
                <CustomModal onClickClose={() => setModal(false)} ModalTitle={'Add Role'}>
                    <div>
                        <CustomTitle title="Role Type" className="text-sm mb-1.5 font-medium" />
                        <div className="flex gap-2">
                            <div onClick={() => onChangeType(superAdminPanel)} className={`cursor-pointer p-4 rounded-lg ${ApiReducer?.apiJson?.roleType === superAdminPanel ? 'bg-primary text-white' : 'border'}`}>
                                <center>
                                    <i>{userIcon}</i>
                                    <p className="text-[10px]">Super Admin</p>
                                </center>
                            </div>
                            <div onClick={() => onChangeType(clientPanel)} className={`cursor-pointer p-4 rounded-lg ${ApiReducer?.apiJson?.roleType === clientPanel ? 'bg-primary text-white' : 'border'}`}>
                                <center>
                                    <i>{usersIcon}</i>
                                    <p className="text-[10px]">Client admin</p>
                                </center>
                            </div>
                        </div>
                        <div className={'text-red text-[13px] mt-1 mb-5'}>{ApiReducer?.apiJsonError?.roleType}</div>
                    </div>
                    <CustomInput placeholder="Enter role name" type="string" title="Name" name='roleName' />
                    <div className="mt-5">
                        <CustomButton icon={plusIcon} title="Add" onClick={() => onAddRole()} />
                    </div>
                </CustomModal>
            }

        </div>
    );
};

export default RoleManagement;
