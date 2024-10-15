import { AppState } from '@excalidraw/excalidraw/types/types';

export function extractPositionalState(appState: AppState) {
  if (appState == null) {
    return {};
  }

  return {
    scrollX: appState.scrollX,
    scrollY: appState.scrollY,
    zoom: appState.zoom,
    offsetLeft: appState.offsetLeft,
    offsetTop: appState.offsetTop,
    width: appState.width,
    height: appState.height,
  };
}
