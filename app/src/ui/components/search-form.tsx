import axios, { AxiosError } from 'axios';
import * as React from 'react';
import { toFileUrl } from '../../lib/path';
import { TextBox } from '../base/textbox';

const SearchImageUri = toFileUrl(__dirname, 'assets/search.svg');
interface ISearchFormProps {
  url: string;

  method: string;

  placeholder?: string;

  value?: string;

  onSuccessSearch?: (data: any) => void;

  onFailedSearch?: (err: AxiosError) => void;
}

interface ISearchFormState {
  searchValue: string;
}

export class SearchForm extends React.Component<ISearchFormProps, ISearchFormState> {
  public componentDidMount() {}

  public componentWillReceiveProps(nextProps: ISearchFormProps) {
    if (this.state.searchValue !== nextProps.value) {
      this.setState({ searchValue: nextProps.value ? nextProps.value : '' });
    }
  }

  private onSearchValueChanged = (searchValue: string) => {
    this.setState({ searchValue });
  };

  private onSearch = () => {
    axios({
      url: `${this.props.url}/${escape(this.state.searchValue)}`,
      method: this.props.method,
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (this.props.onSuccessSearch) {
          this.props.onSuccessSearch(res.data);
        }
      })
      .catch((err: AxiosError) => {
        if (this.props.onFailedSearch) {
          this.props.onFailedSearch(err);
        }
      });
  };

  public render() {
    return (
      <div className="search-form">
        <TextBox
          className="search-form__input"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onValueChanged={this.onSearchValueChanged}
        />
        <button onClick={this.onSearch} className="search-form__button">
          <img src={SearchImageUri} width="16" />
        </button>
      </div>
    );
  }
}
