import * as React from 'react';

interface IProfileIconProps {
  iconUrl?: string;
  level?: number;
}

export class ProfileIcon extends React.Component<IProfileIconProps> {
  public render() {
    return (
      <div className='icon'>
        {this.props.iconUrl ? <img src={this.props.iconUrl} /> : ''}
        {this.props.iconUrl ? <span className='level'>{this.props.level}</span> : ''}
      </div>
    );
  }
}
