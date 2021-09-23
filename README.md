# 台灣發票 (Taiwan eInvoice)

## <a id='feature'>特色</a>

列表手機條碼所載的電子發票並支援自動對獎、佈景主題切換、字型調整、跨平台、無廣告、開放原始碼。

## 說明

台灣發票 (Taiwan eInvoice)，簡寫 twei，使用台灣財政部電子發票應用 APIs，支援以下功能

* 電子發票與自動對獎
  1. 列出已上傳至財政部之手機條碼載具電子發票。
  2. 查詢電子發票明細。
  3. 電子發票自動對獎。

* 離線瀏覽
* 佈景主題切換
* 字型調整
  1. 考量視力不佳的使用者，提供最大64 px的字型設定。若有需要更大字型，請 E-mail 或 GitHub 聯絡開發者新增。
* <a id='shortcuts'>App 捷徑</a>
  1. Windows, Android 的 Chrome (建議最新版)使用者，滑鼠右鍵或長按 app 圖示，可存取app功能捷徑，目前有：開獎號碼。

* <a id='report'>App異常回報</a>

  App設定頁的異常回報鈕使用方法為：執行會造成app異常的步驟後，再至設定頁按下異常回報鈕，即會自動產生一封E-mail，包含異常的記錄，發送此E-mail給我們即可。

程式碼為開放(MIT License)，可自由下載修改、重新發佈。

## 支援平台
已在這些環境作過安裝、測試:
* Windows 10 +  Chrome
* Android 9 + Chrome
* macOS 11 + Chrome
* iPad 7 + Safari
* iPhone 8 + Safari
* Debian Linux 10 + Chrome

非上述環境仍可嘗試使用此app。若有<a href='#knownIssues'>已知問題</a>未描述的問題，可用<a href='#report'>異常回報</a>功能。

建議OS與Chrome、Safari保持在最新版，以取得最佳app體驗。

## <a id='install'>安裝</a>

此 app 目前有1種取得、安裝方式：

  1. Chrome、Safari 網頁瀏覽器。

### <a id='web-app'>從瀏覽器開啟/安裝</a>
請用Chrome (Windows, macOS, Linux, Android作業系統使用者)、Safari (iOS (iPhone, iPad)使用者)瀏覽器開啟以下網址：

https://myhpwa.github.io/twei

或：

<a href='https://myhpwa.github.io/twei' target='_blank'>
<img width="auto" height='60px' src='https://user-images.githubusercontent.com/9122190/28998409-c5bf7362-7a00-11e7-9b63-db56694522e7.png'/>
</a>

此 progressive web app (PWA)，可不安裝直接在網頁瀏覽器執行，或安裝至手機、平板、筆電、桌機。建議安裝，以避免瀏覽器定期清除快取，導致 app 設定不見！

#### Windows, macOS, Linux, Android - 使用Chrome安裝
使用Chrome瀏覧器（建議最新版）開啟上述PWA網址後，網址列會出現一個加號，如圖所示：

<img src='https://github.com/MrMYHuang/twei/raw/main/docs/images/ChromeInstall.png' width='50%' />

點擊它，以完成安裝。安裝完後會在桌面出現"台灣發票" app 圖示。

#### iOS - 使用Safari安裝
1. 使用Safari開啟web app網址，再點擊下方中間的"分享"圖示：

<img src='https://github.com/MrMYHuang/twei/raw/main/docs/images/Safari/OpenAppUrl.png' width='50%' />

2. 滑動頁面至下方，點選"加入主畫面"(Add to Home Screen)：

<img src='https://github.com/MrMYHuang/twei/raw/main/docs/images/Safari/AddToHomeScreen.png' width='50%' />

3. App安裝完，出現在主畫面的圖示：

<img src='https://github.com/MrMYHuang/twei/raw/main/docs/images/Safari/AppIcon.png' width='50%' />

## <a id='knownIssues'>已知問題</a>
1. iOS Safari 13.4以上才支援"分享此頁"功能。

## <a id='history'>版本歷史</a>
* 1.2.0:
  * 錯誤回報功能作 E-mail 檢查。
  * 錯誤回報功能支援填寫問題發生步驟。
* 1.1.0:
  * 中獎發票排在最前面。
  * 發票列表顯示金額。
  * 明細顯示合計。
* 1.0.1:
  * 修正錯字。
* 1.0.0：
  * 第一版。

## <a href='https://github.com/MrMYHuang/twei/blob/main/PrivacyPolicy.md'>隱私政策</a>
