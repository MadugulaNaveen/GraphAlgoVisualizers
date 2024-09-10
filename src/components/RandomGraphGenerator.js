import React, { useState } from "react";
import GraphVisualizer from "./GraphVisualizer";

const RandomGraphGenerator = () => {
  const [numNodes, setNumNodes] = useState(5);
  const [numEdges, setNumEdges] = useState(5);
  const [isDirected, setIsDirected] = useState(false);
  const [graphData, setGraphData] = useState(null); // Store generated graph data

  // Function to generate a random graph
  const generateRandomGraph = () => {
    const edges = [];
    const edgeSet = new Set(); // To avoid duplicate edges

    while (edges.length < numEdges) {
      const from = Math.floor(Math.random() * numNodes);
      const to = Math.floor(Math.random() * numNodes);

      if (from !== to) {
        const edgeKey = isDirected ? `${from}-${to}` : `${Math.min(from, to)}-${Math.max(from, to)}`;
        
        // Only add unique edges
        if (!edgeSet.has(edgeKey)) {
          edges.push({ from, to });
          edgeSet.add(edgeKey);
        }
      }
    }

    // Set the generated graph data
    setGraphData({
      nodes: numNodes,
      edges,
      isDirected,
    });
  };

  return (
    <div>
      <h1>Random Graph Generator</h1>
      <div>
        <label>Number of Nodes: </label>
        <input
          type="number"
          value={numNodes}
          onChange={(e) => setNumNodes(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Number of Edges: </label>
        <input
          type="number"
          value={numEdges}
          onChange={(e) => setNumEdges(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Directed Graph: </label>
        <input
          type="checkbox"
          checked={isDirected}
          onChange={() => setIsDirected(!isDirected)}
        />
      </div>
      <button onClick={generateRandomGraph}>Generate Graph</button>

      {/* If graph is generated, pass data to GraphVisualizer */}
      {graphData && (
        <GraphVisualizer
          numNodes={graphData.nodes}
          initialEdges={graphData.edges}
          isDirected={graphData.isDirected}
        />
      )}
    </div>
  );
};

export default RandomGraphGenerator;
