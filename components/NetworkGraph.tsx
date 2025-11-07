'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Panel,
  useReactFlow,
  Connection,
  MarkerType,
  NodeProps,
  addEdge,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Types
interface NodeData {
  label: string;
  description?: string;
  icon?: string;
  bgColor?: string;
  borderColor?: string;
  level?: number;
  completed?: boolean;
  links?: Array<{ label: string; url: string }>;
}

interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

interface NetworkGraphProps {
  className?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  roadmapTitle?: string;
  description?: string;
}

// Custom Node Component
const CustomNode = ({ data, selected, type }: CustomNodeProps) => {
  const isStartNode = type === 'input';
  const isEndNode = type === 'output';
  const nodeColor = data.bgColor || '#3b82f6';

  return (
    <div 
      className={`relative w-64 bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md ${
        isStartNode ? 'ring-2 ring-blue-200' : ''
      } ${selected ? 'border-blue-400' : 'border-gray-100'}`}
      style={{
        background: data.bgColor ? `linear-gradient(135deg, ${data.bgColor})` : 'white',
        borderColor: data.borderColor || '#e5e7eb',
      }}
    >
      {/* Node Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-opacity-90">
        <div className="flex items-center gap-2">
          {data.icon && <span className="text-white text-lg">{data.icon}</span>}
          <h3 className="text-sm font-semibold text-white">
            {data.label}
          </h3>
        </div>
        {isStartNode && (
          <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-0.5 rounded-full">
            Start
          </span>
        )}
      </div>
      
      {/* Node Content */}
      <div className="p-4 bg-white">
        {data.description && (
          <p className="text-sm text-gray-600 mb-3">
            {data.description}
          </p>
        )}
        {/* @ts-ignore */}
        {data.links?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="space-y-1">
                        {/* @ts-ignore */}
              {data.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {link.label || 'Learn more'}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Default node and edge styles
const nodeDefaults = {
  type: 'custom' as const,
  style: {
    padding: 0,
    border: '1px solid #e5e7eb',
    background: 'white',
  },
};

const edgeDefaults = {
  type: 'smoothstep' as const,
  animated: true,
  style: { 
    stroke: '#6366f1',
    strokeWidth: 2.5,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#6366f1',
    width: 20,
    height: 20,
  },
};

// Default nodes and edges
const defaultNodes: Node[] = [
  {
    ...nodeDefaults,
    id: 'resume',
    type: 'input',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Resume',
      description: 'Build and optimize your professional resume',
      icon: '📄',
      bgColor: '#8b5cf6, #6d28d9',
      borderColor: '#7c3aed',
    },
  },
  {
    ...nodeDefaults,
    id: 'cover-letter',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Cover Letter',
      description: 'Create a compelling cover letter',
      icon: '✍️',
      bgColor: '#ec4899, #db2777',
      borderColor: '#e11d8f',
    },
  },
  {
    ...nodeDefaults,
    id: 'interview',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Interview Prep',
      description: 'Prepare for technical and behavioral interviews',
      icon: '💼',
      bgColor: '#f59e0b, #d97706',
      borderColor: '#ea580c',
    },
  },
  {
    ...nodeDefaults,
    id: 'networking',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Networking',
      description: 'Connect with professionals in your field',
      icon: '🌐',
      bgColor: '#10b981, #059669',
      borderColor: '#059669',
    },
  },
  {
    ...nodeDefaults,
    id: 'offer',
    type: 'output',
    position: { x: 0, y: 0 },
    data: { 
      label: 'Job Offer',
      description: 'Receive and evaluate job offers',
      icon: '🎯',
      bgColor: '#3b82f6, #6366f1',
      borderColor: '#2563eb',
    },
  },
];

const defaultEdges: Edge[] = [
  { 
    ...edgeDefaults,
    id: 'resume-cover',
    source: 'resume', 
    target: 'cover-letter',
  },
  { 
    ...edgeDefaults,
    id: 'cover-interview',
    source: 'cover-letter', 
    target: 'interview',
  },
  { 
    ...edgeDefaults,
    id: 'interview-networking',
    source: 'interview', 
    target: 'networking',
  },
  { 
    ...edgeDefaults,
    id: 'networking-offer',
    source: 'networking', 
    target: 'offer',
  },
];

// Helper function to normalize node data (handle title vs label)
const normalizeNodeData = (node: Node): Node => {
  if (!node || !node.data) return node;
  
  // If node has 'title' but not 'label', convert title to label
  // @ts-ignore
  if (node.data.title && !node.data.label) {
    return {
      ...node,
      data: {
        ...node.data,
        // @ts-ignore
        label: node.data.title,
      }
    };
  }
  
  return node;
};

// Helper function to normalize edge data
const normalizeEdgeData = (edge: Edge): Edge => {
  if (!edge) return edge;
  
  // Ensure edge has proper styling and type
  return {
    ...edgeDefaults,
    ...edge,
    style: {
      ...edgeDefaults.style,
      ...(edge.style || {}),
    },
    markerEnd: edge.markerEnd || edgeDefaults.markerEnd,
  };
};

// Helper function to calculate node positions
const calculateNodePositions = (nodes: Node[], edges: Edge[]) => {
  // Normalize and filter out any null/undefined nodes AND nodes with invalid data
  const validNodes = nodes
    .map(normalizeNodeData)
    .filter(node => 
      node && 
      node.id && 
      node.data && 
      node.data.label && 
      node.data.label.trim() !== ''
    );
  
  if (validNodes.length === 0) {
    return [];
  }
  
  const nodeMap = new Map(validNodes.map(node => [node.id, node]));
  
  // Initialize children and parent maps
  const childrenMap = new Map<string, string[]>(validNodes.map(node => [node.id, []]));
  const parentMap = new Map<string, string>();
  
  // Build parent-child relationships from valid edges only
  const validEdges = edges.filter(edge => 
    edge && 
    edge.source && 
    edge.target && 
    nodeMap.has(edge.source as string) && 
    nodeMap.has(edge.target as string)
  );
  
  validEdges.forEach(edge => {
    childrenMap.get(edge.source as string)?.push(edge.target as string);
    parentMap.set(edge.target as string, edge.source as string);
  });
  
  // Find root nodes (nodes with no incoming edges)
  let rootNodes = validNodes.filter(node => !parentMap.has(node.id));
  if (rootNodes.length === 0 && validNodes.length > 0) {
    rootNodes = [validNodes[0]];
  }
  
  // Calculate positions using improved hierarchical layout
  const nodeWidth = 280;
  const nodeHeight = 180;
  const horizontalSpacing = 120;
  const verticalSpacing = 250;
  
  // Group nodes by level
  const levelGroups = new Map<number, string[]>();
  const visited = new Set<string>();
  
  const assignLevels = (nodeId: string, level: number) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(nodeId);
    
    const children = childrenMap.get(nodeId) || [];
    children.forEach(childId => assignLevels(childId, level + 1));
  };
  
  // Assign levels starting from root nodes
  rootNodes.forEach(root => assignLevels(root.id, 0));
  
  // Position nodes by level with better centering
  levelGroups.forEach((nodeIds, level) => {
    const nodesInLevel = nodeIds.length;
    const totalWidth = (nodesInLevel - 1) * (nodeWidth + horizontalSpacing);
    const startX = -totalWidth / 2;
    
    nodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId);
      if (node) {
        node.position = {
          x: startX + index * (nodeWidth + horizontalSpacing),
          y: level * verticalSpacing
        };
      }
    });
  });
  
  return validNodes;
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({
  className = '',
  initialNodes: propNodes = [],
  initialEdges: propEdges = [],
  roadmapTitle = 'Career Roadmap',
  description = 'Your personalized career development path'
}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(propNodes.length > 0 ? propNodes : defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(propEdges.length > 0 ? propEdges : defaultEdges);
  
  // Update nodes and edges when props change
  useEffect(() => {
    if (propNodes.length > 0 || propEdges.length > 0) {
      const nodesToSet = propNodes.length > 0 ? propNodes : defaultNodes;
      const edgesToSet = propEdges.length > 0 ? propEdges : defaultEdges;
      
      // Normalize and filter out invalid nodes
      const normalizedNodes = nodesToSet.map(normalizeNodeData);
      const validNodesToSet = normalizedNodes.filter(node => 
        node && node.id && node.data && node.data.label && node.data.label.trim() !== ''
      );
      
      // Normalize and validate edges
      const normalizedEdges = edgesToSet.map(normalizeEdgeData);
      const validEdgesToSet = normalizedEdges.filter(edge => 
        edge && edge.source && edge.target
      );
      
      const nodesWithPositions = calculateNodePositions([...validNodesToSet], validEdgesToSet);
      setNodes(nodesWithPositions);
      setEdges(validEdgesToSet);
      
      // Fit view after a short delay to ensure nodes are rendered
      const timer = setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [propNodes, propEdges, setNodes, setEdges, fitView]);
  
  // Calculate initial node positions
  useEffect(() => {
    const nodesWithPositions = calculateNodePositions([...nodes], edges);
    setNodes(nodesWithPositions);
    
    // Fit view after a short delay to ensure nodes are rendered
    const timer = setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fitView]);

  const onConnect = useCallback(

    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...edgeDefaults }, eds)),
    [setEdges]
  );

  return (
    <div className={`h-full w-full min-h-[600px] ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={{ custom: CustomNode }}
        fitView
        fitViewOptions={{ padding: 0.3, minZoom: 0.5, maxZoom: 1.5 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        defaultEdgeOptions={edgeDefaults}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background color="#e5e7eb" gap={16} />
        <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-md max-w-xs">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{roadmapTitle}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrap with ReactFlowProvider
const NetworkGraphWithProvider: React.FC<NetworkGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <NetworkGraph {...props} />
    </ReactFlowProvider>
  );
};

export default NetworkGraphWithProvider;
