import { CarrierInvChkDetailExt } from "./CarrierInvChk";
import { QryWinningList } from "./QryWinningList";

export interface ShareTextModal {
    text: string;
    show: boolean;
}

export interface TmpSettings {
    fetchError: boolean;
    isLoadingData: boolean;
    qryWinningList: QryWinningList | undefined;
    carrierInvChkDetailsExt: CarrierInvChkDetailExt[];
    shareTextModal: ShareTextModal;
}

export const defaultTmpSettings = {
    fetchError: false,
    isLoadingData: false,
    qryWinningList: undefined,
    carrierInvChkDetailsExt: [],
    shareTextModal: { text: '', show: false },
} as TmpSettings;
