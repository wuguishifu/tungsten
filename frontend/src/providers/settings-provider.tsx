import { createContext, useContext, useEffect, useState } from 'react';

type SettingsContextProps = {
  editorSettings: EditorSettings
  updateEditorSettings: <T extends keyof EditorSettings>(key: T, value: EditorSettings[T]) => void;
};

export type EditorSettings = {
  vimEnabled?: boolean;
  saveOnBlur?: boolean;
  showPreview?: boolean;
  showEditor?: boolean;
}

const SettingsContext = createContext({} as SettingsContextProps);

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    vimEnabled: false,
    saveOnBlur: true,
    showPreview: true,
    showEditor: true,
  });

  function updateEditorSettings<T extends keyof EditorSettings>(key: T, value: EditorSettings[T]) {
    const newSettings = { ...editorSettings, [key]: value };
    setEditorSettings(newSettings);
    localStorage.setItem('editorSettings', JSON.stringify(newSettings));
  }

  useEffect(() => {
    const storedSettings = localStorage.getItem('editorSettings');
    if (storedSettings) {
      setEditorSettings(JSON.parse(storedSettings));
    }
  }, []);

  const value = {
    editorSettings,
    updateEditorSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
