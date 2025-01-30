import React, { useEffect, useState } from "react";
import CustomButton from "../../components/ui/forms/CustomButton";
import CustomInput from "../../components/ui/forms/CustomInput";
import CustomModal from "../../components/ui/modal/modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { plusIcon, userIcon, usersIcon } from "../../components/icons/icons";
import { setApiJsonError } from "../../features/apireducer";
import CustomSelect from "../../components/ui/forms/CustomSelect";
import { AddApplicationSideBar, addBodyData, clientPanel, ComponentArray, searchApplicationSidebar, sidebarCompoentnepermissions, superAdminPanel } from "../../constants/constants";
import ApplicationManagementSideBar from "./applicationmanagementsidebar";
import ApplicationManagementBody from "./applicationmanagementbody";
import { BodyDataApiResponse, BodyDataItem, PanelDataItem, PanelTypes, setActiveScreenIndex, setApplicationManagementType, setBodyData, setBodyModal, setPanelData, setSidebarData, setSidebarModal, SideBarApiResponse, sidebarItem } from "../../features/applicationmanagement";
import { ApiHit } from "../../constants/Apihit";
import toast from "react-hot-toast";

const ApplicationManagement = () => {

    const ApiReducer = useSelector((state: RootState) => state.ApiReducer);
    const ApplicationManagementReducer = useSelector((state: RootState) => state.ApplicationManagementReducer);
    const dispatch = useDispatch()

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (ApplicationManagementReducer?.sidebarData?.data?.length === 0) {
            // fetchSideBarData()
            console.log('call --- ');

        }
    }, [])

    const fetchSideBarData = () => {
        var json = {
            page: 1,
            limit: 10,
        }
        ApiHit(json, searchApplicationSidebar)
            .then((result) => {
                // Extract data from the response
                const sidebarItems = result as SideBarApiResponse; // Type assertion for 'data'
                dispatch(setSidebarData(sidebarItems)); // Dispatch the sidebarItems
            })
            .catch((error) => {
                console.error("API hit failed", error); // Handle errors
            });
    }

    const onAddSidebarMenu = () => {
        if (!ApiReducer?.apiJson?.screenName) {
            dispatch(setApiJsonError({ screenName: "Name is required" }))
        } else {
            var json = {
                screenName: ApiReducer?.apiJson?.screenName + "",
                status: "Active",
                type: ApplicationManagementReducer?.type + "",
            }
            setLoader(true)
            ApiHit(json, AddApplicationSideBar).then(result => {
                if (result) {
                    setLoader(false)
                    dispatch(setApiJsonError({}))
                    dispatch(setSidebarModal(false))
                    dispatch(setSidebarData({}))
                    toast.success('Sidebar added successfully')
                }
            })
        }
    }

    const onAddBodyComponents = () => {
        if (!ApiReducer?.apiJson?.componentName) {
            dispatch(setApiJsonError({ componentName: "Name is required" }))
        } else {
            dispatch(setApiJsonError({}))
            dispatch(setBodyModal(false))
            setLoader(true)
            var json = {
                componentName: ApiReducer?.apiJson?.componentName + "",
                status: "Active",
                hits: "20",
                permissions: sidebarCompoentnepermissions,
                usedById: ApplicationManagementReducer?.sidebarData?.data?.[ApplicationManagementReducer?.activeScreenIndex - 1]?._id
            }
            ApiHit(json, addBodyData).then(result => {
                if (result?.statusCode === 201) {
                    dispatch(setBodyData({}))
                    setLoader(false)
                    toast.success('Component added successfully')
                }
            })
        }
    }

    console.log(ApiReducer);

    const onChangeType = (type:string) =>{
        dispatch(setApplicationManagementType(type))
        dispatch(setSidebarData({}))
        dispatch(setActiveScreenIndex(0))
        dispatch(setBodyData({}))
    }

    return (
        <div className="m-10">
            <div className="flex gap-2">
                <div onClick={() => onChangeType(superAdminPanel)} className={`cursor-pointer p-4 rounded-lg ${ApplicationManagementReducer.type === superAdminPanel ? 'bg-primary text-white' : 'border'}`}>
                    <center>
                        <i>{userIcon}</i>
                        <p className="text-[10px]">Super Admin</p>
                    </center>
                </div>
                <div onClick={() => onChangeType(clientPanel)} className={`cursor-pointer p-4 rounded-lg ${ApplicationManagementReducer.type === clientPanel ? 'bg-primary text-white' : 'border'}`}>
                    <center>
                        <i>{usersIcon}</i>
                        <p className="text-[10px]">Client admin</p>
                    </center>
                </div>
            </div>
            <div className="flex mt-2">
                {/* Sidebar */}
                <ApplicationManagementSideBar />

                {/* Body */}
                <ApplicationManagementBody />

                {/* Add Sidebar Menu Modal */}
                {
                    ApplicationManagementReducer?.sidebarModal &&
                    <CustomModal onClickClose={() => dispatch(setSidebarModal(false))} ModalTitle={'Add Sidebar Menu'}>
                        <CustomInput title="Name" placeholder="Enter name" type="string" name='screenName' />
                        <div className="mt-5">
                            <CustomButton type={loader ? 'loader' : 'false'} icon={plusIcon} title="Add" onClick={() => onAddSidebarMenu()} />
                        </div>
                    </CustomModal>
                }

                {/* Add Body Data Modal */}
                {
                    ApplicationManagementReducer?.bodyModal &&
                    <CustomModal onClickClose={() => dispatch(setBodyModal(false))} ModalTitle={'Add Component'}>
                        <CustomSelect title="Name" options={ComponentArray} name='componentName' />
                        <div className="mt-5">
                            <CustomButton icon={plusIcon} title="Add" onClick={() => onAddBodyComponents()} />
                        </div>
                    </CustomModal>
                }
            </div>
        </div>
    );
};

export default ApplicationManagement;
