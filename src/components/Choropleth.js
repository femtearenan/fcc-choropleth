import React from 'react';
import { connect } from 'react-redux';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

class Choropleth extends React.Component {

    renderCounties() {
        if (this.props.appReducer.isOK) {
            
            const padding = 40;
            const countyData = this.props.appReducer.countyData;
            const educationData = this.props.appReducer.educationData;
            
            const geoData = topojson.feature(countyData, countyData.objects.counties).features;
            // console.table(geoData);
            const mappedData = educationData.map(obj => {
                
                return "";
            })
            const svg = d3.select("#choropleth").append("svg");
            const path = d3.geoPath();
            this.colors = d3.schemeBlues[5];

            this.eduMin = d3.min(educationData, d => d["bachelorsOrHigher"]);
            this.eduMax = d3.max(educationData, d => d["bachelorsOrHigher"]);
            this.interval = (this.eduMax - this.eduMin) / (this.colors.length);

            let width = 1000;
            let height = 750;
            
            svg.attr("width", width)
                .attr("height", height);

            const tooltip = d3.select("#choropleth")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

            svg.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(geoData)
                .enter()
                .append("path")
                    .attr("class", "county")
                    .attr("data-fips", d => d.id)
                    .attr("data-education", d => educationData.filter(obj => obj.fips === d.id)[0]["bachelorsOrHigher"])
                    .attr("fill", d => {
                        let data = educationData.filter(obj => obj.fips === d.id);
                        let index = Math.floor( data[0]["bachelorsOrHigher"] / this.interval);
                        index = index >= this.colors.length ? this.colors.length - 1 : index;
                        return this.colors[index];
                    })
                    .attr("d", path)
                    .on("mouseover", d => {
                        tooltip
                            .style("opacity", 1)
                            .attr("data-education", () => {
                                let eduObject = educationData.filter(obj => obj.fips === d.id)[0];
                                return eduObject["bachelorsOrHigher"];
                            })
                            .html( () => {
                                let eduObject = educationData.filter(obj => obj.fips === d.id)[0];
                                return `${eduObject['area_name']} ${eduObject['state']}: ${eduObject["bachelorsOrHigher"]}%`;
                            })
                            
                    })
                    .on("mouseout", () => {
                        tooltip.style("opacity", 0);
                    } )

            this.attachLegend();

            
        }

        
    }

    attachLegend() {
        let width = 300;
        let height = 100;
        let rectWidth = (width - 20) / this.colors.length
        let rectHeight = height / 2;
        const legend = d3.select("#choropleth")
                            .append("svg")
                            .attr("id", "legend")
                            .attr("class", "heat-legend")
                            .attr("width", width)
                            .attr("height", height);
        

        legend.selectAll('rect')
            .data(this.colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => rectWidth*(i) === 0 ? 10 : rectWidth * i)
            .attr('y', 10)
            .attr('height', rectHeight)
            .attr('width', rectWidth)
            .attr('fill', (d) => d);
        
        
        let heatDomain = [];
        let heatRange = [];
        let heatInterval = this.interval;
        for (let i = 0; i < this.colors.length; i++) {
            heatDomain.push(this.eduMin + heatInterval*i);
            heatRange.push(rectWidth*(i) === 0 ? 10 : rectWidth*(i));
        }
        const heatScale = d3.scaleOrdinal()
            .domain([ ...heatDomain, this.eduMax ])
            .range([...heatRange, width-20 ]);
        const heatAxis = d3.axisBottom(heatScale);
        // heatAxis.tickFormat(d => getShortTimeString(new Date(d*1000)));
        // heatAxis.ticks(7);


        legend.append('g')
            .attr('transform', 'translate(0,' + (height - (height / 3)) + ')')
            .attr('id', 'heat-axis')
            .call(heatAxis);
        
        
    }

    render() {

        return (
            <div id="choropleth">
                {this.renderCounties()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

export default connect(mapStateToProps)(Choropleth);