// src/features/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the permissions interface
export interface permissions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

// Define the structure of BodyDataItem
export interface BodyDataItem {
  componentName: string;
  status: string;
  hits: string;
  permissions: permissions;
  usedById: string;
  _id:string
}

export interface sidebarItem {
  screenName: string;
  status: string;
  type: string;
  _id:string;
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

export interface BodyDataApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: BodyDataItem[]; // data field contains an array of sidebarItem
  total?: number;
  page?: number;
  limit?: number;
}

// Define the structure of PanelDataItem
export interface PanelDataItem {
  screenName: string;
  status: string;
  bodyData: BodyDataItem[];
}

// Define the structure of the overall panel types
export interface PanelTypes {
  clientPanel: PanelDataItem[];
  superAdminPanel: PanelDataItem[];
}

// Define the Redux state structure
interface FullRedux {
  bodyModal: boolean;
  sidebarModal: boolean;
  type: string;
  activeScreenIndex: number;
  panelData: PanelTypes;
  sidebarData:SideBarApiResponse;
  bodyData:BodyDataApiResponse;
}

// Initial state with proper typing
const initialState: FullRedux = {
  bodyModal: false,
  sidebarModal: false,
  activeScreenIndex: 0,
  type: '',
  panelData: {
    clientPanel: [],
    superAdminPanel: [],
  },
  sidebarData:{},
  bodyData:{}
};

// Redux slice definition
const ApplicationManagement = createSlice({
  name: 'ApplicationManagement',
  initialState,
  reducers: {
    setSidebarData: (state, action: PayloadAction<SideBarApiResponse>) => {
      state.sidebarData = action.payload;
    },
    setBodyData: (state, action: PayloadAction<BodyDataApiResponse>) => {
      state.bodyData = action.payload;
    },
    // Updates the panelData state
    setPanelData: (state, action: PayloadAction<PanelTypes>) => {
      state.panelData = action.payload;
    },
    setApplicationManagementType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    // Toggles the sidebar modal visibility
    setSidebarModal: (state, action: PayloadAction<boolean>) => {
      state.sidebarModal = action.payload;
    },
    // Toggles the body modal visibility
    setBodyModal: (state, action: PayloadAction<boolean>) => {
      state.bodyModal = action.payload;
    },
    // Sets the active screen index
    setActiveScreenIndex: (state, action: PayloadAction<number>) => {
      state.activeScreenIndex = action.payload;
    },
    // Updates the panel type (e.g., 'clientPanel', 'superAdminPanel')
    setPanelType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setBodyModal,
  setSidebarModal,
  setActiveScreenIndex,
  setPanelData,
  setPanelType,
  setApplicationManagementType,
  setSidebarData,
  setBodyData,
} = ApplicationManagement.actions;

export default ApplicationManagement.reducer;
