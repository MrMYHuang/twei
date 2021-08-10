import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonList, IonItem, IonIcon, IonToast, IonLoading, IonLabel, IonListHeader } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';

import { arrowBack } from 'ionicons/icons';
import { CarrierInvDetail } from '../models/CarrierInvDetail';
import Apis from '../Apis';

interface Props {
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  carrierInvDetail: CarrierInvDetail | undefined;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  invNum: string;
  invDate: string;
}> { }

class _DetailPage extends React.Component<PageProps, State> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      carrierInvDetail: undefined,
      showToast: false,
      toastMessage: '',
    };

    this.fetchData();
  }

  async ionViewWillEnter() {
  }

  async fetchData() {
    this.setIsLoading(true);
    const carrierInvDetail = await Apis.carrierInvDetail(
      this.props.settings.cardNo,
      this.props.settings.cardEncrypt,
      this.props.match.params.invNum,
      this.props.match.params.invDate.replaceAll('-', '/'),
    );
    this.setState({ carrierInvDetail: carrierInvDetail });
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
    const cid = this.state.carrierInvDetail;
    return (
      this.props.tmpSettings.isLoadingData ?
        <IonLoading
          cssClass='uiFont'
          isOpen={this.props.tmpSettings.isLoadingData}
          message={'載入中...'}
        />
        :
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButton fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
                <IonIcon icon={arrowBack} slot='icon-only' />
              </IonButton>

              <IonTitle className='uiFont'>發票明細</IonTitle>

            </IonToolbar>
          </IonHeader>
          <IonContent style={{ textAlign: 'center' }}>

            <div className='ion-text-wrap uiFontX1_5' style={{ textAlign: 'left' }}>{cid?.sellerName}</div>

            <div>
              <IonLabel className='ion-text-wrap uiFontX1_5' style={{ color: 'red' }}>{cid?.invNum}</IonLabel>
            </div>

            <IonItem>
              <IonLabel className='ion-text-wrap uiFontX0_7'>{cid?.invDate}&nbsp;{cid?.invoiceTime}</IonLabel>
              <IonLabel className='ion-text-wrap uiFontX0_7' style={{ textAlign: 'right' }}>{this.props.settings.cardNo}</IonLabel>
            </IonItem>

            {
              <IonList>
                <IonListHeader lines='full' color='primary'>
                  <IonLabel className='uiFont'>交易明細</IonLabel>
                </IonListHeader>

                <IonItem>
                  <IonLabel className='ion-text-wrap uiFont'>營業人統編：{cid?.sellerBan}</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel className='ion-text-wrap uiFont'>門市地址：{cid?.sellerAddress}</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel slot='start' className='ion-text-wrap uiFont' style={{ fontWeight: 'bold' }}>品名(數量)</IonLabel>
                  <IonLabel slot='end' className='ion-text-wrap uiFont' style={{ textAlign: 'right', fontWeight: 'bold' }}>小計</IonLabel>
                </IonItem>
                {
                  cid?.details.map((v, i) =>
                    <IonItem key={`item${i}`}>
                      <IonLabel slot='start' className='ion-text-wrap uiFont'>{v.description}({v.quantity})</IonLabel>
                      <IonLabel slot='end' className='ion-text-wrap uiFont' style={{ textAlign: 'right' }}>{v.amount}</IonLabel>
                    </IonItem>
                  )
                }
                <IonItem>
                  <IonLabel slot='end' className='ion-text-wrap uiFont' style={{ textAlign: 'right' }}>
                    合計：{cid?.amount}元
                  </IonLabel>
                </IonItem>
              </IonList>
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

const DetailPage = withIonLifeCycle(_DetailPage);

export default connect(
  mapStateToProps,
)(DetailPage);
