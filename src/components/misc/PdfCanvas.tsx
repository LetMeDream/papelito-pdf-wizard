import { useEffect, useRef } from "react";

// Asegúrate de instalar pdfjs-dist: npm install pdfjs-dist
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfCanvas = ({ blob }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const actualUrl = 'https://raw.githubusercontent.com/LetMeDream/papelito-pdf-wizard/refs/heads/main/public/base.pdf'

  /* Render PDF into canvas */
  useEffect(() => {
    const render = async () => {
      const arrayBuffer = blob ? await blob.arrayBuffer() : null;

      const loadingTask = getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const scale = 10;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
    };


    if (blob) render();
  }, [blob]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc", background: "#fff", maxWidth: "80vw" }} />
    </div>
  );
};

export default PdfCanvas;