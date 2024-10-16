import ClickWithin from '@/components/click-within';
import useLibrary from '@/hooks/use-library';
import { useEditor } from '@/providers/editor-provider';
import { useSettings } from '@/providers/settings-provider';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { extractPositionalState } from './helpers/extract-positional-data';

export default function DrawingPlane() {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const { file, setFile, onSave, saveImmediately } = useEditor();
  const { editorSettings } = useSettings();

  const { libraryItems, onLibraryChange } = useLibrary();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const shouldStartTimeout = useRef(false);

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
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    }
  }, [api]);

  const handleMouseDown = useCallback((_: MouseEvent, inside: boolean) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    shouldStartTimeout.current = inside;
    if (!inside) onSave();
  }, []);

  const handleMouseUp = useCallback(() => {
    if (api) {
      const appStateString = JSON.stringify({
        elements: api.getSceneElements(),
        appState: extractPositionalState(api.getAppState()),
      }, null, 2);
      if (appStateString !== file) {
        setFile(appStateString);
      }
    }

    if (!shouldStartTimeout.current) return;
    if (editorSettings.saveOnBlur) {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveImmediately();
      }, 2000);
    }
  }, [api, editorSettings, file, setFile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvents);

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvents);
    }
  }, [handleKeyboardEvents, handleMouseUp]);

  if (file == null) return null;

  return (
    <ClickWithin
      className='w-full h-full'
      onClick={handleMouseDown}
      onRelease={handleMouseUp}
    >
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
    </ClickWithin>
  );
}
