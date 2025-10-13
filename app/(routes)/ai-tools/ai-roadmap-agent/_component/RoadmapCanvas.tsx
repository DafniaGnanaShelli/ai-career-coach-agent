import React, { useState, useCallback } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
    Background,
    Controls,
    MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';
function RoadmapCanvas({ initialNodes = [], initialEdges = [] }: any) {
    const fixedNodes = initialNodes.map((n: any) => ({
        ...n,
        type: n.type === 'default' ? 'turbo' : n.type,
    }));

    const fixedEdges = initialEdges.map((e: any) => ({
        ...e,
        sourceHandle: e.sourceHandle || 'output',
        targetHandle: e.targetHandle || 'input',
    }));

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={fixedNodes}
                edges={fixedEdges}
                nodeTypes={{ turbo: TurboNode }}
                fitView
            >
                <Controls />
                {/* <MiniMap />
        @ts-ignore */}
                <Background variant='dots' gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}


export default RoadmapCanvas;
