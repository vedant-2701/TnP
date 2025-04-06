// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

// const ApplicationStatusChart = ({ data }) => {
//   const svgRef = useRef();

//   useEffect(() => {
//     if (!data || Object.keys(data).length === 0) return;

//     const width = 300;
//     const height = 300;
//     const radius = Math.min(width, height) / 2;

//     const svg = d3.select(svgRef.current)
//       .attr('width', width)
//       .attr('height', height)
//       .html('') // Clear previous content
//       .append('g')
//       .attr('transform', `translate(${width / 2}, ${height / 2})`);

//     const pie = d3.pie().value(d => d.value);
//     const dataReady = pie(Object.entries(data).map(([key, value]) => ({ key, value })));

//     const arc = d3.arc().innerRadius(0).outerRadius(radius);

//     svg.selectAll('path')
//       .data(dataReady)
//       .enter()
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', (d, i) => d3.schemeCategory10[i])
//       .attr('stroke', 'white')
//       .style('stroke-width', '2px');

//     svg.selectAll('text')
//       .data(dataReady)
//       .enter()
//       .append('text')
//       .text(d => `${d.data.key}: ${d.data.value}`)
//       .attr('transform', d => `translate(${arc.centroid(d)})`)
//       .style('text-anchor', 'middle')
//       .style('font-size', '12px')
//       .style('fill', 'white');
//   }, [data]);

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-lg">
//       <h2 className="text-xl font-semibold mb-2 text-gray-700">Application Status</h2>
//       <svg ref={svgRef}></svg>
//     </div>
//   );
// };

// export default ApplicationStatusChart;

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '../../../../../hooks/useResizeObserver';
import { useInView } from '../../../../../hooks/useInView';
import { motion } from 'motion/react';

const ApplicationStatusChart = ({ data }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const { isInView, hasAnimated } = useInView(containerRef);
  const dimensions = useResizeObserver(containerRef);
  const [tooltipData, setTooltipData] = useState(null);
  const [colorScale, setColorScale] = useState([]);

  useEffect(() => {
    if (!dimensions || !data || Object.keys(data).length === 0 || !isInView) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create root group
    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(Object.keys(data))
      .range(['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']);

    // console.log("color", color.range());
    setColorScale(color.range());

    // Create pie layout
    const pie = d3.pie()
      .value(d => d[1])
      .sort(null);

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.4) // Create a donut chart
      .outerRadius(radius * 0.8);

    // Create arc generator for labels
    const labelArc = d3.arc()
      .innerRadius(radius * 0.96)
      .outerRadius(radius * 0.96);

    // Prepare the data
    const pieData = pie(Object.entries(data));

    // Add gradient definitions
    const defs = svg.append('defs');
    
    pieData.forEach((d, i) => {
      const gradientId = `gradient-${i}`;
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(color(d.data[0])).brighter(0.5).toString());

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.rgb(color(d.data[0])).darker(0.2).toString());
    });

    // Create group for each slice
    const slice = g.selectAll('.arc')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add paths
    slice.append('path')
      .style('fill', (d, i) => `url(#gradient-${i})`)
      .style('stroke', 'white')
      .style('stroke-width', '2px')
      .attr('d', arc)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 200)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      })
      .attr('opacity', 1);

    // Add hover interactions
    slice
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', function() {
            const centroid = arc.centroid(d);
            const x = centroid[0] * 0.1;
            const y = centroid[1] * 0.1;
            return `translate(${x},${y})`;
          });

        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          key: d.data[0],
          value: d.data[1]
        });
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0,0)');
        
        setTooltipData(null);
      });

    // Add labels
    const total = d3.sum(Object.values(data));
    
    g.selectAll('.label')
      .data(pieData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4b5563')
      .style('opacity', 0)
      .text(d => {
        const percentage = ((d.data[1] / total) * 100).toFixed(1);
        return `${percentage} %`;
      })
      .transition()
      .delay((_, i) => i * 200 + 1000)
      .duration(500)
      .style('opacity', 1);

    // Add center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '14px')
      .style('fill', '#4b5563')
      .text('Total');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#1f2937')
      .text(total);

  }, [data, dimensions, isInView]);
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[400px] bg-white p-6 rounded-xl shadow-lg"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        Application Status
      </motion.h2>
      <motion.div 
        className="flex flex-wrap gap-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {Object.entries(data).map(([key, value], index) => (
          <motion.div 
            key={key} 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                // backgroundColor: d3.schemeSet3[index % d3.schemeSet3.length] 
                backgroundColor: colorScale[index % colorScale.length]
              }} 
            />
            <span className="text-sm text-gray-600">{key}: {value}</span>
          </motion.div>
        ))}
      </motion.div>
      <svg ref={svgRef} className="w-full h-[calc(100%-5rem)]" />
      {tooltipData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute pointer-events-none bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 z-50"
          style={{
            left: tooltipData.x + 10,
            top: tooltipData.y - 40,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="font-medium text-gray-800">{tooltipData.key}</p>
          <p className="text-blue-600">{tooltipData.value} {tooltipData.value <= 1 ? "application" : "applications"}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ApplicationStatusChart;