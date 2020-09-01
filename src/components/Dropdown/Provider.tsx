import React, { createContext, useState, useCallback, useEffect } from 'react';

export interface RegisterData {
  id: number;
  optionDimensions: DOMRect;
  contentDimensions?: DOMRect;
  optionCenterX: number;
  WrappedContent: React.FC;
  backgroundHeight: number;
}

interface AuthContextData {
  options: RegisterData[];
  targetId: number | null;
  setTargetId: React.Dispatch<React.SetStateAction<number | null>>;
  cachedId: number | null;
  setCachedId: React.Dispatch<React.SetStateAction<number | null>>;
  registerOption(data: RegisterData): void;
  updateOptionProps(optionId: number, props: Object): void;
  getOptionById(id: number): RegisterData | undefined;
  deleteOptionById(id: number): void;
}

const Context = createContext<AuthContextData>({} as AuthContextData);

const DropdownProvider: React.FC = ({ children }) => {
  const [options, setOptions] = useState<RegisterData[]>([]);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [cachedId, setCachedId] = useState<number | null>(null);

  const registerOption = useCallback(({
    id,
    optionDimensions,
    optionCenterX,
    WrappedContent,
    backgroundHeight,
  }: RegisterData) => {
    setOptions((items) => [
      ...items,
      {
        id,
        optionDimensions,
        optionCenterX,
        WrappedContent,
        backgroundHeight,
      },
    ]);
  }, [setOptions]);

  const updateOptionProps = useCallback((optionId, props) => {
    setOptions(items => 
      items.map(item => {
        if(item.id === optionId) {
          item = { ...item, ...props }
        }

        return item;
      })  
    )
  }, [setOptions]);

  const getOptionById = useCallback((id: number) => {
    const foundOption = options.find(item => item.id === id);
    return foundOption;
  }, [options]);

  const deleteOptionById = useCallback((id) => {
    setOptions(items => items.filter(item => item.id !== id));
  }, [setOptions]);

  useEffect(() => {
    if (targetId !== null) {
      setCachedId(targetId);
    }
  }, [targetId]);

  return (
    <Context.Provider value={{
      registerOption,
      updateOptionProps,
      getOptionById,
      deleteOptionById,
      options,
      targetId,
      setTargetId,
      cachedId,
      setCachedId,
    }}>
      {children}
    </Context.Provider>
  );
}

export { DropdownProvider, Context };
