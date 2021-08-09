const sample = {
    "v": "0.5",
    "code": 200,
    "msg": "執行成功",
    "invNum": "QG12345678",
    "invDate": "20210102",
    "sellerName": "公司",
    "amount": "50",
    "invStatus": "已確認",
    "invPeriod": "11001",
    "details": [
        {
            "rowNum": "1",
            "description": "紐奧良風味鮮蔬烤雞三明治",
            "quantity": "1",
            "unitPrice": "50",
            "amount": "50"
        }
    ],
    "sellerBan": "12345678",
    "sellerAddress": "台北市中山區",
    "invoiceTime": "01:23:45",
    "currency": ""
};
export type CarrierInvDetailProduct = typeof sample.details[0];
export type CarrierInvDetailProducts = typeof sample.details;
export type CarrierInvDetail = typeof sample;
