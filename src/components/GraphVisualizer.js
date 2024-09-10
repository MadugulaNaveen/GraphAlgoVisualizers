import React, { useState, useEffect } from "react";
import "../stylesheets/GridComponent.css";
import Draggable from "react-draggable";

const GraphVisualizer = ({ numNodes = 5, initialEdges = [], isDirected = false }) => {
  const [edges, setEdges] = useState(initialEdges);
  const [positions, setPositions] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState([]); // To highlight visited nodes
  const [currentNode, setCurrentNode] = useState(null); // Track current node for BFS/DFS

  // Calculate initial positions of nodes arranged in a square grid
  const calculateNodePositions = () => {
    const positions = [];
    const gridSize = Math.ceil(Math.sqrt(numNodes)); // Calculate grid size
    const spacing = 150; // Space between nodes

    for (let i = 0; i < numNodes; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const x = col * spacing + 100; // Horizontal spacing
      const y = row * spacing + 100; // Vertical spacing
      positions.push({ x, y, id: i });
    }
    return positions;
  };

  // Update node positions when the graph is created
  useEffect(() => {
    setPositions(calculateNodePositions());
  }, [numNodes]);

  const handleDrag = (e, data, id) => {
    const newPositions = positions.map(pos => 
      pos.id === id ? { ...pos, x: data.x, y: data.y } : pos
    );
    setPositions(newPositions);
  };

  // BFS Algorithm
  const bfs = (startNode) => {
    const visited = new Array(numNodes).fill(false);
    const queue = [startNode];
    const visitOrder = [];

    visited[startNode] = true;
    visitOrder.push(startNode);

    while (queue.length > 0) {
      const node = queue.shift();
      edges.forEach((edge) => {
        if (edge.from === node && !visited[edge.to]) {
          visited[edge.to] = true;
          queue.push(edge.to);
          visitOrder.push(edge.to);
        }
        if (!isDirected && edge.to === node && !visited[edge.from]) {
          visited[edge.from] = true;
          queue.push(edge.from);
          visitOrder.push(edge.from);
        }
      });
    }
    return visitOrder;
  };

  // DFS Algorithm
  const dfs = (startNode) => {
    const visited = new Array(numNodes).fill(false);
    const stack = [startNode];
    const visitOrder = [];

    visited[startNode] = true;
    visitOrder.push(startNode);

    while (stack.length > 0) {
      const node = stack.pop();
      edges.forEach((edge) => {
        if (edge.from === node && !visited[edge.to]) {
          visited[edge.to] = true;
          stack.push(edge.to);
          visitOrder.push(edge.to);
        }
        if (!isDirected && edge.to === node && !visited[edge.from]) {
          visited[edge.from] = true;
          stack.push(edge.from);
          visitOrder.push(edge.from);
        }
      });
    }
    return visitOrder;
  };

  // Start BFS or DFS
  const handleAlgorithm = (algorithm) => {
    let visitOrder;
    if (currentNode !== null) {
      if (algorithm === "bfs") {
        visitOrder = bfs(currentNode);
      } else if (algorithm === "dfs") {
        visitOrder = dfs(currentNode);
      }

      // Animate the visit order
      animateTraversal(visitOrder);
    }
  };

  // Visualize the traversal by highlighting nodes in order
  const animateTraversal = (visitOrder) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= visitOrder.length) {
        clearInterval(interval);
        return;
      }
      setVisitedNodes((prev) => [...prev, visitOrder[i]]);
      i++;
    }, 1000); // Delay between node visits (1 second)
  };

  return (
    <div className="graph-visualizer">
      <h1>Graph Visualizer</h1>
      
      <h3>Select Start Node</h3>
      <input
        type="number"
        placeholder="Start Node"
        value={currentNode}
        onChange={(e) => setCurrentNode(parseInt(e.target.value))}
      />

      <button onClick={() => handleAlgorithm("bfs")}>Start BFS</button>
      <button onClick={() => handleAlgorithm("dfs")}>Start DFS</button>

      <div className="graph-container">
        <svg width="600" height="600">
          {isDirected && (
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                fill="black"
              >
                <path d="M0,0 L0,6 L9,3 z" />
              </marker>
            </defs>
          )}

          {edges.map((edge, index) => {
            const fromNode = positions.find((node) => node.id === edge.from);
            const toNode = positions.find((node) => node.id === edge.to);

            if (!fromNode || !toNode) return null;

            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (dx / dist) * 20;
            const offsetY = (dy / dist) * 20;

            return (
              <line
                key={index}
                x1={fromNode.x + offsetX}
                y1={fromNode.y + offsetY}
                x2={toNode.x - offsetX}
                y2={toNode.y - offsetY}
                stroke="black"
                strokeWidth="2"
                markerEnd={isDirected ? "url(#arrow)" : undefined}
              />
            );
          })}

          {positions.map((pos) => (
            <Draggable
              key={pos.id}
              position={{ x: pos.x, y: pos.y }}
              onDrag={(e, data) => handleDrag(e, data, pos.id)}
            >
              <g>
                <circle
                  cx={0}
                  cy={0}
                  r="20"
                  fill={visitedNodes.includes(pos.id) ? "orange" : "lightblue"}
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  fill="black"
                  fontWeight="bold"
                  fontSize="16px"
                >
                  {pos.id}
                </text>
              </g>
            </Draggable>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default GraphVisualizer;
