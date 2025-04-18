import React from 'react';
import { Network, Node, Edge, IdType } from 'vis-network';

interface NetworkNode extends Node {
  id: IdType;
}

interface NetworkEdge extends Edge {
  id: IdType;
  from: IdType;
  to: IdType;
}

export function highlightNodesEdges(
  networkInstanceRef: React.MutableRefObject<Network | null>,
  nodeId: IdType
) {
  const connectedNodes =
    networkInstanceRef.current?.getConnectedNodes(nodeId) || [];
  let nodeUpdateArray: any[] = [];
  let edgeUpdateArray: any[] = [];

  // Update node colors
  networkInstanceRef.current?.body.data.nodes.get().forEach(function (
    node: NetworkNode
  ) {
    if (connectedNodes.includes(node?.id) || node.id === nodeId) {
      nodeUpdateArray.push({ id: node.id, color: { background: '#97c2fc' } });
    } else {
      nodeUpdateArray.push({
        id: node.id,
        color: { background: 'lightgray', border: 'lightgray' }
      });
    }
  });

  // Update edge colors
  networkInstanceRef.current?.body.data.edges.get().forEach(function (
    edge: NetworkEdge
  ) {
    if (
      edge.from === nodeId ||
      edge.to === nodeId ||
      connectedNodes.includes(edge?.from)
    ) {
      edgeUpdateArray.push({
        id: edge.id,
        color: {
          color: '#648fc9',
          highlight: '#648fc9',
          hover: '#648fc9',
          opacity: 1
        }
      });
    } else {
      edgeUpdateArray.push({
        id: edge.id,
        color: {
          color: 'lightgray',
          highlight: 'lightgray',
          hover: 'lightgray'
        }
      });
    }
  });

  networkInstanceRef.current?.body.data.nodes.update(nodeUpdateArray);
  networkInstanceRef.current?.body.data.edges.update(edgeUpdateArray);
}

export function resetNodesColor(
  networkInstanceRef: React.MutableRefObject<Network | null>,
  defaultColor: string = '#97c2fc'
) {
  // Reset node colors
  const nodeUpdateArray = networkInstanceRef.current?.body.data.nodes
    .get()
    .map((node: NetworkNode) => ({
      id: node.id,
      color: { background: defaultColor, border: defaultColor }
    }));

  // Reset edge colors
  const edgeUpdateArray = networkInstanceRef.current?.body.data.edges
    .get()
    .map((edge: NetworkEdge) => ({
      id: edge.id,
      color: {
        color: '#648fc9',
        highlight: '#648fc9',
        hover: '#648fc9',
        opacity: 1
      }
    }));

  if (nodeUpdateArray) {
    networkInstanceRef.current?.body.data.nodes.update(nodeUpdateArray);
  }
  if (edgeUpdateArray) {
    networkInstanceRef.current?.body.data.edges.update(edgeUpdateArray);
  }
}

export const canZoomView = (network: React.MutableRefObject<Network | null>) =>
  network.current?.setOptions?.({
    interaction: {
      zoomView: true
    }
  });
