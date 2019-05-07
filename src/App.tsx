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
  Time: Date;
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
          const [minutes, seconds] = String(d.Time).split(':');
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
    const margin = {
        top: 100,
        right: 20,
        bottom: 30,
        left: 60
      },
      width = 920 - margin.left - margin.right,
      height = 630 - margin.top - margin.bottom;

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
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'graph')
      .append('g')
      .attr('transform', 'translate(60,60)');

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,500)')
      .call(xAxis)
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Year');

    // y-axis
    const y = d3
      .scaleTime()
      .domain([
        d3.min(data, ({ Time }) => Time) as Date,
        d3.max(data, ({ Time }) => Time) as Date
      ])
      .range([0, height]);

    const yAxis = d3
      .axisLeft(y)
      .tickFormat(d => d3.timeFormat('%M:%S')(new Date(`${d}`)));

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('id', 'y-axis')
      .call(yAxis);

    // dots
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', d => x(d.Year))
      .attr('cy', d => y(d.Time))
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time.toISOString())
      .style('fill', d => color(`${d.Doping !== ''}`));
  };
  render() {
    return <div className='graph-container' />;
  }
}

export default App;
