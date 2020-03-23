import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styles/chart.scss"

const Chart = (props) => {
    const canvas = useRef(null);

    useEffect(() => {
        const cases = props.cases;
        const countries = props.countries;
        cases.length && drawBarChart(cases, countries)
    }, [props.cases, props.countries])

    const drawBarChart = (cases, countries) => {
        const margin = { top: 30, bottom: 30, left: 30, right: 30},
        width = 400,
        height = 200;

        d3.select("svg").remove();

        const div = d3.select(canvas.current).append("div")
                    .attr("id", "tooltip")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
        
        const svg = d3.select(canvas.current)
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
                    .attr('preserveAspectRatio', 'xMinYMin')

        const xscale = d3.scaleBand()
                    .domain(countries)
                    .range([0, width])
                    .padding("10px")

        const xAxis = d3.axisBottom(xscale);

        svg.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(60, 280)');
        
        svg.append('text')
            .attr("x", 225)
            .attr("y", 320)
            .attr("fill", "yellow")
            .text("Country");

        const linearScale = d3.scaleLinear()
            .domain([d3.min(cases), d3.max(cases)])
            .range([0, height]);
        
        const scaledVals = cases.map(function (item) {
                return linearScale(item);
            });
        
        const yscale = d3.scaleLinear()
            .domain([d3.min(cases), d3.max(cases)])
            .range([height, 0]);

        const yAxis = d3.axisLeft(yscale)

        svg.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(60, 30)');
        
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -230)
            .attr('y', 15)
            .attr("fill", "yellow")
            .text('Confirmed Cases');

        svg.append("text")
            .attr("x", 110)
            .attr("y", 15)
            .attr("class", "graph-title")
            .attr("fill", "white")
            .text(`Covid-19 Cases by Country`)
        // svg.append("text")
        //     .attr("x", 200)
        //     .attr("y", 35)
        //     .attr("class", "graph-subtitle")
        //     .attr("fill", "white")
        //     .text("Average Annual Temperature")

        svg.selectAll('rect')
            .data(scaledVals)
            .enter()
            .append('rect')
            .attr('width', xscale.bandwidth())
            .attr('height', function (d) {
                return d;
            })
            .attr('fill', 'gold')
            .attr('x', function (d, i) {
                return xscale(countries[i]) + 60;
            })
            .attr('y', function (d, i) {
                return height - d + 30;
            })
            .on("mouseover", (d, i) => {
                div.transition()
                .duration(200)
                .style("opacity", 0.9)
                div.html("Country: " + countries[i] + "<br>" + "Cases: " + cases[i] + "&#176;C")
                .style('left', (d3.event.pageX - 18) + 'px')
                .style('top', (d3.event.pageY - 44) + 'px')
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            });


    }
    return (
        <div className="chart-wrapper">
            <div id="canvas" ref={canvas}></div>
        </div> 
    )
}

export default Chart;