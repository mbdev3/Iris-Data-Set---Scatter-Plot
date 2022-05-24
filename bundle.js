(function (React$1, ReactDOM, d3, ReactDropdown) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var ReactDropdown__default = /*#__PURE__*/_interopDefaultLegacy(ReactDropdown);

  var csvUrl =
    "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv";

  var useData = function () {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      var row = function (d) {
        d.sepal_length = +d.sepal_length;
        d.sepal_width = +d.sepal_width;
        d.petal_length = +d.petal_length;
        d.petal_width = +d.petal_width;

        return d;
      };
      d3.csv(csvUrl, row).then(setData);
    }, []);
    return data;
  };

  var AxisBottom = function (ref) {
      var xScale = ref.xScale;
      var innerHeight = ref.innerHeight;
      var tickFormat = ref.tickFormat;

      return xScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', { className: "tick", key: tickValue, transform: ("translate(" + (xScale(tickValue)) + ",0)") },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', { style: { textAnchor: "middle" }, y: innerHeight + 15, dy: "0.71rem" },
          tickFormat(tickValue)
        )
      )
    ); });
  };

  var AxisLeft = function (ref) {
      var yScale = ref.yScale;
      var innerWidth = ref.innerWidth;

      return yScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', { className: "tick", transform: ("translate(0," + (yScale(tickValue)) + ")") },
        React.createElement( 'line', { x2: innerWidth }), " //y1=", yScale(tickValue), " y2=", yScale(tickValue),
        React.createElement( 'text', { key: tickValue, style: { textAnchor: "end" }, x: -15, dy: ".32em" },
          tickValue
        )
      )
    ); });
  };

  var Marks = function (ref) {
      var data = ref.data;
      var yScale = ref.yScale;
      var xScale = ref.xScale;
      var xValue = ref.xValue;
      var yValue = ref.yValue;
      var tooltipFormat = ref.tooltipFormat;
      var circleRadius = ref.circleRadius;
      var colorScale = ref.colorScale;
      var colorValue = ref.colorValue;

      return data.map(function (d) { return (
      React.createElement( 'circle', {
        className: "mark", fill: colorScale(colorValue(d)), cx: xScale(xValue(d)), cy: yScale(yValue(d)), r: circleRadius },
        React.createElement( 'title', null, "x: " + tooltipFormat(xValue(d)) + "\n" + "y: " + tooltipFormat(yValue(d)) )
      )
    ); });
  };

  var ColorLegend = function (ref) {
    var colorScale = ref.colorScale;
    var tickSize = ref.tickSize; if ( tickSize === void 0 ) tickSize = 10;
    var spacing = ref.spacing; if ( spacing === void 0 ) spacing = 40;
    var onHover = ref.onHover;
    var hoveredValue = ref.hoveredValue;
    var fadeOpacity = ref.fadeOpacity;

    return colorScale
      .domain()
      .map(function (domainValue, i) { return (
        React.createElement( 'g', {
          className: "tick", transform: ("translate(0," + (i * spacing) + ")"), onMouseEnter: function (){ return onHover(domainValue); }, onMouseOut: function (){ return onHover(null); }, opacity: hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 },
          React.createElement( 'circle', {
            fill: colorScale(domainValue), r: tickSize }),
          React.createElement( 'text', { dy: '.32em', dx: '1em' },
            domainValue
          )
        )
      ); });
  };

  var width = 960;
  var height = 500;
  var margin = {
    top: 10,
    bottom: 70,
    right: 150,
    left: 100,
  };

  var App = function () {
    var data = useData();
    var ref = React$1.useState(null);
    var hoveredValue = ref[0];
    var setHoveredValue = ref[1];

    var initialXAttribute = "petal_length";
    var ref$1 = React$1.useState(initialXAttribute);
    var xAttribute = ref$1[0];
    var setXAttribute = ref$1[1];
    var xValue = function (d) { return d[xAttribute]; };

    var initialYAttribute = "sepal_width";
    var ref$2 = React$1.useState(initialYAttribute);
    var yAttribute = ref$2[0];
    var setYAttribute = ref$2[1];

    var yValue = function (d) { return d[yAttribute]; };

    var colorValue = function (d) { return d.species; };

    if (!data) {
      return React__default["default"].createElement( 'pre', null, "loading.." );
    }
    // console.log(data.columns);

    var attributes = [];
    data.columns.map(function (item) {
      attributes = attributes.concat( [{
          value: item,
          label: item.replace(/_/gi, " "),
        }] );
    });

    attributes = attributes.filter(function (v) { return v.value !== "species"; });

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var xScale = d3.scaleLinear().domain(d3.extent(data, xValue)).range([0, innerWidth]).nice();

    var yScale = d3.scaleLinear().domain(d3.extent(data, yValue)).range([innerHeight, 0]).nice();

    var siFormat = d3.format(".2s");
    var xAxisTickFormat = function (tickValue) { return siFormat(tickValue).replace("G", "B"); };
    var tooltipFormat = function (tickValue) { return d3.format(",.2r")(tickValue).replace("G", "B"); };

    var colorScale = d3.scaleOrdinal().domain(data.map(colorValue)).range(["#E2BA00", "#42A4B5", "#684665"]);
    // console.log(colorScale.domain());

    var filteredData = data.filter(function (d) { return hoveredValue === colorValue(d); });
    var fadeOpacity = 0.2;
    return (
      React__default["default"].createElement( React__default["default"].Fragment, null,
        React__default["default"].createElement( 'div', { id: "title" },
          React__default["default"].createElement( 'h1', null, "Iris Data Set" )
        ),
        React__default["default"].createElement( 'g', { className: "menu" },
          React__default["default"].createElement( 'label', { for: "x-select" }, "X"),
          React__default["default"].createElement( ReactDropdown__default["default"], { options: attributes, value: xAttribute, onChange: function (ref) {
            var value = ref.value;

            return setXAttribute(value);
    } }),
          React__default["default"].createElement( 'label', { for: "y-select" }, "Y"),
          React__default["default"].createElement( ReactDropdown__default["default"], { options: attributes, value: yAttribute, onChange: function (ref) {
            var value = ref.value;

            return setYAttribute(value);
    } })
        ),
        React__default["default"].createElement( 'svg', { width: width, height: height },
          React__default["default"].createElement( 'g', { transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default["default"].createElement( AxisBottom, { innerHeight: innerHeight, xScale: xScale, tickFormat: xAxisTickFormat }),
            React__default["default"].createElement( AxisLeft, { yScale: yScale, innerWidth: innerWidth }),
            React__default["default"].createElement( 'text', { className: "label", textAnchor: "middle", x: innerWidth / 2, y: height - 25 },
              xAttribute.replace(/_/gi, " ")
            ),
            React__default["default"].createElement( 'text', {
              className: "label", textAnchor: "middle", transform: ("translate(" + (-margin.left / 2) + "," + (innerHeight / 2) + ") rotate(-90)") },
              yAttribute.replace(/_/gi, " ")
            ),
            React__default["default"].createElement( 'g', { transform: ("translate(" + (innerWidth + 40) + "," + (50) + ")") },
              " ",
              React__default["default"].createElement( ColorLegend, {
                colorScale: colorScale, onHover: setHoveredValue, hoveredValue: hoveredValue, fadeOpacity: fadeOpacity }),
              React__default["default"].createElement( 'text', { className: "label", textAnchor: "middle", dx: "30", dy: "-30" },
                "Species"
              )
            ),
            React__default["default"].createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1, style: { transition: "all 0.3s linear" } },
              React__default["default"].createElement( Marks, {
                data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: tooltipFormat, circleRadius: 10, style: { transition: "all  0.3s linear" } })
            ),
            React__default["default"].createElement( Marks, {
              data: filteredData, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: tooltipFormat, circleRadius: 10 })
          )
        )
      )
    );
  };

  var rootElement = document.getElementById("root");
  ReactDOM__default["default"].render(React__default["default"].createElement( App, null ), rootElement);

})(React, ReactDOM, d3, ReactDropdown);
//# sourceMappingURL=bundle.js.map
