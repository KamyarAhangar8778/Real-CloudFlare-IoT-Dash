import { create } from "zustand";
import { IoTStoreState } from "./store/types";
import { createSegmentsSlice } from "./store/slices/createSegmentsSlice";
import { createGroupsSlice } from "./store/slices/createGroupsSlice";
import { createSyncSlice } from "./store/slices/createSyncSlice";
import { createSystemSlice } from "./store/slices/createSystemSlice";
import { createUiSlice } from "./store/slices/createUiSlice";
import { createConfigSlice } from "./store/slices/createConfigSlice";

export const useIoTStore = create<IoTStoreState>((...a) => ({
  ...createSegmentsSlice(...a),
  ...createGroupsSlice(...a),
  ...createSyncSlice(...a),
  ...createSystemSlice(...a),
  ...createUiSlice(...a),
  ...createConfigSlice(...a),
}));
