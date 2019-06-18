import * as React from 'react';
import { HorizontalScrollbar, VerticalScrollbar, SCROLLBAR_DEFAULT_SIZE } from './scrollbar';

interface IScrollableInnerProps {
  onResize: (width: number, height: number) => void;
}

interface IScrollableInnerState {
  width: number;
  height: number;
}

class ScrollableInnerElement extends React.Component<IScrollableInnerProps, IScrollableInnerState> {
  private childRef = React.createRef<HTMLDivElement>();

  constructor(props: IScrollableInnerProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };
  }

  private onResize = () => {
    if (this.childRef.current) {
      const width = this.childRef.current.offsetWidth;
      const height = this.childRef.current.offsetTop + this.childRef.current.offsetHeight;

      this.setState({
        width: width,
        height: height,
      });

      this.props.onResize(width, height);
    }
  };

  public componentDidMount() {
    this.onResize();
  }

  public componentDidUpdate(prevProps: IScrollableInnerProps, prevState: IScrollableInnerState) {
    if (this.childRef.current) {
      const width = this.childRef.current.offsetWidth;
      const height = this.childRef.current.offsetTop + this.childRef.current.offsetHeight;
      if (prevState.width !== width || prevState.height !== height) {
        this.onResize();
      }
    }
  }

  public render() {
    return (
      <div className='inner' ref={this.childRef}>
        {this.props.children}
      </div>
    );
  }
}

interface IScrollableProps {
  width: number;
  height: number;
}

interface IScrollableState {
  horizontalScrollPosition: number;
  verticalScrollPosition: number;

  innerWidth?: number;
  innerHeight?: number;
}
export class ScrollableElement extends React.Component<IScrollableProps, IScrollableState> {
  constructor(props: IScrollableProps) {
    super(props);

    this.state = {
      horizontalScrollPosition: 0,
      verticalScrollPosition: 0,
    };
  }

  private setVerticalScrollPosition = (position: number, opponentScrollSize: number) => {
    let currentVerticalScrollPosition = position;
    if (currentVerticalScrollPosition > 0) {
      currentVerticalScrollPosition = 0;
    }
    if (currentVerticalScrollPosition + this.state.innerHeight! < this.props.height) {
      currentVerticalScrollPosition = this.props.height - this.state.innerHeight!;
    }

    this.setState({
      verticalScrollPosition: currentVerticalScrollPosition,
    });
  };

  private setHorizontalScrollPosition = (position: number, opponentScrollSize: number) => {
    let currentHorizontalScrollPosition = position;
    if (currentHorizontalScrollPosition > 0) {
      currentHorizontalScrollPosition = 0;
    }
    if (currentHorizontalScrollPosition + this.state.innerWidth! < this.props.width) {
      currentHorizontalScrollPosition = this.props.width - this.state.innerWidth!;
    }

    this.setState({
      horizontalScrollPosition: currentHorizontalScrollPosition,
    });
  };

  public onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaX || e.deltaY) {
      let deltaX = e.deltaX;
      let deltaY = e.deltaY;

      if (e.shiftKey) {
        deltaX = deltaY;
        deltaY = 0;
      }

      if (this.state.innerWidth && this.props.width < this.state.innerWidth) {
        this.setHorizontalScrollPosition(
          this.state.horizontalScrollPosition - deltaX,
          SCROLLBAR_DEFAULT_SIZE
        );
      }
      if (this.state.innerHeight && this.props.height < this.state.innerHeight) {
        this.setVerticalScrollPosition(this.state.verticalScrollPosition - deltaY, 0);
      }
    }
  };

  public onResize = (width: number, height: number) => {
    this.setState({
      innerWidth: width,
      innerHeight: height,
    });
  };

  public render() {
    return (
      <div
        className='scrollable'
        onWheel={this.onWheel}
        style={{
          width: this.props.width,
          height: this.props.height,
        }}
      >
        <div
          className='overflow-container'
          style={{
            top: this.state.verticalScrollPosition,
            left: this.state.horizontalScrollPosition,
          }}
        >
          <ScrollableInnerElement onResize={this.onResize}>
            {this.props.children}
          </ScrollableInnerElement>
        </div>
        {this.state.innerWidth ? (
          <HorizontalScrollbar
            scrollSize={this.state.innerWidth}
            visibleSize={this.props.width}
            position={-this.state.horizontalScrollPosition}
            opponentScrollSize={SCROLLBAR_DEFAULT_SIZE}
            setPosition={this.setHorizontalScrollPosition}
          />
        ) : (
          ''
        )}
        {this.state.innerHeight ? (
          <VerticalScrollbar
            scrollSize={this.state.innerHeight}
            visibleSize={this.props.height}
            position={-this.state.verticalScrollPosition}
            setPosition={this.setVerticalScrollPosition}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}
