// src/features/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface permissions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface bodyDataArr {
  bodyDataId?: BodyDataItem;
  bodyDataPermission?: permissions;
}

export interface roleComponentPermission {
  bodyData: bodyDataArr[];
  applicationSidebarDataId?: sidebarItem;
  status?: string;
}

export interface advancePermission {
  "applicationManagement": string,
  "userManagement": string,
  "roleManagement": string,
}

export interface roleDataArr {
  roleName?: string,
  roleType?: string,
  status?: string,
  updatedAt?: string,
  permission?: roleComponentPermission[],
  advancePermission?: advancePermission,
  _id?: string
}

export interface roleApiResponse {
  limit?: number,
  page?: number,
  totalPages?: number,
  statusCode?: number,
  data?: roleDataArr[]
}

export interface roleDataItem {
  limit?: number,
  page?: number,
  totalPages?: number,
  statusCode?: number,
  data?: roleDataArr
}

export interface BodyDataItem {
  componentName?: string;
  status?: string;
  hits?: string;
  permission?: permissions;
  usedById?: sidebarItem;
  _id?: string
}

export interface BodyDataApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: BodyDataItem[]; // data field contains an array of sidebarItem
  total?: number;
  page?: number;
  limit?: number;
}

export interface sidebarItem {
  screenName: string;
  status: string;
  type: string;
  _id: string;
}

export interface SideBarApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: sidebarItem[]; // data field contains an array of sidebarItem
  total?: number;
  page?: number;
  limit?: number;
}

// Define the Redux state structure
export interface FullRedux {
  doc: roleApiResponse;
  sidebarData: SideBarApiResponse,
  singleRoleData: roleApiResponse,
  activeScreenIndex: number,
  bodyData: BodyDataApiResponse;
  activeScreenName: string;
}

// Initial state with proper typing
const initialState: FullRedux = {
  doc: {},
  singleRoleData: {},
  sidebarData: {},
  activeScreenIndex: 0,
  activeScreenName: '',
  bodyData: {},
};

// Redux slice definition
const RoleSlice = createSlice({
  name: 'RoleSlice',
  initialState,
  reducers: {
    setRoleData: (state, action: PayloadAction<roleApiResponse>) => {
      state.doc = action.payload;
    },
    setSingleRoleData: (state, action: PayloadAction<roleApiResponse>) => {
      state.singleRoleData = action.payload;
    },
    setRoleSideBar: (state, action: PayloadAction<any>) => {
      state.sidebarData = action.payload;
    },
    setActiveScreenIndex: (state, action: PayloadAction<number>) => {
      state.activeScreenIndex = action.payload;
    },
    setBodyData: (state, action: PayloadAction<BodyDataApiResponse>) => {
      state.bodyData = action.payload;
    },
    setActiveScreenName: (state, action: PayloadAction<string>) => {
      state.activeScreenName = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setRoleData,
  setSingleRoleData,
  setRoleSideBar,
  setActiveScreenIndex,
  setBodyData,
  setActiveScreenName
} = RoleSlice.actions;

export default RoleSlice.reducer;
