import { createContext, useContext, useEffect, useState } from 'react';

type SettingsContextProps = {
  editorSettings: EditorSettings
  updateEditorSettings: <T extends keyof EditorSettings>(key: T, value: EditorSettings[T]) => void;
};

type EditorSettings = {
  vimEnabled?: boolean;
}

const SettingsContext = createContext({} as SettingsContextProps);

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    vimEnabled: false,
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
