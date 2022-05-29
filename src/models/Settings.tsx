export interface Settings {
    version: number;
    hasAppLog: boolean;
    theme: number;
    uiFontSize: number;
    cardNo: string;
    cardEncrypt: string;
}

export const defaultSettings = {
    version: 1,
    hasAppLog: true,
    theme: 2,
    uiFontSize: 24,
    cardNo: '',
    cardEncrypt: '',
} as Settings;
