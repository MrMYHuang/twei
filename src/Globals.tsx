import { isPlatform, IonLabel } from '@ionic/react';

const pwaUrl = process.env.PUBLIC_URL || '';
const bugReportApiUrl = 'https://vh6ud1o56g.execute-api.ap-northeast-1.amazonaws.com/bugReportMailer';

const tweiDb = 'tweiDb';
let log = '';

function logout(dispatch: Function) {
  dispatch({
    type: "SET_KEY_VAL",
    key: 'cardNo',
    val: '',
  });

  dispatch({
    type: "SET_KEY_VAL",
    key: 'cardEncrypt',
    val: '',
  });
}

async function getFileFromIndexedDB(fileName: string) {
  const dbOpenReq = indexedDB.open(tweiDb);

  return new Promise(function (ok, fail) {
    dbOpenReq.onsuccess = async function (ev) {
      const db = dbOpenReq.result;

      try {
        const trans = db.transaction(["store"], 'readwrite');
        let req = trans.objectStore('store').get(fileName);
        req.onsuccess = async function (_ev) {
          const data = req.result;
          if (!data) {
            console.error(`${fileName} loading failed!`);
            console.error(new Error().stack);
            return fail();
          }
          return ok(data);
        };
      } catch (err) {
        console.error(err);
      }
    };
  });
}

async function saveFileToIndexedDB(fileName: string, data: any) {
  const dbOpenReq = indexedDB.open(tweiDb);
  return new Promise<void>((ok, fail) => {
    dbOpenReq.onsuccess = async (ev: Event) => {
      const db = dbOpenReq.result;

      const transWrite = db.transaction(["store"], 'readwrite')
      const reqWrite = transWrite.objectStore('store').put(data, fileName);
      reqWrite.onsuccess = (_ev: any) => ok();
      reqWrite.onerror = (_ev: any) => fail();
    };
  });
}

async function removeFileFromIndexedDB(fileName: string) {
  const dbOpenReq = indexedDB.open(tweiDb);
  return new Promise<void>((ok, fail) => {
    try {
      dbOpenReq.onsuccess = (ev: Event) => {
        const db = dbOpenReq.result;

        const transWrite = db.transaction(["store"], 'readwrite')
        try {
          const reqWrite = transWrite.objectStore('store').delete(fileName);
          reqWrite.onsuccess = (_ev: any) => ok();
          reqWrite.onerror = (_ev: any) => fail();
        } catch (err) {
          console.error(err);
        }
      };
    } catch (err) {
      fail(err);
    }
  });
}

async function clearIndexedDB() {
  const dbOpenReq = indexedDB.open(tweiDb);
  return new Promise<void>((ok, fail) => {
    dbOpenReq.onsuccess = async (ev: Event) => {
      const db = dbOpenReq.result;

      const transWrite = db.transaction(["store"], 'readwrite')
      const reqWrite = transWrite.objectStore('store').clear();
      reqWrite.onsuccess = (_ev: any) => ok();
      reqWrite.onerror = (_ev: any) => fail();
    };
  });
}

async function clearAppData() {
  localStorage.clear();
  await clearIndexedDB();
}

//const electronBackendApi: any = (window as any).electronBackendApi;

const consoleLog = console.log.bind(console);
const consoleError = console.error.bind(console);

function getLog() {
  return log;
}

function enableAppLog() {
  console.log = function () {
    log += '----- Info ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleLog.apply(console, arguments as any);
  };

  console.error = function () {
    log += '----- Error ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleError.apply(console, arguments as any);
  };
}

function disableAppLog() {
  log = '';
  console.log = consoleLog;
  console.error = consoleError;
}

//const webkit = (window as any).webkit;
function copyToClipboard(text: string) {
  try {
    navigator.clipboard && navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
}

function isMacCatalyst() {
  return isPlatform('ios') && navigator.platform === 'MacIntel';
}

const Globals = {
  pwaUrl,
  bugReportApiUrl,
  storeFile: 'tweiSettings.json',
  getLog,
  enableAppLog,
  disableAppLog,
  tweiDb,
  appSettings: {
    'theme': '佈景主題',
    'uiFontSize': 'UI 字型大小',
  } as Record<string, string>,
  fetchErrorContent: (
    <div className='contentCenter'>
      <IonLabel>
        <div>
          <div>連線失敗!</div>
          <div style={{ fontSize: 'var(--ui-font-size)', paddingTop: 24 }}>如果問題持續發生，請執行<a href={`${pwaUrl}/settings`} target="_self">設定頁</a>的 app 異常回報功能。</div>
        </div>
      </IonLabel>
    </div>
  ),
  logout,
  updateApp: () => {
    return new Promise(async resolve => {
      navigator.serviceWorker.getRegistrations().then(async regs => {
        const hasUpdates = await Promise.all(regs.map(reg => (reg.update() as any).then((newReg: ServiceWorkerRegistration) => {
          return newReg.installing !== null || newReg.waiting !== null;
        })));
        resolve(hasUpdates.reduce((prev, curr) => prev || curr, false));
      });
    });
  },
  updateCssVars: (settings: any) => {
    document.documentElement.style.cssText = `--ui-font-size: ${settings.uiFontSize}px;`
  },
  isMacCatalyst,
  isTouchDevice: () => {
    return (isPlatform('ios') && !isMacCatalyst()) || isPlatform('android');
  },
  isStoreApps: () => {
    return isPlatform('pwa') || isPlatform('electron');
  },
  getFileFromIndexedDB,
  saveFileToIndexedDB,
  removeFileFromIndexedDB,
  clearAppData,
  copyToClipboard,
};

export default Globals;
