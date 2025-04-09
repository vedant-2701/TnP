import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '../../../../../hooks/useResizeObserver';
import { useInView } from '../../../../../hooks/useInView';
import { motion } from 'motion/react';

const TopRecruitersChart= ({ data }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(containerRef);
  const { isInView } = useInView(containerRef);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!dimensions || !data || data.length === 0) return;

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

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.companyName))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(d3.max(data, d => d.hiredCount) || 0) * 1.2])
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
      .attr('stop-color', '#009689');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#96f7e4');

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
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.companyName) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 4)
      .on('mouseover', (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          company: d.companyName,
          count: d.hiredCount,
        });
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('filter', 'brightness(1.1)')
          .attr('transform', `translate(0, -5)`);
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
      .delay((_, i) => i * 100)
      .ease(d3.easeBounceOut)
      .attr('y', d => y(d.hiredCount))
      .attr('height', d => height - y(d.hiredCount));

    // Add value labels on top of bars
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.companyName) || 0) + x.bandwidth() / 2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#4b5563')
      .style('opacity', 0)
      .text(d => d.hiredCount)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100 + 500)
      .ease(d3.easeQuadOut)
      .attr('y', d => y(d.hiredCount) - 8)
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
      // .attr('dx', '-.8em')
      .attr('dx', '2.5em')
      .attr('dy', '.95em')
      // .attr('transform', 'rotate(-45)');

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
      .text('Number of Hires');

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
        Top Recruiters
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
          <p className="text-blue-600">{tooltipData.count} hires</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopRecruitersChart;


// import React, { useRef, useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import { useResizeObserver } from '../../../../../hooks/useResizeObserver';
// import { useInView } from '../../../../../hooks/useInView';
// import { motion } from 'motion/react';


// const TopRecruitersChart = ({ data }) => {
//   const containerRef = useRef(null);
//   const svgRef = useRef(null);
//   const dimensions = useResizeObserver(containerRef);
//   const { isInView } = useInView(containerRef);
//   const [tooltipData, setTooltipData] = useState(null);

//   useEffect(() => {
//     if (!dimensions || !data || data.length === 0) return;

//     // const margin = { top: 30, right: 120, bottom: 50, left: 60 };
//     const margin = { top: 30, right: 60, bottom: 70, left: 120 };
//     const width = dimensions.width - margin.left - margin.right;
//     const height = dimensions.height - margin.top - margin.bottom;

//     const svg = d3.select(svgRef.current);
//     svg.selectAll('*').remove();

//     if (!isInView) return;

//     const g = svg
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height + margin.top + margin.bottom)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     const y = d3
//       .scaleBand()
//       .domain(data.map(d => d.companyName))
//       .range([0, height])
//       .padding(0.3);

//     const x = d3
//       .scaleLinear()
//       .domain([0, Math.max(d3.max(data, d => d.hiredCount) || 0) * 1.2])
//       .nice()
//       .range([0, width]);

//     // Add gradient definition
//     const gradient = svg
//       .append('defs')
//       .append('linearGradient')
//       .attr('id', 'bar-gradient')
//       .attr('gradientUnits', 'userSpaceOnUse')
//       .attr('x1', '0%')
//       .attr('y1', '0%')
//       .attr('x2', '100%')
//       .attr('y2', '0%');

//     gradient
//       .append('stop')
//       .attr('offset', '0%')
//       .attr('stop-color', '#60a5fa');

//     gradient
//       .append('stop')
//       .attr('offset', '100%')
//       .attr('stop-color', '#3b82f6');

//     // Add grid lines
//     g.append('g')
//       .attr('class', 'grid')
//       .call(
//         d3.axisBottom(x)
//           .tickSize(height)
//           .tickFormat(() => '')
//       )
//       .style('stroke-dasharray', '3,3')
//       .style('stroke-opacity', 0.2)
//       .call(g => g.select('.domain').remove());

//     // Create and animate bars
//     g.selectAll('.bar')
//       .data(data)
//       .enter()
//       .append('rect')
//       .attr('class', 'bar')
//       .attr('y', d => y(d.companyName) || 0)
//       .attr('height', y.bandwidth())
//       .attr('x', 0)
//       .attr('width', 0)
//       .attr('fill', 'url(#bar-gradient)')
//       .attr('rx', 4)
//       .on('mouseover', (event, d) => {
//         setTooltipData({
//           x: event.pageX,
//           y: event.pageY,
//           company: d.companyName,
//           count: d.hiredCount,
//         });
//         d3.select(event.target)
//           .transition()
//           .duration(200)
//           .attr('filter', 'brightness(1.1)')
//           .attr('transform', `translate(5, 0)`);
//       })
//       .on('mouseout', (event) => {
//         setTooltipData(null);
//         d3.select(event.target)
//           .transition()
//           .duration(200)
//           .attr('filter', null)
//           .attr('transform', 'translate(0, 0)');
//       })
//       .transition()
//       .duration(1000)
//       .delay((_, i) => i * 100)
//       .ease(d3.easeBounceOut)
//       .attr('width', d => x(d.hiredCount));

//     // Add value labels at the end of bars
//     g.selectAll('.value-label')
//       .data(data)
//       .enter()
//       .append('text')
//       .attr('class', 'value-label')
//       .attr('x', 0)
//       .attr('y', d => (y(d.companyName) || 0) + y.bandwidth() / 2)
//       .attr('dy', '0.35em')
//       .attr('text-anchor', 'start')
//       .style('font-size', '12px')
//       .style('fill', '#4b5563')
//       .style('opacity', 0)
//       .text(d => d.hiredCount)
//       .transition()
//       .duration(1000)
//       .delay((_, i) => i * 100 + 500)
//       .ease(d3.easeQuadOut)
//       .attr('x', d => x(d.hiredCount) + 8)
//       .style('opacity', 1);

//     // Add y-axis (company names)
//     g.append('g')
//       .call(d3.axisLeft(y))
//       .style('font-size', '12px')
//       .call(g => g.select('.domain').remove());

//     // Add x-axis with more prominent styling
//     const xAxis = g.append('g')
//       .attr('transform', `translate(0,${height})`)
//       .call(
//         d3.axisBottom(x)
//           .ticks(5)
//           .tickSize(6)
//       )
//       .style('font-size', '12px');

//     // Style x-axis
//     xAxis.select('.domain')
//       .style('stroke', '#9CA3AF')
//       .style('stroke-width', '1.5px');
    
//     xAxis.selectAll('.tick line')
//       .style('stroke', '#9CA3AF')
//       .style('stroke-width', '1.5px');
    
//     xAxis.selectAll('.tick text')
//       .style('fill', '#4B5563')
//       .style('font-weight', '500');

//     // Add x-axis label with more prominence
//     g.append('text')
//       .attr('class', 'x-axis-label')
//       .attr('x', width / 2)
//       // .attr('y', height + margin.bottom - 10)
//       .attr('y', -20)
//       .attr('text-anchor', 'middle')
//       .style('fill', '#374151')
//       .style('font-size', '14px')
//       .style('font-weight', '600')
//       .text('Number of Hires');

//     // Add small ticks at each integer value
//     const smallTicks = g.append('g')
//       .attr('transform', `translate(0,${height})`);

//     const tickValues = d3.range(0, Math.ceil(x.domain()[1]) + 1);
    
//     smallTicks.selectAll('.small-tick')
//       .data(tickValues)
//       .enter()
//       .append('line')
//       .attr('x1', d => x(d))
//       .attr('x2', d => x(d))
//       .attr('y1', 0)
//       .attr('y2', 4)
//       .style('stroke', '#9CA3AF')
//       .style('stroke-width', '1px');

//   }, [data, dimensions, isInView]);

//   return (
//     <motion.div
//       ref={containerRef}
//       initial={{ opacity: 0, y: 50 }}
//       animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="w-full h-[400px] bg-white p-6 rounded-xl shadow-lg"
//     >
//       <motion.h2 
//         initial={{ opacity: 0, x: -20 }}
//         animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         className="text-xl font-semibold mb-4 text-gray-800"
//       >
//         Top Recruiters
//       </motion.h2>
//       <svg ref={svgRef} className="w-full h-[calc(100%-2rem)]" />
//       {tooltipData && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           className="absolute pointer-events-none bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 z-50"
//           style={{
//             left: tooltipData.x + 10,
//             top: tooltipData.y - 40,
//             transform: 'translateX(-50%)',
//           }}
//         >
//           <p className="font-medium text-gray-800">{tooltipData.company}</p>
//           <p className="text-blue-600">{tooltipData.count} hires</p>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default TopRecruitersChart;