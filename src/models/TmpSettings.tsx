import { CarrierInvChkDetailExt } from "./CarrierInvChk";
import { QryWinningList } from "./QryWinningList";

export class TmpSettings {
    fetchError: boolean = false;
    isLoadingData: boolean = false;
    qryWinningList: QryWinningList | undefined;
    carrierInvChkDetailsExt: CarrierInvChkDetailExt[] = [];
    shareTextModal = { text: '', show: false };
}
