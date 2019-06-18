import * as classnames from 'classnames';
import * as React from 'react';

interface ITooltipProps {
  tooltip: string;

  afterRevealMs?: number;
  help?: boolean;
  className?: string;
}

interface ITooltipState {
  isTooltipHide: boolean;
}

export class Tooltip extends React.Component<ITooltipProps, ITooltipState> {
  constructor(props: ITooltipProps) {
    super(props);

    this.state = {
      isTooltipHide: true,
    };
  }

  public onMouseEnter = () => {
    const { afterRevealMs } = this.props;
    setTimeout(
      () => {
        this.setState({ isTooltipHide: false });
      },
      afterRevealMs ? afterRevealMs : 0
    );
  };

  public onMouseLeave = () => {
    this.setState({ isTooltipHide: true });
  };

  public render() {
    return (
      <div className='tooltip'>
        <div
          className={classnames('tooltip-text', {
            hide: this.state.isTooltipHide,
          })}
        >
          {this.props.tooltip}
        </div>
        <div
          className={classnames('text', {
            help: this.props.help,
          })}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
