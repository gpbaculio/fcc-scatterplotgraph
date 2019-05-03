import React, { Component } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { url } from './constants';
import './App.css';
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
          const [minutes, seconds] = (d.Time as string).split(':');
          const Time = new Date(
            Date.UTC(1970, 0, 1, 0, Number(minutes), Number(seconds))
          );
          return {
            ...d,
            Place: +d.Place,
            Time
          };
        })
      );
      this.setState({ data }, () => this.createChart());
    } catch (error) {
      this.setState({ error });
    }
  };
  createChart = () => {
    const { data } = this.state;
    const width = 900,
      height = 600;

    // x-axis
    const x = d3
      .scaleLinear()
      .domain([
        d3.min(data, ({ Year }) => Year - 1) as number,
        d3.max(data, ({ Year }) => Year + 1) as number
      ])
      .range([0, width]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));

    var svg = d3
      .select('.graph-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60,400)')
      .call(xAxis)
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Year');
  };
  render() {
    return <div className='graph-container' />;
  }
}

export default App;
