// import dynamic from "next/dynamic";
import React, { useState, useEffect, useMemo } from "react";
import { ForceGraph2D } from "react-force-graph";
// import * as THREE from "three";
// import { random } from "cypress/types/lodash";
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
const MyForceGraph = ({ graphData }: MyForceGraphProps) => {
  type Node = {
    id: string;
    value: number;
    group?: number;
    desc?: string;
    img: string;
    x: number;
    y: number;

  };



  const imgs = graphData.nodes.map((node: Node) => {
    if (node.img == "" || node.img == null) {
      return;
    }
    const img = new Image();
    img.src = `./data/images/${node.img}`;
    return img;
  })
  const [images, setImages] = useState(imgs);

  const imageGraphData = {
    nodes: graphData.nodes.map((node: Node, index: number) => {
      const img = images[index];
      return {
        ...node,
        img: img,
      }
    }),
    links: graphData.links,
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


  return (
    <ForceGraph2D
      graphData={imageGraphData}
      nodeLabel="id"
      backgroundColor="white"
      // linkWidth={1}black"}
      nodeCanvasObject={(node: Node, ctx: any) => {
        const { x, y, value, img } = node;
        ctx.fillStyle = "red";
        if (img == "" || img == null) {
          ctx.beginPath();
          ctx.arc(x, y, value, 0, 2 * Math.PI, false);
          ctx.fill();
        } else {

          ctx.drawImage(img, x - value / 2, y - value / 2, value, value)
        }
      }}
      nodePointerAreaPaint={(node: Node, color, ctx: any) => {
        const { x, y, value } = node;
        ctx.fillStyle = color;
        ctx.fillRect(node.x - value / 2, node.y - value / 2, value, value);
      }}
      nodeCanvasObjectMode={() => "before"}
      linkDirectionalParticleSpeed={0.01}
    // linkDirectionalArrowLength={3.5}

    />
  );
};
export default MyForceGraph;
