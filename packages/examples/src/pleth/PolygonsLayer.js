import React, { useRef, useLayoutEffect } from 'react';

// For HiDPI Canvas rendering.
// Makes it look still crisp even after browser zoom in.
const defaultScaleFactor = 2;

export const PolygonsLayer = ({
  fillStyle,
  strokeStyle,
  scaleFactor = defaultScaleFactor,
}) => {
  const Component = ({ width, height, geometries, projection, path }) => {
    const ref = useRef();
    width *= scaleFactor;
    height *= scaleFactor;

    useLayoutEffect(() => {
      if (!geometries) return;

      // Adjust the scale and translate for this layer's resolution.
      const oldScale = projection.scale();
      const oldTranslate = projection.translate();
      projection
        .scale(oldScale * scaleFactor)
        .translate([
          oldTranslate[0] * scaleFactor,
          oldTranslate[1] * scaleFactor,
        ]);

      // Draw the shapes.
      const context = ref.current.getContext('2d');
      path.context(context);
      context.beginPath();
      path(geometries);
      if (fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
      }
      if (strokeStyle) {
        context.strokeStyle = strokeStyle;
        context.stroke();
      }
      path.context(null);

      // Restore the old scale and translate.
      projection.scale(oldScale).translate(oldTranslate);
    }, [
      width,
      height,
      geometries,
      projection,
      scaleFactor,
      path,
      strokeStyle,
      fillStyle,
    ]);

    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{
          width: width / scaleFactor + 'px',
          height: height / scaleFactor + 'px',
        }}
      />
    );
  };
  return Component;
};
