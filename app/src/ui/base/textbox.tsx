import * as classNames from 'classnames';
import * as React from 'react';

interface ITextBoxProps {
  readonly className?: string;

  readonly value?: string;

  readonly placeholder?: string;

  readonly disabled?: boolean;

  readonly onValueChanged?: (value: string) => void;
}

interface ITextBoxState {
  value?: string;
}

export class TextBox extends React.Component<ITextBoxProps, ITextBoxState> {
  private inputElement: HTMLInputElement | null = null;

  public componentWillReceiveProps(nextProps: ITextBoxProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  private onInputRef = (element: HTMLInputElement | null) => {
    this.inputElement = element;
  };

  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    this.setState({ value }, () => {
      if (this.props.onValueChanged) {
        this.props.onValueChanged(value);
      }
    });
  };

  public selectAll() {
    if (this.inputElement !== null) {
      this.inputElement.select();
    }
  }

  public render() {
    const className = classNames('text-box', this.props.className);
    return (
      <div className={className}>
        <input
          ref={this.onInputRef}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
