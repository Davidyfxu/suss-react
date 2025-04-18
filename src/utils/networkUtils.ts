import React from 'react';
import { Network } from 'vis-network';

export function highlightNodesEdges(
  networkInstanceRef: React.MutableRefObject<Network | null>,
  nodeId: number | string
) {
  const connectedNodes = networkInstanceRef.current?.getConnectedNodes(nodeId);
  let updateArray: any[] = [];
  networkInstanceRef.current?.body.data.nodes.get().forEach(function (node) {
    if (connectedNodes.includes(node.id) || node.id === nodeId) {
      updateArray.push({ id: node.id, color: { background: '#97c2fc' } });
    } else {
      updateArray.push({
        id: node.id,
        color: { background: 'lightgray', border: 'lightgray' }
      });
    }
  });
  networkInstanceRef.current?.body.data.nodes.update(updateArray);
}
export function resetNodesColor(
  networkInstanceRef: React.MutableRefObject<Network | null>,
  defaultColor: string = '#97c2fc'
) {
  const updateArray = networkInstanceRef.current?.body.data.nodes
    .get()
    .map((node) => ({
      id: node.id,
      color: { background: defaultColor, border: defaultColor }
    }));
  if (updateArray) {
    networkInstanceRef.current?.body.data.nodes.update(updateArray);
  }
}
export const canZoomView = (network: React.MutableRefObject<Network | null>) =>
  network.current?.setOptions?.({
    interaction: {
      zoomView: true
    }
  });
