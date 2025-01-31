
export const Base = 'http://192.168.1.40:8081/'
export const BaseUrl = 'http://192.168.1.40:8080/'

const applicationManagement = 'applicationManagement/'
const userservice = 'userservice/'

export const AddApplicationSideBar = BaseUrl + applicationManagement+ 'addApplicationSidebar'
export const searchApplicationSidebar = BaseUrl + applicationManagement+ 'searchApplicationSidebar'

export const updateApplicationSidebar = BaseUrl + applicationManagement+ 'updateApplicationSidebar'
export const deleteApplicationSidebar = BaseUrl + applicationManagement+ 'deleteApplicationSidebar'

export const addBodyData = BaseUrl + applicationManagement+ 'addBodyData'
export const searchBodyData = BaseUrl + applicationManagement+ 'searchBodyData'
export const deleteBodyData = BaseUrl + applicationManagement+ 'deleteBodyData'
export const updateBodyData = BaseUrl + applicationManagement+ 'updateBodyData'

export const searchRole = Base + userservice+ 'searchRole'
export const addRole = Base + userservice+ 'addRole'
export const updateRole = Base + userservice+ 'updateRole'


// constants

export const tableThClass = 'text-sm font-light p-4'

export const errorInputClass = 'w-full px-3.5 py-2 text-sm h-10 rounded-md border border-red-500'
export const normalInputClass = 'w-full px-3.5 py-2 text-sm h-10 rounded-md border'

export const buttonClass = 'bg-primary p-2 rounded-md w-max px-5 cursor-pointer'

export const ComponentArray = ['Table','Chart','Form','Card',]

export const Active = 'Active'
export const InActive = 'InActive'
export const clientPanel = 'clientPanel'
export const superAdminPanel = 'superAdminPanel'

export const sidebarCompoentnepermissions = {write:false,read:false,delete:false}