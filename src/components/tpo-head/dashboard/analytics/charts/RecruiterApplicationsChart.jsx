import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '../../../../../hooks/useResizeObserver';
import { useInView } from '../../../../../hooks/useInView';
import { motion } from 'motion/react';

const RecruiterApplicationsChart = ({ data }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(containerRef);
  const { isInView } = useInView(containerRef);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!dimensions || !data || Object.keys(data).length === 0) return;

    const margin = { top: 30, right: 120, bottom: 100, left: 60 };
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

    const recruiters = Object.entries(data).map(([company, statuses]) => ({
      company,
      ...statuses,
    }));

    const statuses = ['APPLIED', 'HIRED'];
    // const colors = ['#2b7fff', '#006d88', '#00bba7'];
    const colors = ['#2b7fff', '#00bba7'];

    const x0 = d3.scaleBand()
      .domain(recruiters.map(d => d.company))
      .range([0, width])
      .padding(0.2);

    const x1 = d3.scaleBand()
      .domain(statuses)
      .range([0, x0.bandwidth()])
      // .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(recruiters, d => d3.max(statuses, status => d[status])) || 0])
      .nice()
      .range([height, 0]);

    // Add gradient definitions
    const defs = svg.append('defs');
    
    colors.forEach((color, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `bar-gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

      // gradient.append('stop')
      //   .attr('offset', '0%')
      //   .attr('stop-color', d3.rgb(color).darker(0.5).toString());

      // gradient.append('stop')
      //   .attr('offset', '100%')
      //   .attr('stop-color', d3.rgb(color).brighter(0.2).toString());

      // Add multiple stops for a smoother gradient
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(color).darker(0.9).toString()); // Darker at the bottom

      gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', d3.rgb(color).darker(0.1).toString()); // Mid-tone

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.rgb(color).brighter(1.9).toString()); // Brighter at the top
    });

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

    // Create and animate grouped bars
    const groups = g.selectAll('.bar-group')
      .data(recruiters)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(${x0(d.company)},0)`);

    groups.selectAll('.bar')
      .data(d => statuses.map(status => ({
        status,
        value: d[status],
        company: d.company
      })))
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x1(d.status) || 0)
      .attr('width', x1.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('rx', 10)
      // .attr('fill', (d, i) => `url(#bar-gradient-${i})`)
      .attr('fill', (d, i) => `url(#bar-gradient-${i % colors.length})`)
      .on('mouseover', (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          company: d.company,
          status: d.status,
          value: d.value
        });
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('filter', 'brightness(1.2)')
          .attr('transform', 'translate(0, -5)');
      })
      .on('mouseout', (event) => {
        setTooltipData(null);
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('filter', null)
          .attr('transform', 'translate(0, 0)');
      })
      .transition()
      .duration(1000)
      .delay((_, i) => i * 50)
      .ease(d3.easeBounceOut)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // Add x-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    xAxis.selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5));

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    statuses.forEach((status, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0,${i * 25})`);

      legendItem.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('rx', 2)
        .attr('fill', `${colors[i % colors.length]}`);

      legendItem.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#4b5563')
        .text(status.charAt(0) + status.slice(1).toLowerCase());
    });

  }, [data, dimensions, isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[400px] bg-white p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        Recruiter Applications Status
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
          <p className="font-medium text-gray-800">{tooltipData.company}</p>
          <p className="text-blue-600">
            {tooltipData.status.charAt(0) + tooltipData.status.slice(1).toLowerCase()}: {tooltipData.value}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecruiterApplicationsChart;