import {inject} from 'aurelia-framework';
import * as d3 from 'd3';

export class StaticLineChart {

  static inject() {
    return [d3];
  }

  constructor (d3) {
    this.d3       = d3;
    this.didError = false;
    this.filename = 'dist/data/static-line-chart.tsv';
  }

  attached () {
    this.initializeChart();
  }

  initializeChart () {
    this.margin = {
      top:    20,
      right:  20,
      bottom: 30,
      left:   50
    };
    this.width  = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.renderLineChart();
  }

  renderLineChart () {
    var lineChart = this;
    var filename = this.filename;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale()
      .range([0, this.width]);

    var y = d3.scale.linear()
      .range([this.height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

    var svg = d3.select("#placeholder").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    d3.tsv(filename, function(error, data) {
      if (error) {
        lineChart.didError = true;
        lineChart.errorMessage = error.responseText || 'There was an unspecified problem';
        return;
      };

      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain(d3.extent(data, function(d) { return d.close; }));

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + lineChart.height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
    });
  }
}
