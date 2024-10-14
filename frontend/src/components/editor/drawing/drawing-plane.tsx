import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function DrawingPlane() {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const { file, setFile, onSave } = useEditor();
  const { editorSettings } = useSettings();

  const initialData = useMemo(() => {
    if (!file?.length) return { elements: [] };

    let elements = [];
    let appState = undefined;
    try {
      const parsed = JSON.parse(file);
      elements = parsed.elements;
      appState = parsed.appState;
    } catch (error) {
      console.log(error);
    }

    delete appState.collaborators;

    return { elements, appState };
  }, [file]);

  const handleKeyboardEvents = useCallback((event: KeyboardEvent) => {
    if (!api) return;

    if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSave();
    }
  }, [api, onSave]);

  const handleMouseEvents = useCallback((event: MouseEvent) => {
    let newContent: string | null = null;
    let isDirty = false;
    if (api) {
      const appStateString = JSON.stringify({ elements: api.getSceneElements(), appState: api.getAppState() }, null, 2);
      if (appStateString !== file) {
        newContent = appStateString;
        setFile(newContent, { ignoreDirtyCheck: editorSettings.saveOnBlur ?? false });
        isDirty = true;
      }
    }

    if (event.button === 0) {
      if (editorSettings.saveOnBlur && isDirty) {
        onSave(newContent);
      }
    }
  }, [editorSettings, api, file, onSave, setFile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvents);
    window.addEventListener('mouseup', handleMouseEvents)

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvents);
      window.removeEventListener('mouseup', handleMouseEvents);
    }
  }, [handleKeyboardEvents, handleMouseEvents]);

  if (file == null) return null;

  return (
    <Excalidraw
      excalidrawAPI={setApi}
      theme='dark'
      initialData={initialData}
      UIOptions={{
        canvasActions: {
          saveToActiveFile: false,
        }
      }}
    />
  );
}
