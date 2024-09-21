import { createContext } from 'react';
import { DataType } from './data-provider';

type RootAddItemContextProps = {
  addingItem: DataType | false;
  setAddingItem: (item: DataType | false) => void;
}

export const RootAddItemContext = createContext({} as RootAddItemContextProps);
