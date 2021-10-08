const margin = ({top: 20, right: 20, bottom: 20, left: 20})
const width = 650 - margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr('fill','steelblue')
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let select = document.querySelector('#group-by');
let sort = document.querySelector('button');
let type = document.querySelector('#group-by').value;
let direction = true;

const xScale = d3.scaleBand();

const yScale = d3.scaleLinear();

const xAxis = d3.axisBottom()
.scale(xScale);

const yAxis = d3.axisLeft()
.scale(yScale)
.ticks(10);

svg.append("g")
.attr("class", "axis x-axis");

svg.append("g")
.attr("class", "axis y-axis");

svg.append('text')
.attr('class', 'y-axis-title')
.attr('fill','black')
.attr('x', 20)
.attr('y', -5);

select.addEventListener("change", function() {
    Loading(this.value);
    type = this.value;
});

sort.addEventListener("click", function() {
    direction = !direction;
    Loading(type);
});

function Loading(type){
    d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
        update(data, type);
    });
}

function update(data, type){

    data.sort((a, b) => {
        if (direction) {
            return b[type] - a[type];
        } else {
            return a[type] - b[type];
        }
    });

    xScale.domain(data.map((d) => d.company))
        .rangeRound([49.1, width])
        .paddingInner(0.1);

    yScale.domain([d3.max(data, (d) => d[type]), 0])
        .range([0, height]);

    const bars = svg.selectAll('rect')
    .data(data);

    bars.enter()
        .append('rect')
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('x', (d) => xScale(d.company))
        .attr('y', (d) => yScale(d[type]))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d[type]));

    svg.select('.x-axis')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    svg.select('.y-axis')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(' + 50 + ',0)')
    .call(yAxis);

    svg.select('.y-axis-title')
    .text(() => {
        if (type == 'stores') {
            return 'Stores';
        }
        else if (type == 'revenue') {
            return 'Billion USD';
        }
    });
}

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    update(data, type);
    console.log(data)
});