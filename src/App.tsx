import React, { Component } from 'react';
import axios from 'axios';
import { url } from './constants';
interface Details {
  Doping: string;
  Name: string;
  Nationality: string;
  Place: number;
  Seconds: number;
  Time: string;
  URL: string;
  Year: number;
}
interface AppProps {}
interface AppState {
  data: Details[];
  error: null | string;
}
class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      data: [],
      error: null
    };
  }

  componentDidMount = async () => {
    try {
      const { data } = await axios.get(url);
      this.setState({ data });
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    return <div>asd asd</div>;
  }
}

export default App;
