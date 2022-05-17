import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, withIonLifeCycle, IonButton, IonList, IonItem, IonLabel, IonLoading, IonToast, IonTitle, IonInfiniteScroll, IonInfiniteScrollContent, IonAlert, IonInput, IonDatetime } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import './EInvoiceListPage.css';
import Apis from '../Apis';
import { CarrierInvChkDetailExt, WinningStatus, winningStatusToString } from '../models/CarrierInvChk';
import Globals from '../Globals';

interface Props {
  dispatch: Function;
  tmpSettings: TmpSettings;
  settings: Settings;
}

interface PageProps extends Props, RouteComponentProps<{
  path: string;
  tab: string;
}> { }

interface State {
  dataParts: CarrierInvChkDetailExt[];
  dateSel: string,
  popover: any;
  isScrollOn: boolean;
  fetchError: boolean;
  showToast: boolean;
  toastMessage: string;
  showConfrimSaveFormAlert: boolean;
  cardNo: string;
  cardEncrypt: string;
}

class _EInvoiceListPage extends React.Component<PageProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataParts: [],
      dateSel: new Date().toString(),
      popover: {
        show: false,
        event: null,
      },
      isScrollOn: false,
      fetchError: false,
      showConfrimSaveFormAlert: false,
      showToast: false,
      toastMessage: '',
      cardNo: '',
      cardEncrypt: '',
    }
  }

  async ionViewWillEnter() {
    //console.log(`${this.props.match.url} will enter`);

    if (this.props.settings.cardEncrypt !== '') {
      this.fetchDataAndShow();
    }
  }

  /*
  componentDidMount() {
    //console.log(`did mount: ${this.props.match.url}`);
  }
  
  componentWillUnmount() {
    console.log(`${this.props.match.url} unmount`);
  }

  ionViewWillLeave() {
  }
  */

  async fetchDataAndShow() {
    this.setIsLoading(true);
    await this.fetchData();
    await this.showDataPageByPage(true);
    this.setIsLoading(false);
  }

  async fetchData() {
    const res2 = await Apis.qryWinningList(this.state.dateSel);
    if (+res2.code === 200) {
      this.props.dispatch({
        type: "TMP_SET_KEY_VAL",
        key: 'qryWinningList',
        val: res2,
      });
    } else {
      if (+res2.code === 901) {
        this.props.dispatch({
          type: "TMP_SET_KEY_VAL",
          key: 'qryWinningList',
          val: undefined,
        });
      } else {
        throw (new Error(`${res2.code}: ${res2.msg}`));
      }
    }

    try {
      const res = await Apis.carrierInvChk(this.props.settings.cardNo, this.props.settings.cardEncrypt, this.state.dateSel);
      let details = res.details as CarrierInvChkDetailExt[];
      details.forEach((v, i) => {
        details[i].winningStatus = this.calculateInvoiceWinningStatus(v.invNum);
      })
      this.props.dispatch({
        type: "TMP_SET_KEY_VAL",
        key: 'carrierInvChkDetailsExt',
        val: details.sort((a, b) => a.winningStatus - b.winningStatus),
      });
    } catch (error) {
      this.props.dispatch({
        type: "TMP_SET_KEY_VAL",
        key: 'carrierInvChkDetailsExt',
        val: undefined,
      });
    }
  }

  setIsLoading(value: boolean) {
    this.props.dispatch({
      type: "TMP_SET_KEY_VAL",
      key: 'isLoadingData',
      val: value,
    });
  }

  page = 0;
  rows = 20;
  async showDataPageByPage(fromStart: boolean = false) {
    if (fromStart) {
      this.page = 0;
    }

    //console.log(`Loading page ${this.page}`);

    const data = this.props.tmpSettings.carrierInvChkDetailsExt;
    const dataParts = data.slice(this.page * this.rows, (this.page + 1) * this.rows);

    this.page += 1;
    this.setState({
      fetchError: false, dataParts: fromStart ? dataParts : [...this.state.dataParts, ...dataParts],
      isScrollOn: dataParts.length === this.rows,
    });

    return true;
  }

  calculateInvoiceWinningStatus(invNum: string) {
    invNum = invNum.substring(2);
    const winningList = this.props.tmpSettings.qryWinningList;
    if (winningList == null) {
      return WinningStatus.NotYet;
    }

    const firstPrizeNos = [
      winningList.firstPrizeNo1, winningList.firstPrizeNo2, winningList.firstPrizeNo3,
      winningList.firstPrizeNo4, winningList.firstPrizeNo5, winningList.firstPrizeNo6,
      winningList.firstPrizeNo7, winningList.firstPrizeNo8, winningList.firstPrizeNo9,
      winningList.firstPrizeNo10,
    ];
    const sixthPrizeNos = [
      winningList.sixthPrizeNo1, winningList.sixthPrizeNo2, winningList.sixthPrizeNo3,
      winningList.sixthPrizeNo4, winningList.sixthPrizeNo5, winningList.sixthPrizeNo6,
    ];
    if (invNum === winningList.superPrizeNo) {
      return WinningStatus.Super;
    } else if ([winningList.spcPrizeNo, winningList.spcPrizeNo2, winningList.spcPrizeNo3].some(no => invNum === no)) {
      return WinningStatus.Special;
    } else if (firstPrizeNos.some(no => invNum === no)) {
      return WinningStatus.First;
    } else if (firstPrizeNos.some(no => invNum.substring(1) === no.substring(1))) {
      return WinningStatus.Second;
    } else if (firstPrizeNos.some(no => invNum.substring(2) === no.substring(2))) {
      return WinningStatus.Third;
    } else if (firstPrizeNos.some(no => invNum.substring(3) === no.substring(3))) {
      return WinningStatus.Forth;
    } else if (firstPrizeNos.some(no => invNum.substring(4) === no.substring(4))) {
      return WinningStatus.Fifth;
    } else if (firstPrizeNos.some(no => invNum.substring(5) === no.substring(5))) {
      return WinningStatus.Sixth;
    } else if (sixthPrizeNos.some(no => invNum.substring(5) === no)) {
      return WinningStatus.SixthEx;
    } else {
      return WinningStatus.NoAward;
    }
  }

  getRows() {
    let rows = Array<object>();
    this.state.dataParts.forEach((item: CarrierInvChkDetailExt, index: number) => {
      const row = <IonItem button={true} key={`item` + item.invNum}
        onClick={async event => {
          const invDate = `${item.invDate.year + 1911}-${item.invDate.month.toString().padStart(2, '0')}-${item.invDate.date.toString().padStart(2, '0')}`;
          this.props.history.push(`${Globals.pwaUrl}/eInvoice/${item.invNum}/${invDate}`);
        }}>
        <div tabIndex={0}></div>{/* Workaround for macOS Safari 14 bug. */}
        <div className='winningStatus'>
          <IonLabel className='ion-text-wrap uiFont' key={`winLabel_` + index}>
            {winningStatusToString(item.winningStatus)}
          </IonLabel>
        </div>
        <div className='listItem'>
          <div>
            <IonLabel className='ion-text-wrap uiFont' key={`invDataLabel_` + index}>
              {item.invDate.month.toString().padStart(2, '0')}/{item.invDate.date.toString().padStart(2, '0')} &nbsp;
              {item.invNum} &nbsp;
              {item.amount}元
            </IonLabel>
          </div>
          <div>
            <IonLabel className='ion-text-wrap uiFont' key={`sellerLabel_` + index}>
              {item.sellerName}
            </IonLabel>
          </div>
        </div>
      </IonItem>;
      rows.push(row);
    });
    return rows;
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className='uiFont'>發票</IonTitle>
            <IonDatetime slot='end' className='uiFont'
              displayFormat='YYYY年MM月'
              display-timezone='Asia/Taipei'
              doneText='確定'
              cancelText='取消'
              value={this.state.dateSel}
              onIonChange={async e => {
                this.setState({ dateSel: e.detail.value || '' });
                await this.fetchDataAndShow();
              }} >
            </IonDatetime>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ textAlign: 'center' }}>
          {
            this.props.tmpSettings.isLoadingData ?
              <IonLoading
                cssClass='uiFont'
                isOpen={this.props.tmpSettings.isLoadingData}
                message={'載入中...'}
              />
              :
              this.props.settings.cardEncrypt === '' ?
                <>
                  <div className='LoginBlock'>
                    <IonLabel className='uiFont'>手機條碼</IonLabel>
                    <IonInput className='uiFont IonInput' value={this.state.cardNo} placeholder='/ABC+123' onIonChange={(e) => {
                      this.setState({ cardNo: e.detail.value || '' });
                    }}></IonInput>
                  </div>

                  <div className='LoginBlock'>
                    <IonLabel className='uiFont'>驗證碼</IonLabel>
                    <IonInput className='uiFont IonInput' type='password' value={this.state.cardEncrypt} onIonChange={(e) => {
                      this.setState({ cardEncrypt: e.detail.value || '' });
                    }}></IonInput>

                    <IonButton fill='outline' shape='round' size='large' className='uiFont' onClick={e => {
                      this.setState({ showConfrimSaveFormAlert: true });
                    }}>登入</IonButton>
                  </div>
                </>
                :
                <>
                  <IonList>
                    {this.getRows()}
                    <IonInfiniteScroll threshold="100px"
                      disabled={!this.state.isScrollOn}
                      onIonInfinite={(ev: CustomEvent<void>) => {
                        this.showDataPageByPage();
                        (ev.target as HTMLIonInfiniteScrollElement).complete();
                      }} >
                      <IonInfiniteScrollContent
                        loadingText="載入中...">
                      </IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                  </IonList>
                  <IonLabel>中獎資訊僅供參考。若有錯誤恕不負責。</IonLabel>
                </>
          }

          <IonAlert
            cssClass='uiFont'
            isOpen={this.state.showConfrimSaveFormAlert}
            backdropDismiss={false}
            header={'警告！請勿在公用電腦登入此 app，因為登入後驗證碼將以明碼存至此裝置，會有外洩的問題。請在個人裝置使用此 app 或至設定頁登出。'}
            buttons={[
              {
                text: '取消',
                cssClass: 'secondary uiFont',
                handler: (value) => {
                  this.setState({
                    showConfrimSaveFormAlert: false,
                  });
                },
              },

              {
                text: '登入',
                cssClass: 'primary uiFont',
                handler: async (value) => {
                  this.setState({
                    showConfrimSaveFormAlert: false,
                  });

                  this.props.dispatch({
                    type: "SET_KEY_VAL",
                    key: 'cardNo',
                    val: this.state.cardNo,
                  });

                  this.props.dispatch({
                    type: "SET_KEY_VAL",
                    key: 'cardEncrypt',
                    val: this.state.cardEncrypt,
                  });

                  try {
                    this.setIsLoading(true);
                    await Apis.carrierInvChk(this.props.settings.cardNo, this.props.settings.cardEncrypt, this.state.dateSel, true);
                  } catch (error: any) {
                    this.setIsLoading(false);
                    if (error.message === 'LOGIN SUCCESS') {
                      this.setState({ toastMessage: '登入成功！', showToast: true });
                      await this.fetchDataAndShow();
                    } else {
                      Globals.logout(this.props.dispatch);
                      this.setState({ toastMessage: '登入失敗，請檢察手機條碼與驗證碼！', showToast: true });
                    }
                  }
                },
              },
            ]}
          />

          <IonToast
            cssClass='uiFont'
            isOpen={this.state.showToast}
            onDidDismiss={() => this.setState({ showToast: false })}
            message={this.state.toastMessage}
            duration={2000}
          />
        </IonContent>
      </IonPage>
    );
  }
};

const EInvoiceListPage = withIonLifeCycle(_EInvoiceListPage);

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: state.tmpSettings,
    settings: state.settings,
  }
};

// const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(EInvoiceListPage);
