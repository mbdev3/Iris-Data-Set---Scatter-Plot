import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useData } from "./useData";
import { AxisBottom } from "./axisBottom";
import { AxisLeft } from "./axisLeft";
import { Marks } from "./Marks";
import { scaleLinear, format, extent, scaleOrdinal } from "d3";
import ReactDropdown from "react-dropdown";

import { ColorLegend } from "./ColorLegend";
const width = 960;
const height = 500;
const margin = {
  top: 10,
  bottom: 70,
  right: 150,
  left: 100,
};

const App = () => {
  const data = useData();
  const [hoveredValue, setHoveredValue] = useState(null);

  const initialXAttribute = "petal_length";
  const [xAttribute, setXAttribute] = useState(initialXAttribute);
  const xValue = (d) => d[xAttribute];

  const initialYAttribute = "sepal_width";
  const [yAttribute, setYAttribute] = useState(initialYAttribute);

  const yValue = (d) => d[yAttribute];

  const colorValue = (d) => d.species;

  if (!data) {
    return <pre>loading..</pre>;
  }
  // console.log(data.columns);

  let attributes = [];
  data.columns.map((item) => {
    attributes = [
      ...attributes,
      {
        value: item,
        label: item.replace(/_/gi, " "),
      },
    ];
  });

  attributes = attributes.filter((v) => v.value !== "species");

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xScale = scaleLinear().domain(extent(data, xValue)).range([0, innerWidth]).nice();

  const yScale = scaleLinear().domain(extent(data, yValue)).range([innerHeight, 0]).nice();

  const siFormat = format(".2s");
  const xAxisTickFormat = (tickValue) => siFormat(tickValue).replace("G", "B");
  const tooltipFormat = (tickValue) => format(",.2r")(tickValue).replace("G", "B");

  const colorScale = scaleOrdinal().domain(data.map(colorValue)).range(["#E2BA00", "#42A4B5", "#684665"]);
  // console.log(colorScale.domain());

  const filteredData = data.filter((d) => hoveredValue === colorValue(d));
  const fadeOpacity = 0.2;
  return (
    <>
      <div id="title">
        <h1>Iris Data Set</h1>
      </div>
      <g className="menu">
        <label for="x-select">X</label>
        <ReactDropdown options={attributes} value={xAttribute} onChange={({ value }) => setXAttribute(value)} />
        <label for="y-select">Y</label>
        <ReactDropdown options={attributes} value={yAttribute} onChange={({ value }) => setYAttribute(value)} />
      </g>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom innerHeight={innerHeight} xScale={xScale} tickFormat={xAxisTickFormat} />
          <AxisLeft yScale={yScale} innerWidth={innerWidth} />
          <text className="label" textAnchor="middle" x={innerWidth / 2} y={height - 25}>
            {xAttribute.replace(/_/gi, " ")}
          </text>
          <text
            className="label"
            textAnchor="middle"
            transform={`translate(${-margin.left / 2},${innerHeight / 2}) rotate(-90)`}
          >
            {yAttribute.replace(/_/gi, " ")}
          </text>
          <g transform={`translate(${innerWidth + 40},${50})`}>
            {" "}
            <ColorLegend
              colorScale={colorScale}
              onHover={setHoveredValue}
              hoveredValue={hoveredValue}
              fadeOpacity={fadeOpacity}
            />
            <text className="label" textAnchor="middle" dx="30" dy="-30">
              {"Species"}
            </text>
          </g>
          <g opacity={hoveredValue ? fadeOpacity : 1} style={{ transition: "all 0.3s linear" }}>
            <Marks
              data={data}
              xScale={xScale}
              yScale={yScale}
              xValue={xValue}
              yValue={yValue}
              colorScale={colorScale}
              colorValue={colorValue}
              tooltipFormat={tooltipFormat}
              circleRadius={10}
              style={{ transition: "all  0.3s linear" }}
            />
          </g>
          <Marks
            data={filteredData}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            colorScale={colorScale}
            colorValue={colorValue}
            tooltipFormat={tooltipFormat}
            circleRadius={10}
          />
        </g>
      </svg>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
