import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '../../../../../hooks/useResizeObserver';
import { useInView } from '../../../../../hooks/useInView';
import { motion } from 'motion/react';


const PlacementSuccessRateChart = ({ data }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(containerRef);
  const { isInView } = useInView(containerRef);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!dimensions || !data || Object.keys(data).length === 0 || !isInView) return;

    const departments = Object.entries(data).map(([department, rate]) => ({
      department,
      rate: Number(rate),
    }));

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create root group
    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(departments.map(d => d.department))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(100, d3.max(departments, d => d.rate) || 0)])
      .nice()
      .range([height, 0]);

    // Add gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(100));

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#60a5fa');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6');

    // Create and animate the area
    const area = d3
      .area()
      .x(d => (x(d.department) || 0) + x.bandwidth() / 2)
      .y0(height)
      .y1(d => y(d.rate))
      .curve(d3.curveMonotoneX);

    const areaPath = g
      .append('path')
      .datum(departments)
      .attr('class', 'area')
      .attr('fill', 'url(#line-gradient)')
      .attr('opacity', 0.2)
      .attr('d', area);

    // Create and animate the line
    const line = d3
      .line()
      .x(d => (x(d.department) || 0) + x.bandwidth() / 2)
      .y(d => y(d.rate))
      .curve(d3.curveMonotoneX);

    const path = g
      .append('path')
      .datum(departments)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate the line and area
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(2000)
      .ease(d3.easeQuadOut)
      .attr('stroke-dashoffset', 0);

    areaPath
      .attr('opacity', 0)
      .transition()
      .duration(2000)
      .ease(d3.easeQuadOut)
      .attr('opacity', 0.2);

    // Add data points
    g.selectAll('.data-point')
      .data(departments)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => (x(d.department) || 0) + x.bandwidth() / 2)
      .attr('cy', d => y(d.rate))
      .attr('r', 6)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .on('mouseover', (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          department: d.department,
          rate: d.rate,
        });
        d3.select(event.target).attr('r', 8);
      })
      .on('mouseout', event => {
        setTooltipData(null);
        d3.select(event.target).attr('r', 6);
      })
      .transition()
      .delay((_, i) => i * 200)
      .duration(1000)
      .style('opacity', 1);

    // Add axes
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('font-size', '12px');

    xAxis
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    const yAxis = g
      .append('g')
      .call(d3.axisLeft(y).tickFormat(d => `${d}%`))
      .style('font-size', '12px');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    // Add labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#4b5563')
      .text('Success Rate (%)');

  }, [data, dimensions, isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[450px] bg-white p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        Placement Success Rate
      </motion.h2>
      <svg ref={svgRef} className="w-full h-[calc(100%-2rem)]" />
      {tooltipData && (
        <div
          className="absolute pointer-events-none bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 z-50"
          style={{
            left: tooltipData.x + 10,
            top: tooltipData.y - 40,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="font-medium text-gray-800">{tooltipData.department}</p>
          <p className="text-blue-600">{tooltipData.rate.toFixed(1)}%</p>
        </div>
      )}
    </motion.div>
  );
};

export default PlacementSuccessRateChart;