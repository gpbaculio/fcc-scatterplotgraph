import React, { Component } from 'react';
import axios from 'axios';
import { url } from './constants';

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}

interface Details {
  Doping: string;
  Name: string;
  Nationality: string;
  Place: number;
  Seconds: number;
  Time: Date | string;
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
      const data = await axios.get(url).then(({ data }) =>
        data.map((d: Details) => {
          const parsedTime = (d.Time as string).split(':');
          const Time = new Date(
            Date.UTC(
              1970,
              0,
              1,
              0,
              Number(parsedTime[0]),
              Number(parsedTime[1])
            )
          );
          return {
            ...d,
            Place: +d.Place,
            Time
          };
        })
      );
      this.setState({ data });
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    return <div className='scatterplotgraph-container' />;
  }
}

export default App;
