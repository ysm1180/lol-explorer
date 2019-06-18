import * as React from 'react';
import LcuMain from './containers/lcu-main';

interface IAppProps {}

interface IAppState {
  width: number;
  height: number;
}

export class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    if (window.innerWidth && window.innerHeight) {
      this.state = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    } else if (document.body && document.body.clientWidth && document.body.clientHeight) {
      this.state = {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      };
    }
  }

  public updateDimensions = () => {
    if (window.innerWidth && window.innerHeight) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    } else if (document.body && document.body.clientWidth && document.body.clientHeight) {
      this.setState({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      });
    }
  };

  public componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  public render() {
    return <LcuMain width={this.state.width} height={this.state.height} />;
  }
}
