export const AxisLeft = ({ yScale, innerWidth }) =>
  yScale.ticks().map((tickValue) => (
    <g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
      <line x2={innerWidth} /> //y1={yScale(tickValue)} y2={yScale(tickValue)}
      <text key={tickValue} style={{ textAnchor: "end" }} x={-15} dy=".32em">
        {tickValue}
      </text>
    </g>
  ));
