import * as classnames from 'classnames';
import * as React from 'react';

export const SCROLLBAR_DEFAULT_SIZE = 15;

interface IScrollbarProps {
  opponentScrollSize?: number;

  scrollSize: number;
  visibleSize: number;
  position: number;

  setPosition: (position: number, opponentScrollbarSize: number) => void;
}

interface IScrollbarState {
  isSliderClick: boolean;
}

abstract class Scrollbar extends React.Component<IScrollbarProps, IScrollbarState> {
  private sliderRatio = 0;
  private sliderPosition = 0;

  protected abstract getScrollbarRect(
    largeSize: number,
    smallSize: number
  ): { width: number; height: number };
  protected abstract getSliderDimension(size: number): { width: number; height: number };
  protected abstract getSliderPosition(position: number): { top: number; left: number };
  protected abstract getType(): string;
  protected abstract getSliderMousePosition(e: MouseEvent): number;

  constructor(props: IScrollbarProps) {
    super(props);

    this.state = {
      isSliderClick: false,
    };
  }

  private onSliderMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      isSliderClick: true,
    });

    const opponentScrollbarSize = this.props.opponentScrollSize ? this.props.opponentScrollSize : 0;
    const startMousePosition = this.getSliderMousePosition(e.nativeEvent);
    const startSliderPosition = this.sliderPosition;

    const mouseMoveEvent = (e: MouseEvent) => {
      if (this.state.isSliderClick) {
        const mousePosition = this.getSliderMousePosition(e);
        const mouseDelta = mousePosition - startMousePosition;
        this.props.setPosition(
          -Math.round((startSliderPosition + mouseDelta) / this.sliderRatio),
          opponentScrollbarSize
        );
      }
    };

    const mouseUpOnceEvent = () => {
      this.setState({
        isSliderClick: false,
      });

      window.removeEventListener('mousemove', mouseMoveEvent);
      window.removeEventListener('mouseup', mouseUpOnceEvent);
    };

    window.addEventListener('mousemove', mouseMoveEvent);
    window.addEventListener('mouseup', mouseUpOnceEvent);
  };

  public render() {
    const { position, scrollSize, visibleSize } = this.props;

    let scrollVisible = false;
    if (scrollSize > visibleSize) {
      scrollVisible = true;
    }

    const opponentScrollbarSize = this.props.opponentScrollSize ? this.props.opponentScrollSize : 0;
    const scrollbarSmallSize = scrollVisible ? SCROLLBAR_DEFAULT_SIZE : 0;
    const scrollbarRect = this.getScrollbarRect(
      visibleSize - opponentScrollbarSize,
      scrollbarSmallSize
    );

    const availableSize = visibleSize - opponentScrollbarSize;
    const sliderSize = Math.floor((visibleSize * availableSize) / scrollSize);
    this.sliderRatio = (availableSize - sliderSize) / (scrollSize - visibleSize);
    this.sliderPosition = Math.round(position * this.sliderRatio);

    const sliderPosition = this.getSliderPosition(this.sliderPosition);
    const sliderDimension = this.getSliderDimension(sliderSize);

    return (
      <div
        className={classnames('scrollbar', this.getType())}
        style={{
          width: scrollbarRect.width,
          height: scrollbarRect.height,
        }}
      >
        <div
          className={classnames('slider', { click: this.state.isSliderClick })}
          style={{
            width: sliderDimension.width,
            height: sliderDimension.height,
            top: sliderPosition.top,
            left: sliderPosition.left,
          }}
          onMouseDown={this.onSliderMouseDown}
        />
      </div>
    );
  }
}

export class VerticalScrollbar extends Scrollbar {
  protected getType() {
    return 'vertical';
  }

  protected getSliderMousePosition(e: MouseEvent) {
    return e.pageY;
  }

  protected getSliderDimension(size: number) {
    return {
      width: SCROLLBAR_DEFAULT_SIZE,
      height: size,
    };
  }

  protected getSliderPosition(position: number) {
    return {
      top: position,
      left: 0,
    };
  }

  protected getScrollbarRect(largeSize: number, smallSize: number) {
    return {
      width: smallSize,
      height: largeSize,
    };
  }
}

export class HorizontalScrollbar extends Scrollbar {
  protected getType() {
    return 'horizontal';
  }

  protected getSliderMousePosition(e: MouseEvent) {
    return e.pageX;
  }

  protected getSliderDimension(size: number) {
    return {
      width: size,
      height: SCROLLBAR_DEFAULT_SIZE,
    };
  }

  protected getSliderPosition(position: number) {
    return {
      top: 0,
      left: position,
    };
  }

  protected getScrollbarRect(largeSize: number, smallSize: number) {
    return {
      width: largeSize,
      height: smallSize,
    };
  }
}
