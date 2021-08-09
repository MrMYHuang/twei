import { CarrierInvChk } from "./CarrierInvChk";
import { QryWinningList } from "./QryWinningList";

export class TmpSettings {
    fetchError: boolean = false;
    isLoadingData: boolean = false;
    qryWinningList: QryWinningList | undefined;
    carrierInvChk: CarrierInvChk | undefined;
    shareTextModal = { text: '', show: false };
}
