import * as React from 'react';
import { toFileUrl } from '../../../lib/path';

interface ITierInfoProps {
  type: string;
  tier: string;
  rank: string;
  point: number;
  wins: number;
  losses: number;
}

const IronImageUri = toFileUrl(__dirname, 'assets/emblems/iron.png');
const BronzeImageUri = toFileUrl(__dirname, 'assets/emblems/bronze.png');
const SilverImageUri = toFileUrl(__dirname, 'assets/emblems/silver.png');
const GoldImageUri = toFileUrl(__dirname, 'assets/emblems/gold.png');
const PlatinumImageUri = toFileUrl(__dirname, 'assets/emblems/platinum.png');
const DiamondImageUri = toFileUrl(__dirname, 'assets/emblems/diamond.png');
const MasterImageUri = toFileUrl(__dirname, 'assets/emblems/master.png');
const GrandMasterImageUri = toFileUrl(__dirname, 'assets/emblems/grandmaster.png');
const ChallengerImageUri = toFileUrl(__dirname, 'assets/emblems/challenger.png');

export class TierInfo extends React.Component<ITierInfoProps> {
  public render() {
    let imageUrl = '';
    let tierName = '';
    let rank = 0;
    let type = '';
    let unrank = false;

    if (this.props.type === 'RANKED_FLEX_SR') {
      type = '자유랭';
    } else if (this.props.type === 'RANKED_SOLO_5x5') {
      type = '솔랭';
    }

    if (this.props.tier === 'IRON') {
      imageUrl = IronImageUri;
      tierName = '아이언';
    } else if (this.props.tier === 'BRONZE') {
      imageUrl = BronzeImageUri;
      tierName = '브론즈';
    } else if (this.props.tier === 'SILVER') {
      imageUrl = SilverImageUri;
      tierName = '실버';
    } else if (this.props.tier === 'GOLD') {
      imageUrl = GoldImageUri;
      tierName = '골드';
    } else if (this.props.tier === 'PLATINUM') {
      imageUrl = PlatinumImageUri;
      tierName = '플래티넘';
    } else if (this.props.tier === 'DIAMOND') {
      imageUrl = DiamondImageUri;
      tierName = '다이아몬드';
    } else if (this.props.tier === 'MASTER') {
      imageUrl = MasterImageUri;
      tierName = '마스터';
    } else if (this.props.tier === 'GRANDMASTER') {
      imageUrl = GrandMasterImageUri;
      tierName = '그랜드 마스터';
    } else if (this.props.tier === 'CHALLENGER') {
      imageUrl = ChallengerImageUri;
      tierName = '챌린저';
    } else if (this.props.tier === 'UNRANKED') {
      unrank = true;
    }

    if (this.props.rank === 'I') {
      rank = 1;
    } else if (this.props.rank === 'II') {
      rank = 2;
    } else if (this.props.rank === 'III') {
      rank = 3;
    } else if (this.props.rank === 'IV') {
      rank = 4;
    } else if (this.props.rank === 'V') {
      rank = 5;
    }

    return (
      <div className='tier'>
        {!unrank ? (
          <div>
            <div className='emblems'>
              <img src={imageUrl} />
            </div>
            <div className='info'>
              <div className='type'>{type}</div>
              <div className='rank'>
                {tierName} {rank}
              </div>
              <div className='rank-point'>{this.props.point} LP</div>
              <div className='win-rate'>
                승률 {Math.floor((this.props.wins / (this.props.wins + this.props.losses)) * 100)}%
                ({this.props.wins}승/{this.props.losses}패)
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className='info'>
              <div className='type'>{type}</div>
              <br />
              <div className='rank'>Unranked</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
