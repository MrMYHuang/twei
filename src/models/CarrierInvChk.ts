const sample = {
    "v": "0.5",
    "code": 200,
    "msg": "執行成功",
    "onlyWinningInv": "N",
    "details": [
        {
            "rowNum": 1,
            "invNum": "QE12345678",
            "cardType": "3J0002",
            "cardNo": "/0TOIJ2R",
            "sellerName": "公司",
            "invStatus": "已確認",
            "invDonatable": true,
            "amount": "49",
            "invPeriod": "11008",
            "donateMark": 0,
            "invDate": {
                "year": 100,
                "month": 3,
                "date": 1,
                "day": 4,
                "hours": 0,
                "minutes": 0,
                "seconds": 0,
                "time": 1918088800000,
                "timezoneOffset": -480
            },
            "sellerBan": "12345678",
            "sellerAddress": "台北市中山區",
            "invoiceTime": "01:12:34",
            "buyerBan": "",
            "currency": ""
        },
    ]
};
export type CarrierInvChkDetail = typeof sample.details[0];
export type CarrierInvChkDetails = typeof sample.details;
export type CarrierInvChk = typeof sample;

export enum WinningStatus {
    Super,
    Special,
    First,
    Second,
    Third,
    Forth,
    Fifth,
    Sixth,
    SixthEx,
    NoAward,
    NotYet,
}

export interface CarrierInvChkDetailExt extends CarrierInvChkDetail {
    winningStatus: WinningStatus;
}

export function winningStatusToString(status: WinningStatus) {
    switch (status) {
        case WinningStatus.Super:
            return '1,000萬';
        case WinningStatus.Special:
            return '200萬';
        case WinningStatus.First:
            return '20萬';
        case WinningStatus.Second:
            return '4萬';
        case WinningStatus.Third:
            return '1萬';
        case WinningStatus.Forth:
            return '4千';
        case WinningStatus.Fifth:
            return '1千';
        case WinningStatus.Sixth:
            return '2百';
        case WinningStatus.SixthEx:
            return '2百';
        case WinningStatus.NoAward:
            return '未中獎';
        default:
            return '未開獎';
    }
}