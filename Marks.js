export const Marks = ({ data, yScale, xScale, xValue, yValue, tooltipFormat, circleRadius, colorScale, colorValue }) =>
  data.map((d) => (
    <circle
      className="mark"
      fill={colorScale(colorValue(d))}
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      r={circleRadius}
    >
      <title>{"x: " + tooltipFormat(xValue(d)) + "\n" + "y: " + tooltipFormat(yValue(d))}</title>
    </circle>
  ));
