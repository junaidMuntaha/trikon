// components/MathEditor.jsx
import React, { useEffect, useRef } from "react";
import { renderMathInElement } from "katex";
import "katex/dist/katex.min.css";
import "mathlive";

const MathEditor = ({ value, onChange }) => {
  const mathfieldRef = useRef(null);

  useEffect(() => {
    if (mathfieldRef.current) {
      mathfieldRef.current.setValue(value || "");
      mathfieldRef.current.addEventListener("input", (ev) => {
        onChange(ev.target.value);
      });
    }
  }, [mathfieldRef.current]);

  return (
    <div>
      <math-field
        ref={mathfieldRef}
        virtual-keyboard-mode="onfocus"
        style={{ width: "100%", minHeight: "3rem", fontSize: "1.2rem" }}
      ></math-field>
    </div>
  );
};

export default MathEditor;
