'use client'
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import './graph.css';

interface AppData
{
    [dep: string]: string[];
}

const Graph: React.FC<{ data: AppData }> = ({ data }) =>
{
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() =>
    {
        if (!svgRef.current) return;

        const width = 1800;
        const height = width;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(180,0)")

        const root: any = d3.hierarchy({
            name: "Dependencies",
            children: Object.entries(data).map(([dep, apps]) => ({
                name: dep,
                children: apps.map(app => ({ name: app }))
            }))
        });

        const tree = d3.cluster()
        .size([height, width - width / 2])
        // .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

        tree(root);

        const link = svg.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d => `
                M${d.target.y},${d.target.x}
                C${d.source.y +  100},${d.target.x}
                 ${d.source.y + 200},${d.source.x}
                 ${d.source.y},${d.source.x}
            `);


        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`)

        node.append("circle")
            .attr("r", 2.5);

            node.append("text")
            .attr("dy", ".31em")
            .attr("x", d => d.children ? -6 : 8) // Adjust x offset
            .attr("y", 2) // Adjust y offset
            .attr("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name)
            .style("font-size", "10px");

    }, []);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default Graph;
