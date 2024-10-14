import { createContext } from 'react';
import { ItemType } from './data/provider';

type RootAddItemContextProps = {
  addingItem: ItemType | false;
  setAddingItem: (item: ItemType | false) => void;
}

export const RootAddItemContext = createContext({} as RootAddItemContextProps);
