import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonToast, IonLoading, IonLabel, IonDatetime, IonPopover, IonText, IonButtons } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { format, parseISO } from 'date-fns';

import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';

import { arrowBack } from 'ionicons/icons';
import Apis from '../Apis';
import './WinningListPage.css';

interface Props {
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  dateSel: string;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
}> { }

class _WinningListPage extends React.Component<PageProps, State> {
  ionDateTime: React.RefObject<HTMLIonDatetimeElement>;
  maxDate: Date;
  constructor(props: PageProps) {
    super(props);

    this.ionDateTime = React.createRef<HTMLIonDatetimeElement>();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    this.maxDate = new Date(
      year,
      (month % 2) === 0 ? month - 3 : month - 2,
      1);

    this.state = {
      dateSel: this.maxDate.toISOString(),
      showToast: false,
      toastMessage: '',
    };
  }

  ionViewWillEnter() {
    this.fetchData();
  }

  async fetchData() {
    this.setIsLoading(true);
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
    this.setIsLoading(false);
  }

  setIsLoading(value: boolean) {
    this.props.dispatch({
      type: "TMP_SET_KEY_VAL",
      key: 'isLoadingData',
      val: value,
    });
  }

  render() {
    const qwl = this.props.tmpSettings.qryWinningList!;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
              <IonIcon icon={arrowBack} slot='icon-only' />
            </IonButton>

            <IonTitle className='uiFont'>開獎號碼</IonTitle>

            <IonButton id="win-open-date-input" slot='end'>
              <IonText className='uiFont'>{format(parseISO(this.state.dateSel), 'yyyy年MM月')}</IonText>
              <IonPopover trigger="win-open-date-input" showBackdrop={false}>
                <IonDatetime
                  ref={this.ionDateTime}
                  value={this.state.dateSel}
                  locale='zh'
                  presentation="month-year"
                  monthValues='1, 3, 5, 7, 9, 11'
                  display-timezone='Asia/Taipei'
                  onIonChange={async ev => {
                    //setPopoverDate(formatDate(ev.detail.value!));
                    this.setState({ dateSel: ev.detail.value || '' }, () => {
                      this.fetchData();
                    });
                  }}
                >
                  <IonButtons slot="buttons">
                    <IonButton className='uiFont' onClick={() => {
                      this.ionDateTime.current?.confirm(true);
                    }}>確定</IonButton>
                    <IonButton className='uiFont' onClick={() => {
                      this.ionDateTime.current?.cancel(true);
                    }}>取消</IonButton>
                  </IonButtons>
                </IonDatetime>
              </IonPopover>
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ textAlign: 'center' }}>

          {
            this.props.tmpSettings.isLoadingData || qwl == null ?
              <IonLoading
                cssClass='uiFont'
                isOpen={this.props.tmpSettings.isLoadingData}
                message={'載入中...'}
              />
              :
              <div className='table'>
                <div className='row'>
                  <IonLabel className='cell1'>特別獎</IonLabel>
                  <div className='cell2'>
                    <span className='uiFontX1_5 cellSpan'>{qwl.superPrizeNo}</span>
                    <span className='uiFontX0_7'>8位數號碼與上列號碼相同者獎金1,000萬元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>特獎</div>
                  <div className='cell2'>
                    {
                      [qwl.spcPrizeNo, qwl.spcPrizeNo2, qwl.spcPrizeNo3].filter(v => v !== '').map(v =>
                        <span className='uiFontX1_5 cellSpan'>{v}</span>
                      )
                    }
                    <span className='uiFontX0_7'>8位數號碼與上列號碼相同者獎金200萬元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>頭獎</div>
                  <div className='cell2'>
                    {
                      [
                        qwl.firstPrizeNo1, qwl.firstPrizeNo2, qwl.firstPrizeNo3,
                        qwl.firstPrizeNo4, qwl.firstPrizeNo5, qwl.firstPrizeNo6,
                        qwl.firstPrizeNo7, qwl.firstPrizeNo8, qwl.firstPrizeNo9,
                        qwl.firstPrizeNo10,
                      ].filter(v => v !== '').sort((a, b) => +a - +b).map(v =>
                        <span className='uiFontX1_5 cellSpan'>{v}</span>
                      )
                    }
                    <span className='uiFontX0_7'>8位數號碼與上列號碼相同者獎金20萬元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>二獎</div>
                  <div className='cell2'>
                    <span className='uiFontX0_7'>末7碼與頭獎相同者各得獎金4萬元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>三獎</div>
                  <div className='cell2'>
                    <span className='uiFontX0_7'>末6碼與頭獎相同者各得獎金1萬元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>四獎</div>
                  <div className='cell2'>
                    <span className='uiFontX0_7'>末5碼與頭獎相同者各得獎金4千元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>五獎</div>
                  <div className='cell2'>
                    <span className='uiFontX0_7'>末4碼與頭獎相同者各得獎金1千元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>六獎</div>
                  <div className='cell2'>
                    <span className='uiFontX0_7'>末3碼與頭獎相同者各得獎金2百元</span>
                  </div>
                </div>

                <div className='row'>
                  <div className='cell1'>增開六獎</div>
                  <div className='cell2'>
                    {
                      [
                        qwl.sixthPrizeNo1, qwl.sixthPrizeNo2, qwl.sixthPrizeNo3,
                        qwl.sixthPrizeNo4, qwl.sixthPrizeNo5, qwl.sixthPrizeNo6,
                      ].filter(v => v !== '').map(v =>
                        <span className='uiFontX1_5 cellSpan'>{v}</span>
                      )
                    }
                    <span className='uiFontX0_7'>末3碼與增開六獎相同者各得獎金2百元</span>
                  </div>
                </div>

              </div>
          }

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
}

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: state.tmpSettings,
    settings: state.settings
  }
};

//const mapDispatchToProps = {};

const WinningListPage = withIonLifeCycle(_WinningListPage);

export default connect(
  mapStateToProps,
)(WinningListPage);
