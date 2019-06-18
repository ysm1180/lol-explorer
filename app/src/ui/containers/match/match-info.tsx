import * as classnames from 'classnames';
import {
  RiotMatchGameInfo,
  RiotMatchParticipantData,
  RiotMatchTeamData,
  RiotStaticChampionClientData,
  RiotStaticSpellClientData,
  RiotStaticPerkClientData,
  RiotStaticItemClientData,
  RiotMatchParticipantIdentity,
} from 'models';
import * as React from 'react';
import { connect } from 'react-redux';
import * as Types from 'root-types';
import { format } from 'util';
import { Tooltip } from '../../base/tooltip';

interface IMatchInfoProps {
  timestamp: number;
  requestSummonerName: string;
  gameInfo: RiotMatchGameInfo;
}

interface IMatchInfoState {
  requesterParticipant?: RiotMatchParticipantData;
  requesterTeam?: RiotMatchTeamData;
  isError: boolean;
}

const mapStateToProps = (state: Types.RootState) => ({
  staticChampionData: state.staticData.champions,
  staticSpellData: state.staticData.spells,
  staticItemData: state.staticData.items,
  staticPerkData: state.staticData.perks,
});

const dispatchProps = {};

type Props = IMatchInfoProps & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const sortByLane = (a: RiotMatchParticipantData, b: RiotMatchParticipantData) => {
  const lanePriority = {
    TOP: 1,
    JUNGLE: 2,
    MIDDLE: 3,
    BOTTOM: 4,
    NONE: 5,
  };
  const rolePriority = {
    SOLO: 1,
    NONE: 2,
    DUO: 3,
    DUO_CARRY: 4,
    DUO_SUPPORT: 5,
  };

  const lanePriorityDelta = lanePriority[a.timeline.lane] - lanePriority[b.timeline.lane];
  if (lanePriorityDelta !== 0) {
    return lanePriorityDelta;
  }

  const rolePriorityDelta = rolePriority[a.timeline.role] - rolePriority[b.timeline.role];
  return rolePriorityDelta;
};

class MatchInfoMainSummary extends React.Component<{
  queue: number;
}> {
  private queueToString() {
    const queueType: { [key: number]: string } = {
      420: '개인/2인 랭크',
      430: '일반',
      440: '자유 랭크 게임',
      450: '무작위 총력전',
    };

    return queueType[this.props.queue];
  }

  public render() {
    return <div className='summary'>{this.queueToString()}</div>;
  }
}

class MatchInfoTitle extends React.Component<{
  isWin: boolean;
  timestamp: number;
  gameDuration: number;
}> {
  private getDateText = (timestamp: number): string => {
    const date = new Date(timestamp);
    const [year, month, day, hour, minute] = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ];

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  private getTimeDeltaTextByNow = (timestamp: number): string => {
    const utcNow = new Date(new Date().toUTCString()).getTime();
    const sinceAfterSeconds = Math.floor((utcNow - timestamp) / 1000);

    let sinceTimeText = '';
    if (sinceAfterSeconds < 60) {
      sinceTimeText = `${sinceAfterSeconds}초 전`;
    } else if (sinceAfterSeconds < 3600) {
      sinceTimeText = `${Math.ceil(sinceAfterSeconds / 60)}분 전`;
    } else if (sinceAfterSeconds < 86400) {
      sinceTimeText = `${Math.ceil(sinceAfterSeconds / 3600)}시간 전`;
    } else {
      sinceTimeText = `${Math.ceil(sinceAfterSeconds / 86400)}일 전`;
    }

    return sinceTimeText;
  };

  public render() {
    const { isWin, timestamp, gameDuration } = this.props;

    const secondStr = format('%d', gameDuration % 60).padStart(2, '0');
    const minuteStr = format('%d', Math.floor(gameDuration / 60)).padStart(2, '0');
    const durationTimeStr = `${minuteStr}분 ${secondStr}초`;

    return (
      <div className='title'>
        {isWin ? <div className='win'>승리</div> : <div className='lose'>패배</div>}
        <div>{durationTimeStr}</div>
        <Tooltip tooltip={this.getDateText(timestamp)} help={true}>
          {this.getTimeDeltaTextByNow(timestamp)}
        </Tooltip>
      </div>
    );
  }
}

class MatchInfoChampionIcon extends React.Component<{
  staticChampionData: RiotStaticChampionClientData[];
  championKey: number;
  championLevel: number;
}> {
  public render() {
    const { staticChampionData, championKey, championLevel } = this.props;
    const champion = staticChampionData.find((champion) => champion.key === championKey);

    return (
      <div className='champion'>
        {champion && (
          <div className='icon'>
            <img src={champion.iconUrl} width={48} height={48} />
            <span className='level'>{championLevel}</span>
          </div>
        )}
      </div>
    );
  }
}

class MatchInfoSpellIcons extends React.Component<{
  spell1Key: number;
  spell2Key: number;
  staticSpellData: RiotStaticSpellClientData[];
}> {
  public render() {
    const { spell1Key, spell2Key, staticSpellData } = this.props;
    const spell1 = staticSpellData.find((spell) => spell.key === spell1Key);
    const spell2 = staticSpellData.find((spell) => spell.key === spell2Key);

    return (
      <div className='spell'>
        {spell1 && (
          <div className='icon'>
            <img src={spell1.iconUrl} />
          </div>
        )}
        {spell2 && (
          <div className='icon'>
            <img src={spell2.iconUrl} />
          </div>
        )}
      </div>
    );
  }
}

class MatchInfoPerkIcons extends React.Component<{
  primaryPerkStyle: number;
  primaryPerk0RuneId: number;
  subPerkStyle: number;
  staticPerkData: RiotStaticPerkClientData[];
}> {
  public render() {
    const { primaryPerkStyle, primaryPerk0RuneId, subPerkStyle, staticPerkData } = this.props;
    const primaryPerk = staticPerkData.find((perk) => perk.id === primaryPerkStyle);
    const subPerk = staticPerkData.find((perk) => perk.id === subPerkStyle);
    let primaryPerkRune;
    if (primaryPerk) {
      primaryPerkRune = primaryPerk.slots[0].runes.find((rune) => rune.id === primaryPerk0RuneId);
    }

    return (
      <div className='perk'>
        {primaryPerk && primaryPerkRune && (
          <div className='icon'>
            <img src={`${primaryPerk.baseIconUrl}${primaryPerkRune.icon}`} />
          </div>
        )}
        {subPerk && (
          <div className='icon'>
            <img src={`${subPerk.baseIconUrl}${subPerk.icon}`} />
          </div>
        )}
      </div>
    );
  }
}

class MatchInfoMainDescription extends React.Component<{
  kill: number;
  death: number;
  assist: number;
}> {
  public render() {
    const { kill, death, assist } = this.props;
    let kda = 'Perfect';
    if (death > 0) {
      kda = `${((kill + assist) / death).toFixed(2)} KDA`;
    }

    return (
      <div className='main-info'>
        <div className='kda'>
          {kill} / <span className='death'>{death}</span> / {assist}
          <div className={classnames('info', { perfect: kda === 'Perfect' })}>{kda}</div>
        </div>
      </div>
    );
  }
}

class MatchInfoSubDescription extends React.Component<{
  totalCS: number;
  kill: number;
  assist: number;
  totalKill: number;
}> {
  public render() {
    const { totalCS, kill, assist, totalKill } = this.props;
    const killPercent = Math.floor(((kill + assist) / totalKill) * 100);

    return (
      <div className='sub-info'>
        <div className='cs'>{totalCS} CS</div>
        <div className='kill-percent'>킬관여 {killPercent}%</div>
      </div>
    );
  }
}

class MatchInfoEquipedItemIcons extends React.Component<{
  itemKeys: number[];
  staticItemData: RiotStaticItemClientData[];
}> {
  public render() {
    const { itemKeys, staticItemData } = this.props;
    const items = itemKeys.map((itemKey) =>
      staticItemData.find((staticItem) => staticItem.key === itemKey)
    );
    const itemElement = items.map((item, idx) => {
      if (item) {
        return <img key={idx} src={item.iconUrl} />;
      } else {
        return <div key={idx} className='empty' />;
      }
    });

    return (
      <div className='items'>
        <div className='container'>
          <div className='lines'>
            <div className='line'>{itemElement.slice(0, 3)}</div>
            <div className='line'>{itemElement.slice(3, 6)}</div>
          </div>
          <div className='lines'>{itemElement[6]}</div>
        </div>
      </div>
    );
  }
}

class MatchInfoParticipants extends React.Component<{
  requesterParticipantId: number;
  participants: RiotMatchParticipantData[];
  participantIdentities: RiotMatchParticipantIdentity[];
  staticChampionData: RiotStaticChampionClientData[];
}> {
  private getFilterTeam = (teamId: number) => {
    const participantNames = this.props.participantIdentities
      .sort((a, b) => a.participantId - b.participantId)
      .map((id) => id.player.summonerName);

    return this.props.participants
      .filter((participant) => participant.teamId === teamId)
      .sort(sortByLane)
      .map((participant) => {
        return {
          id: participant.participantId,
          championKey: participant.championId,
          name: participantNames[participant.participantId - 1],
        };
      });
  };

  public render() {
    const { requesterParticipantId, staticChampionData } = this.props;

    const blues = this.getFilterTeam(100);
    const purples = this.getFilterTeam(200);

    return (
      <div className='participants'>
        <div className='blue'>
          {blues.map((summoner) => {
            const championKey = summoner.championKey;
            const champion = staticChampionData.find((champion) => champion.key === championKey);

            if (champion) {
              return (
                <div key={summoner.id} className='icon'>
                  <img src={champion.iconUrl} />
                  <span
                    className={classnames('name', {
                      requester: requesterParticipantId === summoner.id,
                    })}
                  >
                    {summoner.name}
                  </span>
                </div>
              );
            } else {
              return '';
            }
          })}
        </div>
        <div className='purple'>
          {purples.map((purple) => {
            const championKey = purple.championKey;
            const champion = staticChampionData.find((champion) => champion.key === championKey);

            if (champion) {
              return (
                <div key={purple.id} className='icon'>
                  <img src={champion.iconUrl} />
                  <span
                    className={classnames('name', {
                      requester: requesterParticipantId === purple.id,
                    })}
                  >
                    {purple.name}
                  </span>
                </div>
              );
            } else {
              return '';
            }
          })}
        </div>
      </div>
    );
  }
}

class MatchInfo extends React.Component<Props, IMatchInfoState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      requesterParticipant: undefined,
      requesterTeam: undefined,
      isError: false,
    };
  }
  public componentDidMount() {
    const { gameInfo, requestSummonerName } = this.props;

    const requester = gameInfo.participantIdentities.find(
      (participant) => participant.player.summonerName === requestSummonerName
    );

    if (!requester) {
      this.setState({
        isError: true,
      });
      return;
    }

    const participant = gameInfo.participants.find(
      (participant) => participant.participantId === requester.participantId
    );
    if (!participant) {
      this.setState({
        isError: true,
      });
      return;
    }
    const team = gameInfo.teams.find((team) => team.teamId === participant.teamId);
    if (!team) {
      this.setState({
        isError: true,
      });
      return;
    }

    this.setState({
      requesterParticipant: participant,
      requesterTeam: team,
    });
  }

  public render() {
    if (this.state.isError) {
      return <div>정보를 불러오는 데에 문제가 생겼습니다.</div>;
    }

    const requester = this.state.requesterParticipant;
    let totalKill = 1;
    if (requester) {
      totalKill = this.props.gameInfo.participants
        .filter((participant) => participant.teamId === requester.teamId)
        .reduce((prev, cur) => prev + cur.stats.kills, 0);
    }

    return (
      <div className='match'>
        {requester && (
          <div className='game-info'>
            <MatchInfoMainSummary queue={this.props.gameInfo.queueId} />
            <div className='requester'>
              <MatchInfoTitle
                isWin={requester.stats.win}
                timestamp={this.props.timestamp}
                gameDuration={this.props.gameInfo.gameDuration}
              />
              <MatchInfoPerkIcons
                primaryPerkStyle={requester.stats.perkPrimaryStyle}
                primaryPerk0RuneId={requester.stats.perk0}
                subPerkStyle={requester.stats.perkSubStyle}
                staticPerkData={this.props.staticPerkData.data}
              />
              <MatchInfoChampionIcon
                championKey={requester.championId}
                championLevel={requester.stats.champLevel}
                staticChampionData={this.props.staticChampionData.data}
              />
              <MatchInfoSpellIcons
                spell1Key={requester.spell1Id}
                spell2Key={requester.spell2Id}
                staticSpellData={this.props.staticSpellData.data}
              />
              <MatchInfoMainDescription
                kill={requester.stats.kills}
                death={requester.stats.deaths}
                assist={requester.stats.assists}
              />
              <MatchInfoSubDescription
                totalCS={requester.stats.totalMinionsKilled + requester.stats.neutralMinionsKilled}
                kill={requester.stats.kills}
                assist={requester.stats.assists}
                totalKill={totalKill}
              />
              <MatchInfoEquipedItemIcons
                itemKeys={requester.stats.items}
                staticItemData={this.props.staticItemData.data}
              />
            </div>
          </div>
        )}
        {requester && (
          <MatchInfoParticipants
            requesterParticipantId={requester.participantId}
            participants={this.props.gameInfo.participants}
            participantIdentities={this.props.gameInfo.participantIdentities}
            staticChampionData={this.props.staticChampionData.data}
          />
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  dispatchProps
)(MatchInfo);
