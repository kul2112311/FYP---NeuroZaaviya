import { useEffect } from "react";
import { EisenhowerMatrix } from "./Eisenhowermatrix.jsx";

export function EisenhowerMatrixPage() {
  useEffect(() => {
    window.addEventListener("eisenhowerSaved", () => {
      console.log("Tasks saved");
    });
  }, []);

  return <EisenhowerMatrix />;
}