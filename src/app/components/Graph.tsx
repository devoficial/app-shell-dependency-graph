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
        const height = 2400;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(180,0)")

        const root: any = d3.hierarchy({
            name: "Packages",
            children: Object.entries(data).map(([dep, apps]) => ({
                name: dep,
                children: apps.map(app => ({ name: app }))
            }))
        });


        const tree = d3.cluster()
        .size([height, width - width / 2]);
        // .separation((a, b) => (a.parent === b.parent ? 10 : 12) / a.depth);

        tree(root);


        const link = svg.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", (d: any) => `
                M${d.target.y},${d.target.x}
                C${d.source.y +  100},${d.target.x}
                 ${d.source.y + 200},${d.source.x}
                 ${d.source.y},${d.source.x}
            `);


        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", (d: any) => `translate(${d.y},${d.x})`)

        node.append("circle")
            .attr("r", 2.5);

            node.append("text")
            .attr("dy", ".31em")
            .attr("x", (d: any) => d.children ? -6 : 8) // Adjust x offset
            // .attr("y) // Adjust y offset
            .attr("text-anchor", (d: any) => d.children ? "end" : "start")
            .text((d: any) => d.data.name)
            .style("font-size", "10px");

    }, []);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default Graph;
