import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export default function BarcodeRenderer({ value, width = 1.5, height = 40, displayValue = true, fontSize = 12 }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, String(value), {
          format: "CODE128",
          width,
          height,
          displayValue,
          font: "monospace",
          fontSize,
          textMargin: 3,
          margin: 4,
          background: "transparent",
          lineColor: "#1e293b"
        });
      } catch (err) {
        console.error("Barcode rendering error:", err);
      }
    }
  }, [value, width, height, displayValue, fontSize]);

  if (!value) return null;

  return (
    <div className="inline-flex flex-col items-center justify-center">
      <svg ref={svgRef} className="max-w-full" />
    </div>
  );
}
