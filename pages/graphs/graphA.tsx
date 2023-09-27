// import dynamic from "next/dynamic";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import genRandomTree from "../utility/random-data-gen";

// import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
// const extraRenderers = [new CSS2DRenderer()];
type MyForceGraphProps = {
  graphData: any;
};
const graphStyle = {
  height: "100vh",
  width: "100vw",
  backgroundColor: "white",
};
type Node = {
  id: string;
  value: number;
  group?: number;
  desc?: string;
  img: string;
  x: number;
  y: number;
  imageBool: boolean;
  color: string;
  neighbors: any;

};
const MyForceGraph = ({ graphData }: MyForceGraphProps) => {
  const initForceGraph = async () => {
    const { ForceGraph2D } = await import("react-force-graph");
    return ForceGraph2D;
  }



  const fgRef = useRef<any>(null);

  const imgs = graphData.nodes.map((node: Node) => {
    if (node.imageBool == false || node.img == "" || node.img == null) {
      return;
    }
    const img = new Image();
    img.src = `./data/images/${node.img}`;
    return img;
  })
  const [images, setImages] = useState(imgs);

  const imageGraphData = {
    // links: graphData.links.map((link: any) => {
    //   const s = graphData.nodes[link.source];
    //   const t = graphData.nodes[link.target];
    //   if (!s || !t) return;
    //   !s.neighbors && (s.neighbors = []);
    //   !t.neightors && (t.neightors = []);
    //   s.neightors.push(t);
    //   t.neightors.push(s);
    //   !s.links && (s.links = []);
    //   !t.links && (t.links = []);
    //   s.links.push(link);
    //   t.links.push(link);
    //   return link;



    // }),
    links: graphData.links,

    nodes: graphData.nodes.map((node: Node, index: number) => {
      const img = images[index];
      return {
        ...node,
        img: img,
      }
    }),
  }

  // useEffect(() => {
  //   const imgs = graphData.nodes.map((node: Node) => {
  //     if (node.img == "" || node.img == null) {
  //       const img = new Image();
  //       img.src = `./data/images/placeholder.png`;
  //       return img;
  //     }
  //     const img = new Image();
  //     img.src = `./data/images/${node.img}`;
  //     return img;
  //   })
  //   setImages(imgs);
  //   console.log("images", images);
  //   console.log("imageData", imageGraphData)
  // }, [graphData.nodes]); // useEffect

  // const [highlightNodes, setHighlightNodes] = useState(new Set());
  // const [highlightLinks, setHighlightLinks] = useState(new Set());
  const hoverMode = useRef<any | null>();
  // const updateHighlight = () => {
  //   setHighlightNodes(highlightNodes);
  //   setHighlightLinks(highlightLinks);
  // };

  const handleNodeHover = (node: any) => {
    //   const { neighbors: any } = node;
    //   highlightNodes.clear();
    //   highlightLinks.clear();
    //   if (node) {
    //     highlightNodes.add(node);
    //     node.neighbors.forEach((neighbor: any) => highlightNodes.add(neighbor));
    //     node.links.forEach((link: any) => highlightLinks.add(link));
    //   }

    hoverMode.current = node ? node : null;
    // updateHighlight();
  };

  // const paintRing = useCallback((node, ctx) => {
  //   // add ring just for highlighted nodes
  //   ctx.beginPath();
  //   ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
  //   ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
  //   ctx.fill();
  // }, [hoverNode]);
  const paintRing = (node: Node, ctx: any) => {

    const { x, y, value, img } = node;
    const updatedVal = value / 1.5;
    ctx.fillStyle = "red";
    ctx.beginPath();
    // if (hoverMode.current == node) {
    //   ctx.scale(1.2, 1.2);
    // }
    const scale = node === hoverMode.current ? 1.1 : -2;
    ctx.arc(x, y, updatedVal / 2 + scale, 0, 2 * Math.PI, false);
    // ctx.fillStyle = "red";
    // ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#11C182"; ctx.stroke();
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (img == "" || img == null) {
      ctx.beginPath();
      ctx.arc(x, y, updatedVal / 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.color;
      ctx.fill();
    } else {


      ctx.beginPath(); ctx.arc(x, y, updatedVal / 2, 0, 2 * Math.PI, false); ctx.fill();
      ctx.drawImage(img, x - updatedVal / 2, y - updatedVal / 2, updatedVal, updatedVal)
      // ctx.fill(node.color)
      ctx.strokeStyle = "#8F8F8F"
      ctx.lineWidth = 1;

      ctx.stroke();
    }

  }
  return (
    <ForceGraph2D

      width={window.innerWidth - 100}
      height={window.innerHeight - 100}
      ref={fgRef}
      graphData={imageGraphData}
      onEngineStop={() => fgRef.current?.zoomToFit(1000)}
      cooldownTicks={150}
      nodeLabel="id"
      backgroundColor="white"
      // linkWidth={1}black"}
      nodeCanvasObject={(node: Node, ctx: any) => paintRing(node, ctx)}

      nodePointerAreaPaint={(node: Node, color, ctx: any) => {
        const { x, y, value } = node;
        const updatedVal = value / 1.5;

        ctx.fillStyle = color;
        ctx.fillRect(node.x - updatedVal / 2, node.y - updatedVal / 2, updatedVal, updatedVal);
      }}

      nodeCanvasObjectMode={() => "replace"}
      linkDirectionalParticleSpeed={
        d => 0.005 / d.value}
      linkDirectionalParticles={1}
      // linkDirectionalArrowLength={3.5}
      linkDirectionalParticleColor={() => "orange"}
      linkDirectionalParticleWidth={node => 4 - node.value}
      // linkCurvature={link => link.curvature}
      // d3VelocityDecay={.2}
      // d3AlphaMin={0.1}
      // dagNodeFilter={(node: Node) => node.value > 70}
      dagLevelDistance={75}

      onNodeHover={handleNodeHover}
    />
  );
};
export default MyForceGraph;
