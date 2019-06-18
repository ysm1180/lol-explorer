import { RiotSeasonLeague } from 'models';
import * as React from 'react';
import { ProfileIcon } from './profile-icon';
import { TierInfo } from './tier-info';

interface IProfileProps {
  iconUrl?: string;
  level?: number;
  name?: string;
  tiers: RiotSeasonLeague[];
}

export class Profile extends React.Component<IProfileProps> {
  public render() {
    const tiers = this.props.tiers;

    const displayTiers = tiers
      .filter((tier) => tier.queueType === 'RANKED_SOLO_5x5' || tier.queueType === 'RANKED_FLEX_SR')
      .sort((a, b) => a.queueType.localeCompare(b.queueType));
    if (displayTiers.length == 1) {
      if (displayTiers[0].queueType === 'RANKED_SOLO_5x5') {
        displayTiers.unshift({
          queueType: 'RANKED_FLEX_SR',
          inactive: false,
          leagueId: '',
          leaguePoints: 0,
          losses: 0,
          rank: '',
          tier: 'UNRANKED',
          wins: 0,
        });
      } else if (displayTiers[0].queueType === 'RANKED_FLEX_SR') {
        displayTiers.push({
          queueType: 'RANKED_SOLO_5x5',
          inactive: false,
          leagueId: '',
          leaguePoints: 0,
          losses: 0,
          rank: '',
          tier: 'UNRANKED',
          wins: 0,
        });
      }
    }

    return (
      <div className='profile'>
        <ProfileIcon iconUrl={this.props.iconUrl} level={this.props.level} />
        <div className='info'>
          <div className='name'>{this.props.name}</div>
          {displayTiers.map((tier) => (
            <TierInfo
              key={tier.queueType}
              type={tier.queueType}
              tier={tier.tier}
              rank={tier.rank}
              point={tier.leaguePoints}
              wins={tier.wins}
              losses={tier.losses}
            />
          ))}
        </div>
      </div>
    );
  }
}
