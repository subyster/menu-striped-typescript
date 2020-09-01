import React, { useRef, useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useDimensions } from './dimensions';
import { Context } from './Provider';

interface DropdownOptionProps {
  name: string;
  content: React.FC;
  backgroundHeight: number;
}

let lastOptionId = 0;

const DropdownOption: React.FC<DropdownOptionProps> = ({ 
  name, 
  content: Content, 
  backgroundHeight 
}) => {
  const idRef = useRef(++lastOptionId);
  const id = idRef.current;

  const { hook: optionHook, dimensions: optionDimensions } = useDimensions();
  const [registered, setRegistered] = useState(false);

  const {
    registerOption,
    updateOptionProps,
    deleteOptionById,
    setTargetId,
    targetId,
  } = useContext(Context);

  useEffect(() => {
    if (!registered && optionDimensions) {
      const WrappedContent = () => {
        const contentRef: any = useRef<HTMLDivElement>();

        useEffect(() => {
          const contentDimensions = contentRef?.current?.getBoundingClientRect();
          updateOptionProps(id, { contentDimensions });
        }, []);

        return (
          <div ref={contentRef}>
            <Content />
          </div>
        )
      }

      registerOption({
        id,
        optionDimensions,
        optionCenterX: optionDimensions.x + optionDimensions.width / 2,
        WrappedContent,
        backgroundHeight,
      });

      setRegistered(true);
    } else if (registered && optionDimensions) {
      updateOptionProps(id, {
        optionDimensions,
        optionCenterX: optionDimensions.x + optionDimensions.width / 2,
      });
    }
  }, [
    registered, 
    optionDimensions, 
    id, 
    updateOptionProps, 
    registerOption,
    deleteOptionById,
    backgroundHeight
  ]);

  // useEffect(() => deleteOptionById(id), [deleteOptionById, id]);

  const handleOpen = () => setTargetId(id);
  const handleClose = () => setTargetId(null);
  const handleTouch = () => (window.innerHeight <= 600);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    return targetId === id ? handleClose() : handleOpen();
  }

  return (
    <motion.button 
      className="dropdown-option"
      ref={optionHook}
      onMouseDown={handleClick}
      onHoverStart={() => !(window.innerHeight <= 600) && handleOpen()}
      onHoverEnd={() => !(window.innerHeight <= 600) && handleClose()}
      onTouchStart={handleTouch}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {name}
    </motion.button>
  );
}

export { DropdownOption };