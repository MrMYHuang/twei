import axios from 'axios';
import qs from 'qs';
import { CarrierInvChk, CarrierInvChkDetail } from './models/CarrierInvChk';
import { CarrierInvDetail } from './models/CarrierInvDetail';
import { QryWinningList } from './models/QryWinningList';

const eInvUrl = 'https://q6zto4yhdh.execute-api.ap-northeast-1.amazonaws.com';

const axiosInstance = axios.create({
    baseURL: eInvUrl,
    timeout: 10000,
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    }
});

async function qryWinningList(lookupDate: string) {
    const date = new Date(lookupDate);
    const month = date.getMonth() + 1;
    const invTerm = +`${(date.getFullYear() - 1911)}${((month % 2) === 0 ? month : month + 1).toString().padStart(2, '0')}`;
    try {
        const res = await axiosInstance.post(`${eInvUrl}/invapp/InvApp`, qs.stringify({
            version: 0.2,
            action: 'QryWinningList',
            invTerm: invTerm,
            UUID: '593ee92f-2543-404d-9f24-88f7771cc94a',
        }));
        return res.data as QryWinningList;
    } catch (error) {
        throw (error);
    }
}

function carrierInvChkDetailDate(detail: CarrierInvChkDetail) {
    return new Date(`${detail.invDate.year + 1911}/${detail.invDate.month}/${detail.invDate.date} ${detail.invoiceTime}`);
}

function findMonthStartDateEndDate(date: string) {
    const d = new Date(date);
    const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return {
        startDate: `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/01`,
        endDate: `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getDate().toString().padStart(2, '0')}`,
    }
}

async function carrierInvChk(cardNo: string, cardEncrypt: string, lookupDate: string, isLogin: boolean = false) {
    try {
        const endPoint = isLogin ? '/twei/login' : '/invServ/InvServ';
        const now = Math.ceil((new Date()).valueOf() / 1000);
        const dates = findMonthStartDateEndDate(lookupDate);
        const res = await axiosInstance.post(`${eInvUrl}${endPoint}`, qs.stringify({
            version: 0.5,
            cardType: '3J0002',
            cardNo: cardNo,
            action: 'carrierInvChk',
            startDate: dates.startDate,
            endDate: dates.endDate,
            onlyWinningInv: 'N',
            uuid: '593ee92f-2543-404d-9f24-88f7771cc94a',
            timeStamp: now + 95,
            expTimeStamp: now + 95 * 3,
            cardEncrypt: cardEncrypt,
        }));
        if (isLogin) {
            throw (new Error('LOGIN SUCCESS'));
        }

        let data = res.data as CarrierInvChk;
        
        if (+data.code !== 200) {
          throw (new Error(`${data.code}: ${data.msg}`));
        }

        data.details = data.details.sort((a, b) => +carrierInvChkDetailDate(a) - +carrierInvChkDetailDate(b));
        return data;
    } catch (error) {
        throw (error);
    }
}

async function carrierInvDetail(cardNo: string, cardEncrypt: string, invNum: string, invDate: string) {
    try {
        const now = Math.ceil((new Date()).valueOf() / 1000);
        const res = await axiosInstance.post(`${eInvUrl}/invServ/InvServ`, qs.stringify({
            version: 0.5,
            cardType: '3J0002',
            cardNo: cardNo,
            action: 'carrierInvDetail',
            invNum: invNum,
            invDate: invDate,
            uuid: '593ee92f-2543-404d-9f24-88f7771cc94a',
            timeStamp: now + 95,
            expTimeStamp: now + 95 * 3,
            cardEncrypt: cardEncrypt,
        }));
        const data = res.data as CarrierInvDetail;
        return data;
    } catch (error) {
        throw (error);
    }
}

const Apis = {
    qryWinningList,
    carrierInvChk,
    carrierInvDetail,
};

export default Apis;