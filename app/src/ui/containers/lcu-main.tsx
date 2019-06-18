import { IpcMessageEvent, ipcRenderer } from 'electron';
import { ILCUData, LcuSummonerData } from 'models';
import * as React from 'react';
import { connect } from 'react-redux';
import { CircleSpinner } from 'react-spinners-kit';
import * as Types from 'root-types';
import { ScrollableElement } from '../base/scrollable-element';
import { Profile } from '../components/profile/profile';
import {
  connectLcu,
  initLcuData,
  loadLcuCurrentSummoner,
  loadLcuCurrentSummonerAsync,
} from '../features/lcu/actions';
import {
  loadAllStaticChampionDataAsync,
  loadAllStaticItemDataAsync,
  loadAllStaticSpellDataAsync,
  loadAllStaticPerkDataAsync,
} from '../features/static-data/actions';
import MatchInfo from './match/match-info';

interface ILcuMainProps {
  width: number;
  height: number;
}

interface ILcuMainState {
  isConnect: boolean;
}

const mapStateToProps = (state: Types.RootState) => ({
  isLoadingLcuSummoner: state.lcu.isLoadingLcuSummoner,
  lcuSummonerResponse: state.lcu.currentSummoner,
  isLoadingRiotSummoner: state.riotApi.isLoadingRiotSummoner,
  isLoadingRiotSummonerMatchList: state.riotApi.isLoadingRiotSummonerMatchList,
  riotSummonerResponse: state.riotApi.riotSummoner,
  riotSummonerMatchListResponse: state.riotApi.riotMatchList,

  isLoadingAllChampion: state.staticData.isLoadingAllChampion,
  staticChampionData: state.staticData.champions,
  isLoadingAllSpell: state.staticData.isLoadingAllSpell,
  staticSpellData: state.staticData.spells,
  isLoadingAllItem: state.staticData.isLoadingAllItem,
  staticItemData: state.staticData.items,
  isLoadingAllPerk: state.staticData.isLoadingAllPerk,
  staticPerkData: state.staticData.perks,
});

const dispatchProps = {
  connect: (lcuData: ILCUData) => connectLcu(lcuData),
  disconnect: () => initLcuData(),
  loadCurrnetSummonerAsync: (lcuData: ILCUData) => loadLcuCurrentSummonerAsync.request(lcuData),
  loadCurrnetSummoner: (data: LcuSummonerData) => loadLcuCurrentSummoner(data),
  loadAllChampionData: () => loadAllStaticChampionDataAsync.request(),
  loadAllSpellData: () => loadAllStaticSpellDataAsync.request(),
  loadAllItemData: () => loadAllStaticItemDataAsync.request(),
  loadAllPerkData: () => loadAllStaticPerkDataAsync.request(),
};

type Props = ILcuMainProps & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

class LcuMain extends React.Component<Props, ILcuMainState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isConnect: false,
    };

    this.registerLcuListener();
  }

  public componentDidMount() {
    this.props.loadAllChampionData();
    this.props.loadAllSpellData();
    this.props.loadAllItemData();
    this.props.loadAllPerkData();
  }

  private loadSummoner(lcuData: ILCUData) {
    if (!this.props.isLoadingLcuSummoner && !this.props.lcuSummonerResponse.success) {
      this.props.loadCurrnetSummonerAsync(lcuData);
    }
  }

  private registerLcuListener() {
    ipcRenderer.on('lcu-connect', (event: IpcMessageEvent, lcuData: ILCUData) => {
      this.props.connect(lcuData);
      this.setState({ isConnect: true });

      this.loadSummoner(lcuData);
    });

    ipcRenderer.on('lcu-disconnect', () => {
      this.setState({ isConnect: false });
      this.props.disconnect();
    });

    ipcRenderer.on('lcu-api-message', (event: IpcMessageEvent, data: any) => {
      if (data.uri === '/lol-summoner/v1/current-summoner') {
        this.props.loadCurrnetSummoner(data.data);
      }
    });
  }

  public render() {
    return (
      <div id='app-contents'>
        {this.props.staticChampionData.success &&
        this.props.lcuSummonerResponse.success &&
        this.props.riotSummonerResponse.success ? (
          <ScrollableElement width={this.props.width} height={this.props.height}>
            <Profile
              iconUrl={this.props.riotSummonerResponse.summoner.iconUrl}
              level={this.props.lcuSummonerResponse.summoner.summonerLevel}
              name={this.props.lcuSummonerResponse.summoner.displayName}
              tiers={this.props.riotSummonerResponse.summoner.seasons}
            />
            {this.props.riotSummonerMatchListResponse.success ? (
              <div className='match-list'>
                {this.props.riotSummonerMatchListResponse.matches.map((match, idx) => {
                  return (
                    <MatchInfo
                      key={idx}
                      timestamp={match.timestamp}
                      requestSummonerName={this.props.lcuSummonerResponse.summoner.displayName}
                      gameInfo={match.gameInfo}
                    />
                  );
                })}
              </div>
            ) : (
              <div className='match-list-loading'>
                <div className='match-loading'>
                  <div className='icon'>
                    <CircleSpinner size={15} color='#007ACC' loading={true} />
                  </div>
                  <br />
                  <div className='message'>매치 정보 불러오는 중...</div>
                </div>
              </div>
            )}
          </ScrollableElement>
        ) : this.props.isLoadingAllChampion ||
          this.props.isLoadingAllSpell ||
          this.props.isLoadingAllItem ||
          this.props.isLoadingAllPerk ? (
          <div className='height-full-center'>
            <div className='loading'>
              <div className='icon'>
                <CircleSpinner size={20} color='#353535' loading={true} />
              </div>
              <br />
              <span className='info-message'>필요한 정보 불러오는 중...</span>
            </div>
          </div>
        ) : (
          <div className='height-full-center'>
            {this.state.isConnect ? (
              <div className='loading'>
                <div className='icon'>
                  <CircleSpinner size={20} color='#353535' loading={true} />
                </div>
                <br />
                <span className='info-message'>LOL Client 로그인 대기 중...</span>
              </div>
            ) : (
              <div className='info-message'>LOL Client 로그인을 하시면 자동으로 연결됩니다.</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  dispatchProps
)(LcuMain);
