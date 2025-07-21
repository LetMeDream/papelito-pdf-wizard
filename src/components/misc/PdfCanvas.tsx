import { useEffect, useRef } from "react";

// Asegúrate de instalar pdfjs-dist: npm install pdfjs-dist
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const PdfCanvas = ({ url = "/base.pdf" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const render = async () => {
      const loadingTask = getDocument(url);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
    };
    render();
  }, [url]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc", background: "#fff", maxWidth: "100%" }} />
    </div>
  );
};

export default PdfCanvas;