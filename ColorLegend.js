export const ColorLegend = ({
  colorScale,
  tickSize = 10,
  spacing = 40,
  onHover,
  hoveredValue,
  fadeOpacity
}) => {
  return colorScale
    .domain()
    .map((domainValue, i) => (
      <g
        className="tick"
        transform={`translate(0,${i * spacing})`}
        onMouseEnter={()=>onHover(domainValue)}
        onMouseOut={()=>onHover(null)}
        opacity={hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1}
      >
        <circle
          fill={colorScale(domainValue)}
          r={tickSize}
        />
        <text dy={'.32em'} dx={'1em'}>
          {domainValue}
        </text>
      </g>
    ));
};
