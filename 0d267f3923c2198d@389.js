import define1 from "./b4b821d169d4ff8e@271.js";
import define2 from "./a33468b95d0b15b0@817.js";

function _1(md){return(
md`# CO2 Emissions Around the World`
)}

function _d3(require){return(
require("d3@6")
)}

function _4(md){return(
md`## Visualization 1: Top 20 countries with the highest emission per capita from 1990 to 2019`
)}

function _5(md){return(
md`**Introduction**: The following code generates a bar chart with animation showing the top 20 countries with the highest emission per capita from 1990 to 2019. The country with higher emission has longer bar and is positioned higher vertically. Countries in the same region share the same colors. The dataset catagorizes countries into 7 regions, which are South Asia, Sub-Saharan Africa, Europe & Central Asia, Middle East & North Africa, Latin America & Caribbean, East Asia & Pacific and North America. I developed the code referring to https://observablehq.com/@d3/bar-chart-race?intent=fork`
)}

async function _data(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("CO2_emission.csv").text(), d3.autoType)
)}

function _processedData(processData){return(
processData()
)}

function _processData(data){return(
function processData(){
  const result = [];
  data.forEach(d => {
    // We want to collect the data of countries which has valid 
    for (var key in d) {
        if(!d[key]) {
           return
        }
    }

    for (var key in d) {
        if (!isNaN(key)) {
          const region = d['Region']
          const year = key
          const country = d['Country Name']
          const emission = d[year]
          result.push({
            region: d['Region'],
            year: key,
            country: d['Country Name'],
            emission: d[year]
          })
        }
    }
  })
  
  return result
}
)}

async function* _chart1(d3,width,height,bars,axis,labels,ticker,keyframes,duration,delay,x,invalidation)
{

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  yield svg.node();

  for (const keyframe of keyframes) {
    const transition = svg.transition()
        .duration(duration)//
        .delay(delay)
        .ease(d3.easeLinear);

    // Extract the top bar’s value.
    x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    invalidation.then(() => svg.interrupt());
    await transition.end();
  }
}


function _n(){return(
20
)}

function _duration(){return(
1000
)}

function _delay(){return(
1000
)}

function _names(processedData){return(
new Set(processedData.map(d => d.country))
)}

function _yearValues(d3,processedData){return(
Array.from(d3.rollup(processedData, ([d]) => d.emission, d => +d.year, d => d.country))
  .map(([year, processedData]) => [year, processedData])
  .sort(([a], [b]) => d3.ascending(a, b))
)}

function _rank(names,d3,n){return(
function rank(value) {
  const data = Array.from(names, name => ({name, value: value(name)}));
  data.sort((a, b) => d3.descending(a.value, b.value));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  return data;
}
)}

function _keyframes(yearValues,rank)
{
  const keyframes = [];
  for (const pairIndex in yearValues) {
    const pair = yearValues[pairIndex]
    const year = pair[0]
    const mp = pair[1]
      keyframes.push([year, rank(name => mp.get(name) || 0)]);
  }
  return keyframes;
}


function _nameframes(d3,keyframes){return(
d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)
)}

function _prev(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))
)}

function _next(nameframes,d3){return(
new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))
)}

function _bars(n,color,y,x,prev,next){return(
function bars(svg) {
  let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("rect");

  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", d => y((prev.get(d) || d).rank))
        .attr("width", d => x((prev.get(d) || d).value) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", d => y((next.get(d) || d).rank))
        .attr("width", d => x((next.get(d) || d).value) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => x(d.value) - x(0)));
}
)}

function _labels(n,x,prev,y,next,textTween){return(
function labels(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dy", "-0.25em")
        .text(d => d.name)
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dy", "1.15em")),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
        .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))));
}
)}

function _textTween(d3){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    const tpc = i(t)
    this.textContent = `${tpc} (tons per capita)`;
  };
}
)}

function _tickFormat(){return(
undefined
)}

function _axis(marginTop,d3,x,width,tickFormat,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${marginTop})`);

  const axis = d3.axisTop(x)
      .ticks(width / 160, tickFormat)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}
)}

function _ticker(barSize,width,marginTop,n,keyframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", marginTop + barSize * (n - 0.45))
      .attr("dy", "0.32em")
      .text(keyframes[0][0]);

  return ([date], transition) => {
    transition.end().then(() => now.text(date));
  };
}
)}

function _formatDate(d3){return(
d3.utcFormat("%Y")
)}

function _color(d3,processedData)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
    const regionByName = new Map(processedData.map(d => [d.country, d.region]))
    scale.domain(regionByName.values());
    return d => scale(regionByName.get(d.name));
}


function _regions(processedData){return(
new Set(processedData.map(pd => pd.region))
)}

function _x(d3,marginLeft,width,marginRight){return(
d3.scaleLinear([0, 1], [marginLeft, width - marginRight])
)}

function _y(d3,n,marginTop,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([marginTop, marginTop + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)}

function _height(marginTop,barSize,n,marginBottom){return(
marginTop + barSize * n + marginBottom
)}

function _barSize(){return(
48
)}

function _marginTop(){return(
16
)}

function _marginRight(){return(
6
)}

function _marginBottom(){return(
6
)}

function _marginLeft(){return(
0
)}

function _37(md){return(
md`## Visualization 2: CO2 emission per capita around the world in 2019`
)}

function _38(md){return(
md`**Introduction**: The following visualization shows the co2 emission as in 2019 around the world. Countries with no data are colored in grey. The code of this work is referred to and modified from https://observablehq.com/@d3/world-choropleth/2?intent=fork`
)}

function _collectEmissions2019(data){return(
function collectEmissions2019() {
  const result = [];
  data.forEach(d => {
    // We want to collect the data of countries which has valid 
    for (var key in d) {
        if(!d[key]) {
           return
        }
    }

    const year = 2019
    const country = d['Country Name']
    const emission2019 = d[year]
    result.push({
      country: country,
      emission2019: emission2019
    })
  })
  
  return result
}
)}

function _emissions2019(collectEmissions2019){return(
collectEmissions2019()
)}

function _countries_in_data(emissions2019){return(
emissions2019.map(d => d.name)
)}

function _hale(emissions2019,rename){return(
emissions2019.map(d => ({name: rename.get(d.country) || d.country, hale: +d.emission2019}))
)}

function _rename(){return(
new Map([
  ["Antigua and Barbuda", "Antigua and Barb."],
  ["Bahamas, The", "Bahamas"],
  ["Bosnia and Herzegovina", "Bosnia and Herz."],
  ["Brunei Darussalam", "Brunei"],
  ["Central African Republic", "Central African Rep."],
  ["Cook Islands", "Cook Is."],
  ["Cote d'Ivoire", "Côte d'Ivoire"],
  ["Congo, Dem. Rep.", "Dem. Rep. Congo"],
  ["Congo, Rep.", "Congo"],
  ["Czech Republic", "Czechia"],
  ["Dominican Republic", "Dominican Rep."],
  ["Egypt, Arab Rep.", "Egypt"],
  ["Gambia, The", "Gambia"],
  ["Equatorial Guinea", "Eq. Guinea"],
  ["Iran, Islamic Rep.", "Iran"],
  ["Kyrgyz Republic", "Kyrgyzstan"],
  ["Korea, Rep.", "South Korea"],
  ["Lao PDR", "Laos"],
  ["St. Lucia", "Saint Lucia"],
  ["North Macedonia", "Macedonia"],
  ["Korea, Dem. People's Rep.", "North Korea"],
  ["Russian Federation", "Russia"],
  ["Solomon Islands", "Solomon Is."],
  ["South Sudan", "S. Sudan"],
  ["Sao Tome and Principe", "São Tomé and Principe"],
  ["Slovak Republic", "Slovakia"],
  ["Syrian Arab Republic", "Syria"],
  ["Turkiye", "Turkey"],
  ["United States", "United States of America"],
  ["St. Vincent and the Grenadines", "St. Vin. and Gren."],
  ["Venezuela, RB", "Venezuela"],
  ["Yemen, Rep.", "Yemen"]
])
)}

function _worldJsonUr(){return(
"https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"
)}

function _worldText(worldJsonUr){return(
fetch(worldJsonUr)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.text();
  })
)}

function _world(worldText){return(
JSON.parse(worldText)
)}

function _countries(topojson,world){return(
topojson.feature(world, world.objects.countries)
)}

function _countrymesh(topojson,world){return(
topojson.mesh(world, world.objects.countries, (a, b) => a !== b)
)}

function _50(Plot,countries,hale,countrymesh){return(
Plot.plot({
  projection: "equal-earth",
  width: 928,
  height: 928 / 2,
  color: {scheme: "YlGnBu", unknown: "#ccc", label: "CO2 emissions (metric tons per capita)", legend: true},
  marks: [
    Plot.sphere({fill: "white", stroke: "currentColor"}),
    Plot.geo(countries, {
      fill: (map => d => map.get(d.properties.name))(new Map(hale.map(d => [d.name, d.hale]))),
    }),
    Plot.geo(countrymesh, {stroke: "white"}),
 ]
})
)}

function _51(md){return(
md`## Visualization 3: Line plot of CO2 emission of countries from 1990 to 2019`
)}

function _52(md){return(
md`**Introduction**: The following code generates a interactive line plot of CO2 emission of countries from 1990 to 2019. Countries in the same region share the same colors. The dataset catagorizes countries into 7 regions, which are South Asia, Sub-Saharan Africa, Europe & Central Asia, Middle East & North Africa, Latin America & Caribbean, East Asia & Pacific and North America. I developed the code referring to https://observablehq.com/@d3/multi-line-chart/2?intent=fork`
)}

function _focus(Generators,chart3){return(
Generators.input(chart3)
)}

function _chart3(d3,processedData,color_chart3)
{

  // Specify the chart’s dimensions.
  const voronoi = false;
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 30;

  // Create the positional scales.
  const x = d3.scaleUtc()
    .domain(d3.extent(processedData, d => d.year))
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(processedData, d => d.emission)]).nice()
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;");

  // Add the horizontal axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  // Add the vertical axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ CO2 emissions (metric tons per capita)"));


  // Compute the points in pixel space as [x, y, z], where z is the name of the series.
  const points = processedData.map((d) => [x(d.year), y(d.emission), d.country, d.region]);

  // An optional Voronoi display (for fun).
  if (voronoi) svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", d3.Delaunay
        .from(points)
        .voronoi([0, 0, width, height])
        .render());

  // Group the points by series.
  const groups = d3.rollup(points, v => Object.assign(v, {z: v[0][2]}), d => d[2]);

  // Draw the lines.
  const line = d3.line();
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", (d) => color_chart3(d))
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(groups.values())  
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", line)
    .attr("stroke", (d) => color_chart3(d));

  // Add an invisible layer for the interactive tip.
  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -8);

  svg
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

  return svg.node();

  // When the pointer moves, find the closest point, update the interactive tip, and highlight
  // the corresponding line. Note: we don't actually use Voronoi here, since an exhaustive search
  // is fast enough.
  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
    const [x, y, k, r] = points[i];
    path.style("stroke", ({z}) => z === k ? null : "#ddd").filter(({z}) => z === k).raise();
    dot.attr("transform", `translate(${x},${y})`);
    dot.select("text").text(k);
    svg.property("value", processedData[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#ddd");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", "multiply").style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

}


function _meow(d3,processedData,color_chart3)
{
  // Specify the chart’s dimensions.
  const voronoi = false;
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 30;

  // Create the positional scales.
  const x = d3.scaleUtc()
    .domain(d3.extent(processedData, d => d.year))
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(processedData, d => d.emission)]).nice()
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;");

  // Add the horizontal axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  // Add the vertical axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ CO2 emissions (metric tons per capita)"));


  // Compute the points in pixel space as [x, y, z], where z is the name of the series.
  const points = processedData.map((d) => [x(d.year), y(d.emission), d.country, d.region]);

  // An optional Voronoi display (for fun).
  if (voronoi) svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", d3.Delaunay
        .from(points)
        .voronoi([0, 0, width, height])
        .render());

  // Group the points by series.
  const groups = d3.rollup(points, v => Object.assign(v, {z: v[0][2]}), d => d[2]);

  // Draw the lines.
  const line = d3.line();
  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(groups.values())
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", line)
    .attr("stroke", (d) => color_chart3(d));

  // Add an invisible layer for the interactive tip.
  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -8);

  return groups.values();
}


function _logs(){return(
['a']
)}

function _color_chart3(d3,processedData)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
    const regionByName = new Map(processedData.map(d => [d.country, d.region]))
    scale.domain(regionByName.values());

    return d => {
      //console.log(regionByName.get(d ? d[0][2] : d))
      console.log(scale(regionByName.get(d ? d[0][2] : d)))
      return scale(regionByName.get(d ? d[0][2] : d));
    }
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["CO2_emission.csv", {url: new URL("./files/e93085b9d515030f9967dd12a803a16506253490c8ce064a48be90628bee2c2f37c49d94b5833adefd6170e9c0e35197598811f9e26b804eb019709e927c085d.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("log", child1);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("processedData")).define("processedData", ["processData"], _processedData);
  main.variable(observer("processData")).define("processData", ["data"], _processData);
  main.variable(observer("chart1")).define("chart1", ["d3","width","height","bars","axis","labels","ticker","keyframes","duration","delay","x","invalidation"], _chart1);
  main.variable(observer("n")).define("n", _n);
  main.variable(observer("duration")).define("duration", _duration);
  main.variable(observer("delay")).define("delay", _delay);
  main.variable(observer("names")).define("names", ["processedData"], _names);
  main.variable(observer("yearValues")).define("yearValues", ["d3","processedData"], _yearValues);
  main.variable(observer("rank")).define("rank", ["names","d3","n"], _rank);
  main.variable(observer("keyframes")).define("keyframes", ["yearValues","rank"], _keyframes);
  main.variable(observer("nameframes")).define("nameframes", ["d3","keyframes"], _nameframes);
  main.variable(observer("prev")).define("prev", ["nameframes","d3"], _prev);
  main.variable(observer("next")).define("next", ["nameframes","d3"], _next);
  main.variable(observer("bars")).define("bars", ["n","color","y","x","prev","next"], _bars);
  main.variable(observer("labels")).define("labels", ["n","x","prev","y","next","textTween"], _labels);
  main.variable(observer("textTween")).define("textTween", ["d3"], _textTween);
  main.variable(observer("tickFormat")).define("tickFormat", _tickFormat);
  main.variable(observer("axis")).define("axis", ["marginTop","d3","x","width","tickFormat","barSize","n","y"], _axis);
  main.variable(observer("ticker")).define("ticker", ["barSize","width","marginTop","n","keyframes"], _ticker);
  main.variable(observer("formatDate")).define("formatDate", ["d3"], _formatDate);
  main.variable(observer("color")).define("color", ["d3","processedData"], _color);
  main.variable(observer("regions")).define("regions", ["processedData"], _regions);
  main.variable(observer("x")).define("x", ["d3","marginLeft","width","marginRight"], _x);
  main.variable(observer("y")).define("y", ["d3","n","marginTop","barSize"], _y);
  main.variable(observer("height")).define("height", ["marginTop","barSize","n","marginBottom"], _height);
  main.variable(observer("barSize")).define("barSize", _barSize);
  main.variable(observer("marginTop")).define("marginTop", _marginTop);
  main.variable(observer("marginRight")).define("marginRight", _marginRight);
  main.variable(observer("marginBottom")).define("marginBottom", _marginBottom);
  main.variable(observer("marginLeft")).define("marginLeft", _marginLeft);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("collectEmissions2019")).define("collectEmissions2019", ["data"], _collectEmissions2019);
  main.variable(observer("emissions2019")).define("emissions2019", ["collectEmissions2019"], _emissions2019);
  main.variable(observer("countries_in_data")).define("countries_in_data", ["emissions2019"], _countries_in_data);
  main.variable(observer("hale")).define("hale", ["emissions2019","rename"], _hale);
  main.variable(observer("rename")).define("rename", _rename);
  main.variable(observer("worldJsonUr")).define("worldJsonUr", _worldJsonUr);
  main.variable(observer("worldText")).define("worldText", ["worldJsonUr"], _worldText);
  main.variable(observer("world")).define("world", ["worldText"], _world);
  main.variable(observer("countries")).define("countries", ["topojson","world"], _countries);
  main.variable(observer("countrymesh")).define("countrymesh", ["topojson","world"], _countrymesh);
  const child2 = runtime.module(define2);
  main.import("Legend", child2);
  main.variable(observer()).define(["Plot","countries","hale","countrymesh"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("focus")).define("focus", ["Generators","chart3"], _focus);
  main.variable(observer("chart3")).define("chart3", ["d3","processedData","color_chart3"], _chart3);
  main.variable(observer("meow")).define("meow", ["d3","processedData","color_chart3"], _meow);
  main.variable(observer("logs")).define("logs", _logs);
  main.variable(observer("color_chart3")).define("color_chart3", ["d3","processedData"], _color_chart3);
  return main;
}
