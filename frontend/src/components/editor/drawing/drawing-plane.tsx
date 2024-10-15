import useLibrary from '@/hooks/use-library';
import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { extractPositionalState } from './helpers/extract-positional-data';

export default function DrawingPlane() {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const { file, setFile, onSave } = useEditor();
  const { editorSettings } = useSettings();

  const { libraryItems, onLibraryChange } = useLibrary();

  const initialData = useMemo(() => {
    const data: ExcalidrawInitialDataState = {
      elements: [],
    }

    if (!file?.length) return data;

    try {
      const parsed = JSON.parse(file);
      data.elements = parsed.elements;
      data.appState = extractPositionalState(parsed.appState);
    } catch (error) {
      console.log(error);
    }

    return data;
  }, [file]);

  const handleKeyboardEvents = useCallback((event: KeyboardEvent) => {
    if (!api) return;

    if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSave();
    }
  }, [api, onSave]);

  const handleMouseEvents = useCallback(() => {
    let newContent: string | null = null;
    let isDirty = false;
    if (api) {
      const appStateString = JSON.stringify({
        elements: api.getSceneElements(),
        appState: extractPositionalState(api.getAppState())
      }, null, 2);
      if (appStateString !== file) {
        newContent = appStateString;
        setFile(newContent, { ignoreDirtyCheck: editorSettings.saveOnBlur ?? false });
        isDirty = true;
      }
    }

    if (editorSettings.saveOnBlur && isDirty) {
      onSave(newContent);
    }
  }, [editorSettings, api, file, onSave, setFile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvents);
    window.addEventListener('auxclick', handleMouseEvents);
    window.addEventListener('mouseup', handleMouseEvents)

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvents);
      window.removeEventListener('auxclick', handleMouseEvents);
      window.removeEventListener('mouseup', handleMouseEvents);
    }
  }, [handleKeyboardEvents, handleMouseEvents]);

  if (file == null) return null;

  return (
    <Excalidraw
      excalidrawAPI={setApi}
      theme='dark'
      initialData={{
        elements: initialData.elements,
        appState: initialData.appState,
        libraryItems,
      }}
      onLibraryChange={onLibraryChange}
      UIOptions={{
        canvasActions: {
          saveToActiveFile: false,
        }
      }}
    />
  );
}
