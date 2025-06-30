import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '../../../../../hooks/useResizeObserver';
import { useInView } from '../../../../../hooks/useInView';
import { motion } from 'motion/react';

const StudentsByDepartmentChart = ({ data }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(containerRef);
  const { isInView } = useInView(containerRef);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!dimensions || !data || Object.keys(data).length === 0) return;

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!isInView) return;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const departments = Object.entries(data).map(([department, count]) => ({
      department,
      count: Number(count),
    }));

    const x = d3
      .scaleBand()
      .domain(departments.map(d => d.department))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(d3.max(departments, d => d.count) || 0) * 1.2])
      .nice()
      .range([height, 0]);

    // Add gradient definition
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      // .attr('stop-color', '#60a5fa');   //color 1 (bottom)
      .attr('stop-color', '#009689');   //color 1 (bottom)

    gradient
      .append('stop')
      .attr('offset', '100%')
      // .attr('stop-color', '#3b82f6');   //color 2 (top)
      .attr('stop-color', '#96f7e4');   //color 2 (top)

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    // Create and animate bars
    g.selectAll('.bar')
      .data(departments)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.department) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 4)
      .on('mouseover', (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          department: d.department,
          count: d.count,
        });
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('filter', 'brightness(1.2)')
          // .attr('transform', `scale(1.02, 1)`);
          .attr('transform', `translate(0, -5)`);
      })
      .on('mouseout', (event) => {
        setTooltipData(null);
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('filter', null)
          // .attr('transform', 'scale(1, 1)');
          .attr('transform', `translate(0, 0)`);
      })
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .ease(d3.easeBounceOut)
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count));

    // Add value labels on top of bars
    g.selectAll('.value-label')
      .data(departments)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.department) || 0) + x.bandwidth() / 2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4b5563')
      .style('opacity', 0)
      .text(d => d.count)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100 + 500)
      .ease(d3.easeQuadOut)
      .attr('y', d => y(d.count) - 8)
      .style('opacity', 1);

    // Add axes
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('font-size', '12px');

    xAxis
      .selectAll('text')
      .style('text-anchor', 'middle');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .style('font-size', '12px');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#4b5563')
      .text('Number of Students');

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
        Students by Department
      </motion.h2>
      <svg ref={svgRef} className="w-full h-[calc(100%-2rem)]" />
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
          <p className="font-medium text-gray-800">{tooltipData.department}</p>
          <p className="text-blue-600">{tooltipData.count} students</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentsByDepartmentChart;