import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format, set } from "date-fns";
import { es, fi } from "date-fns/locale";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";
import useStore from "@/store/store";
import fontkit from '@pdf-lib/fontkit';
import { cleanPDF, formatEuropeanNumber, parseEuropeanNumber } from "@/helpers/form";
import { useMediaQuery } from "./useMediaQuery";
export interface ProductData {
  date: Date | null;
  invoiceNumber: string;
  controlNumber: string;
  debitNoteNumber: string;
  creditNoteNumber: string;
  transactionType: string;
  affectedInvoiceNumber: string;
  recolectedPercentage: "100" | "75";
  baseAmount: string;
}

export interface BillingFormData {
  products: ProductData[];
}

export function useProductForm({ setBlob, showCanvas }: { setBlob?: (blob: Blob) => void, showCanvas?: boolean } = {}) {
  const { toast } = useToast();
  const { businessInfo } = useStore()

  /* In order to differentiate the last modified field */
  const [lastChangedField, setLastChangedField] = useState<string | null>(null);

  const methods = useForm<BillingFormData>({
    defaultValues: {
      products: [
        {
          date: new Date(), // Set default date to December 9, 2024
          invoiceNumber: "00069420",
          controlNumber: "42069000",
          debitNoteNumber: "0",
          creditNoteNumber: "0",
          transactionType: "01-Reg",
          affectedInvoiceNumber: "00069420",
          recolectedPercentage: "75",
          baseAmount: "253471,44"
        }
      ]
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues
  } = methods;

  useEffect(() => {
    setTimeout(() => {
      setValue(`products.0.transactionType`, '01-Reg');
      setValue(`products.0.recolectedPercentage`, '75');
      const date = new Date();
      setValue(`products.0.date`, date);
      setSelectedDates([date]); // Initialize selectedDates with the default date
    }, 100)
  }, [setValue])


  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  const [selectedDates, setSelectedDates] = useState<(Date | null)[]>([null]);

  const handleDateChange = (index: number, date: Date | undefined) => {
    const newDates = [...selectedDates];
    newDates[index] = date || null;
    setSelectedDates(newDates);
    setValue(`products.${index}.date`, date as Date);
    setLastChangedField(`products.${index}.date`);
  };

  const addProduct = () => {
    append({
      date: null,
      invoiceNumber: "",
      controlNumber: "",
      debitNoteNumber: "",
      creditNoteNumber: "",
      transactionType: "",
      affectedInvoiceNumber: "",
      recolectedPercentage: "75",
      baseAmount: ""
    });
    setSelectedDates([...selectedDates, null]);
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      const newDates = selectedDates.filter((_, i) => i !== index);
      setSelectedDates(newDates);
    }
  };

  const onSubmit = async (data: BillingFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Productos guardados exitosamente",
        description: `Se han registrado ${data.products.length} producto(s) correctamente.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "Hubo un problema al guardar los productos. Inténtalo nuevamente.",
      });
    }
  };


  const formData = watch();
  const printData = (page, font, color=null) => {
      // Printing the business information
      const bInfo = businessInfo;

      let mainColor = rgb(0.4, 0.4, 0.7)

      if (color) mainColor = color;
      


      if (bInfo) {
        /* Comprobante */
        if (bInfo.billNumber) {
          page.drawText(bInfo.billNumber, {
            x: 162,
            y: 400,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            font,
            rotate: degrees(90)
          });
        }
        /* Emission Date */
        if (bInfo.emissionDate) {
          page.drawText(`${format(bInfo.emissionDate, "dd-MM-yyyy", { locale: es })}`, {
            x: 162,
            y: 620,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            font,
            rotate: degrees(90)
          });
        }
        /* Social reason */
        if (bInfo.socialReasonAgent) {
          page.drawText(`${bInfo.socialReasonAgent}`, {
            x: 240.5,
            y: 130,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            font,
            rotate: degrees(90)
          });
        }
        /* Fiscal Agent */
        if (bInfo.fiscalAgent) {
          page.drawText(`${bInfo.fiscalAgent}`, {
            x: 240.5,
            y: 376,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            font,
            rotate: degrees(90)
          });
        }
        /* Fiscal Period */
        if (bInfo.fiscalPeriod) {
          page.drawText(`${format(bInfo.fiscalPeriod, "MMMM yyyy", { locale: es })}`, {
            x: 240,
            y: 595,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font
          });
        }
        /* Address */
        if (bInfo.fiscalAddress) {
          page.drawText(`${bInfo.fiscalAddress}`, {
            x: 281,
            y: 250,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font
          });
        }
        /* Subject social reason */
        if (bInfo.socialReasonSubject) {
          page.drawText(`${bInfo.socialReasonSubject}`, {
            x: 320.2,
            y: 185,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font
          });
        }
        /* RIF */
        if (bInfo.subjectRIF) {
          page.drawText(`${bInfo.subjectRIF}`, {
            x: 320,
            y: 475,
            size: 8,
            color: color ? color : rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font
          });
        }
      }

      // Printing the product fields
      if(formData.products.length > 0) {
        /* 
          So far we will only generate the PDF with the first product.
        */
        const product = formData.products[0];
        // Imprimir la info de producto
        if (product.date) {
          let finalColor = lastChangedField === `products.0.date` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(format(product.date, "dd-MM-yyyy", { locale: es }), {
            x: 382,
            y: 84,
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }
        if (product.invoiceNumber) {
          let insertOffset = 2.20
          if (product.invoiceNumber.toString().length >= 3) insertOffset = 3.2

          let finalColor = lastChangedField === `products.0.invoiceNumber` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(product.invoiceNumber, {
            x: 382,
            y: 164 - (product.invoiceNumber.toString().length * insertOffset),
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }
        if (product.controlNumber) {
          let insertOffset = 2.20
          if (product.controlNumber.toString().length >= 3) insertOffset = 3.2

          let finalColor = lastChangedField === `products.0.controlNumber` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(product.controlNumber, {
            x: 382,
            y: 216 - (product.controlNumber.toString().length * insertOffset),
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }
        if (product.debitNoteNumber) {
          let insertOffset = 2.20
          if (product.debitNoteNumber.toString().length >= 3) insertOffset = 3.2
          if (product.debitNoteNumber.toString().length >= 10) insertOffset = 3.5

          let finalColor = lastChangedField === `products.0.debitNoteNumber` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(product.debitNoteNumber, {
            x: 382,
            y: 274 - (product.debitNoteNumber.toString().length * insertOffset),
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }
        if (product.creditNoteNumber) {
          let insertOffset = 2.20
          if (product.creditNoteNumber.toString().length >= 3) insertOffset = 2.75

          let finalColor = lastChangedField === `products.0.creditNoteNumber` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(product.creditNoteNumber, {
            x: 382,
            y: 318 - (product.creditNoteNumber.toString().length * insertOffset),
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }
        if (product.transactionType) {
          let finalColor = lastChangedField === `products.0.transactionType` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(product.transactionType, {
            x: 382,
            y: 340,
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }
        if (product.affectedInvoiceNumber) {
          let finalColor = lastChangedField === `products.0.affectedInvoiceNumber` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(product.affectedInvoiceNumber, {
            x: 382,
            y: 386,
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }

        /* Recolected Percentage */
        if (product.recolectedPercentage) {
          let finalColor = lastChangedField === `products.0.recolectedPercentage` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(`${product.recolectedPercentage} %`, {
            x: 368,
            y: 704,
            size: 8,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }

        /* Monto final (BASE IMPONIBLE) */
        if (product.baseAmount) {
          let insertOffset = -22.25
          if (product.baseAmount.toString().length >= 2) insertOffset = -10.5
          if (product.baseAmount.toString().length >= 3) insertOffset = -5.5
          if (product.baseAmount.toString().length >= 4) insertOffset = -2.5
          if (product.baseAmount.toString().length >= 6) insertOffset = -1.5
          if (product.baseAmount.toString().length >= 7) insertOffset = -0.5
          if (product.baseAmount.toString().length >= 8) insertOffset = .25
          
          let finalColor = lastChangedField === `products.0.baseAmount` ? rgb(0.8, 0.2, 0.2) : mainColor;
          if (color) finalColor = color;
          page.drawText(formatEuropeanNumber(product.baseAmount), {
            x: 382.75,
            y: 550 - (product.baseAmount.toString().length * insertOffset),
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
          /* Monto final, final row */
          page.drawText(formatEuropeanNumber(product.baseAmount), {
            x: 427.75,
            y: 550 - (product.baseAmount.toString().length * insertOffset),
            size: 7,
            color: finalColor,
            font,
            rotate: degrees(90)
          });
        }

        /* Cálculos */
        const iva = (parseEuropeanNumber(product.baseAmount) * 0.16)
        const finalValue = parseEuropeanNumber(product.baseAmount) + iva
        if (finalValue) {
          // 'Total compras incluyendo el IVA'
          {
            let insertOffset = -1.5
            if (formatEuropeanNumber(finalValue).length >= 4)  insertOffset = -1.5
            if (formatEuropeanNumber(finalValue).length >= 5)  insertOffset = 1.25
            if (formatEuropeanNumber(finalValue).length >= 7)  insertOffset = 2.25

            let finalColor = lastChangedField === `products.0.finalValue` ? rgb(0.8, 0.2, 0.2) : mainColor;
            if (color) finalColor = color;
            page.drawText(formatEuropeanNumber(finalValue), {
              x: 382.75,
              y: 460  - (formatEuropeanNumber(finalValue).length * insertOffset),
              size: 7,
              color: finalColor,
              font,
              rotate: degrees(90)
            });
            // 'Total compras incluyendo el IVA' - final row
            page.drawText(formatEuropeanNumber(finalValue), {
              x: 427.75,
              y: 460 - (formatEuropeanNumber(finalValue).length * insertOffset),
              size: 7,
              color: finalColor,
              font,
              rotate: degrees(90)
            });
          }
          // iva
          {
            let insertOffset = 0
            if (formatEuropeanNumber(iva).length > 3) insertOffset = -1
            if (formatEuropeanNumber(iva).length >= 5)  insertOffset = .75
            if (formatEuropeanNumber(iva).length >= 7) insertOffset = 1.25
            if (formatEuropeanNumber(iva).length >= 9) insertOffset = 1.75

            let finalColor = lastChangedField === `products.0.iva` ? rgb(0.8, 0.2, 0.2) : mainColor;
            if (color) finalColor = color;
            page.drawText(formatEuropeanNumber(iva), {
              x: 382.75,
              y: 666 - (formatEuropeanNumber(iva).length * insertOffset),
              size: 7,
              color: finalColor,
              font,
              rotate: degrees(90)
            });
            // iva - final row
            page.drawText(formatEuropeanNumber(iva), {
              x: 427.75,
              y: 666 - (formatEuropeanNumber(iva).length * insertOffset),
              size: 7,
              color: finalColor,
              font,
              rotate: degrees(90)
            });
          }
          // Iva retenido; calculate
          const RETENTION_RATE_FULL = 1;
          const RETENTION_RATE_PARTIAL = 0.75;

          const retentionRate = product.recolectedPercentage === "100" ? RETENTION_RATE_FULL : RETENTION_RATE_PARTIAL;
          const ivaRetenido = iva * retentionRate;

          { 
            let insertOffset = 0
            if (formatEuropeanNumber(ivaRetenido).length > 4) insertOffset = 1
            if (formatEuropeanNumber(ivaRetenido).length > 5) insertOffset = 1.75
            if (formatEuropeanNumber(ivaRetenido).length > 7) insertOffset = 2
            // Iva retenido; render
            let finalColor = lastChangedField === `products.0.ivaRetenido` ? rgb(0.8, 0.2, 0.2) : mainColor;
            if (color) finalColor = color;
            page.drawText(formatEuropeanNumber(ivaRetenido), {
              x: 382.75,
              y: 718 - (formatEuropeanNumber(ivaRetenido).length * insertOffset),
              size: 7,
              color: finalColor,
              font,
              rotate: degrees(90)
            });
            // Iva retenido; final row
            page.drawText(formatEuropeanNumber(ivaRetenido), {
              x: 427.75,
              y: 718 - (formatEuropeanNumber(ivaRetenido).length * insertOffset),
              size: 7,
              color: finalColor,
              font,
              rotate: degrees(90)
            });

            // Total retención
            {
              let finalColor = lastChangedField === `products.0.totalAPagar` ? rgb(0.8, 0.2, 0.2) : mainColor;
              if (color) finalColor = color;
              page.drawText(formatEuropeanNumber(ivaRetenido), {
                x: 460,
                y: 718 - (formatEuropeanNumber(ivaRetenido).length * insertOffset),
                size: 7,
                color: finalColor,
                font,
                rotate: degrees(90)
              });
            }

            // Total a pagar

            const base = parseEuropeanNumber(product.baseAmount);
            const dif = Number(iva - ivaRetenido)
            const totalAPagar = formatEuropeanNumber(base + dif);
            if (formatEuropeanNumber(totalAPagar).length > 5) insertOffset = 2
            if (formatEuropeanNumber(totalAPagar).length > 9) insertOffset = 2.1
            
            {
              let finalColor = lastChangedField === `products.0.totalAPagar` ? rgb(0.8, 0.2, 0.2) : mainColor;
              if (color) finalColor = color;
              page.drawText(totalAPagar, {
                x: 481,
                y: 718 - (formatEuropeanNumber(totalAPagar).length * insertOffset),
                size: 7,
                color: finalColor,
                font,
                rotate: degrees(90)
              });
            }
          }


        }


      }
  }

  const generatePDF = async () => {
    try {
      let base = '/paperwork-pdf-wizard/';
      const existingPdfBytes = await fetch(`${base}base.pdf`).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Loading the Roboto font
      const fontBytes = await fetch(`${base}fonts/Roboto-SemiBold.ttf`).then(res => res.arrayBuffer());
      const robotoBold = await pdfDoc.embedFont(fontBytes);


      cleanPDF(firstPage);
      printData(firstPage, robotoBold);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setBlob(blob)

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Error al generar PDF",
        description: "Hubo un problema al generar el documento.",
      });
    }
  };

  const downloadPDF = async () => {
    try {
      // Downloading the PDF
      const existingPdfBytes = await fetch('/base.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Loading the Roboto font
      const fontBytes = await fetch('/fonts/Roboto-SemiBold.ttf').then(res => res.arrayBuffer());
      const robotoBold = await pdfDoc.embedFont(fontBytes);


      cleanPDF(firstPage);
      printData(firstPage, robotoBold, rgb(0, 0, 0));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Comprobante_retencion_${format(new Date(), "yyyy-MM-dd")}.pdf`;
      link.click(); 
      toast({
        title: "PDF generado exitosamente",
        description: "El documento ha sido descargado automáticamente.",
      });
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Error al descargar PDF",
        description: "Hubo un problema al descargar el documento.",
      });
    }
  }

  React.useEffect(() => {
    generatePDF();
  }, [/* JSON.stringify(watch("products")) */]);


  /* Zooming in on the PDF automatically */
  const transformRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Espera a que el componente esté montado
    setTimeout(() => {
      if (transformRef.current) {
        // setTransform(x, y, scale)
        if (isMobile) { 
          transformRef.current.setTransform(-340, -220, 2.15);
        }
      }
    }, 999);
  }, [showCanvas]);


  return {
    register,
    handleSubmit,
    control,
    errors,
    isSubmitting,
    setValue,
    watch,
    fields,
    append,
    remove,
    selectedDates,
    handleDateChange,
    addProduct,
    removeProduct,
    onSubmit,
    generatePDF,
    methods,
    transformRef,
    downloadPDF,
    getValues,
    setLastChangedField,
    lastChangedField
  };
}
