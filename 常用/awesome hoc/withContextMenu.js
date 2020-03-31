import React, { useState, useRef } from "react";

/**
 * if you have multiple responsive area,
 * you should set an outer MenuComponent
 * rather than bind it in this function.
 * @param  WrappedComponent:【Required】
 * @param  renderMenu:【Required】Render function.
 */
export default function bindRightClickMenu(WrappedComponent, renderMenu) {
  return props => {
    const myRef = useRef(null);
    const childRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState([0, 0]); // Mouse Position
    let menuDOMOffset = null; // store the MenuComponent's offset

    const onContextMenu = e => {
      e.preventDefault();
      setVisible(true);
      setPos([e.clientX, e.clientY]);
    };

    const handleCancel = evt => {
      if (!renderMenu) return;
      const [a, b] = pos;
      const { clientX, clientY } = evt;
      const menuDOM = childRef.current;
      window.mytacdom = menuDOM;

      if (!menuDOMOffset) {
        const { offsetWidth, offsetHeight } = menuDOM;
        menuDOMOffset = [offsetWidth, offsetHeight];
      }

      const [width, height] = menuDOMOffset;
      // checkout if the element except for the MenuComponent has been clicked.
      const wasOut = !(
        clientX >= a &&
        clientX <= a + width &&
        clientY >= b &&
        clientY <= b + height
      );
      if (wasOut) {
        setVisible(false);
      }
    };

    const style = { position: "absolute" };
    const [left, top] = pos;

    return (
      <div ref={myRef} onContextMenu={onContextMenu} onClick={handleCancel}>
        <WrappedComponent {...props}></WrappedComponent>
        <div ref={childRef} style={{ ...style, left, top }}>
          {visible && renderMenu && renderMenu()}
        </div>
      </div>
    );
  };
}
