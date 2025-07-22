import React, { useEffect } from "react";
import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";
import useStore from "@/store/store";
import fontkit from '@pdf-lib/fontkit';
export interface ProductData {
  date: Date | null;
  invoiceNumber: string;
  controlNumber: string;
  debitNoteNumber: string;
  creditNoteNumber: string;
  transactionType: string;
  affectedInvoiceNumber: string;
}

export interface BillingFormData {
  products: ProductData[];
}

export function useProductForm({ setBlob }: { setBlob?: (blob: Blob) => void } = {}) {
  const { toast } = useToast();
  const { businessInfo } = useStore()

  const methods = useForm<BillingFormData>({
    defaultValues: {
      products: [
        {
          date: null,
          invoiceNumber: "",
          controlNumber: "",
          debitNoteNumber: "",
          creditNoteNumber: "",
          transactionType: "asdasd",
          affectedInvoiceNumber: "",
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
    setValue(`products.${index}.date`, date || null);
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
  const generatePDF = async () => {
    try {
      const existingPdfBytes = await fetch('/base.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();
      /* let yPosition = height - 150;
      formData.products.forEach((product, index) => {
        firstPage.drawText(`Producto ${index + 1}:`, {
          x: 50,
          y: yPosition,
          size: 12,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        if (product.date) {
          firstPage.drawText(`Fecha: ${format(product.date, "dd/MM/yyyy", { locale: es })}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        if (product.invoiceNumber) {
          firstPage.drawText(`N° Factura: ${product.invoiceNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        if (product.controlNumber) {
          firstPage.drawText(`N° Control: ${product.controlNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        if (product.transactionType) {
          firstPage.drawText(`Tipo: ${product.transactionType}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        if (product.debitNoteNumber) {
          firstPage.drawText(`N° Nota Débito: ${product.debitNoteNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        if (product.creditNoteNumber) {
          firstPage.drawText(`N° Nota Crédito: ${product.creditNoteNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        if (product.affectedInvoiceNumber) {
          firstPage.drawText(`N° Factura Afectada: ${product.affectedInvoiceNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
            rotate: degrees(90)
          });
          yPosition -= 15;
        }
        yPosition -= 20;
      }); */

      // Carga la fuente personalizada
      const fontBytes = await fetch('/fonts/Roboto-SemiBold.ttf').then(res => res.arrayBuffer());
      const robotoBold = await pdfDoc.embedFont(fontBytes);

      const bInfo = businessInfo
      if (bInfo) {
        /* Comprobante */
        if (bInfo.billNumber) {
          const blankXDeviation = -5.5
          const blankYDeviation = 10
          firstPage.drawRectangle({
              x: 162 - blankXDeviation,
              y: 400 - blankYDeviation,
              width: 90,
              height: 16,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(bInfo.billNumber, {
              x: 162,
              y: 400,
              size: 8,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }

        /* Emission Date */
        if (bInfo.emissionDate) {
          const blankXDeviation = -5.5
          const blankYDeviation = 20
          firstPage.drawRectangle({
            x: 162 - blankXDeviation,
            y: 620 - blankYDeviation,
            width: 80,
            height: 16,
            color: rgb(1, 1, 1),
            rotate: degrees(90)
          });
          firstPage.drawText(`${format(bInfo.emissionDate, "dd-MM-yyyy", { locale: es })}`, {
            x: 162,
            y: 620,
            size: 8,
            color: rgb(0.4, 0.4, 0.7), 
            font: robotoBold,
            rotate: degrees(90) 
          });
        }

        /* Social reason */
        if (bInfo.socialReasonAgent) {
          const blankXDeviation = -5.5
          const blankYDeviation = 0
          firstPage.drawRectangle({
            x: 240 - blankXDeviation,
            y: 130 - blankYDeviation,
            width: 100,
            height: 16,
            color: rgb(1, 1, 1),
            rotate: degrees(90)
          });
          firstPage.drawText(`${bInfo.socialReasonAgent}`, {
            x: 240.5,
            y: 130,
            size: 8,
            color: rgb(0.4, 0.4, 0.7), 
            font: robotoBold,
            rotate: degrees(90) 
          });

        }

        /* Fiscal Agent */
        if (bInfo.fiscalAgent) {
          const blankXDeviation = -3.5
          const blankYDeviation = 0

          firstPage.drawRectangle({
            x: 240.5 - blankXDeviation,
            y: 376 - blankYDeviation,
            width: 100,
            height: 16,
            color: rgb(1, 1, 1),
            rotate: degrees(90)
          });
          firstPage.drawText(`${bInfo.fiscalAgent}`, {
            x: 240.5,
            y: 376,
            size: 8,
            color: rgb(0.4, 0.4, 0.7), 
            font: robotoBold,
            rotate: degrees(90) 
          });
        }

        /* Fiscal Period */
        if (bInfo.fiscalPeriod) {
          const blankXDeviation = -4
          const blankYDeviation = 8
          firstPage.drawRectangle({
            x: 240 - blankXDeviation,
            y: 595 - blankYDeviation,
            width: 100,
            height: 16,
            color: rgb(1, 1, 1),
            rotate: degrees(90)
          });
          firstPage.drawText(`${format(bInfo.fiscalPeriod, "MMMM yyyy", { locale: es })}`, {
            x: 240,
            y: 595,
            size: 8,
            color: rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font: robotoBold
          });
        }

        /* Address */
        if (bInfo.fiscalAddress) {
          const blankXDeviation = -5
          const blankYDeviation = 100
          firstPage.drawRectangle({
            x: 281 - blankXDeviation,
            y: 250 - blankYDeviation,
            width: 300,
            height: 16,
            color: rgb(1, 1, 1),
            rotate: degrees(90)
          });
          firstPage.drawText(`${bInfo.fiscalAddress}`, {
            x: 281,
            y: 250,
            size: 8,
            color: rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font: robotoBold
          });
        }

        /* Subject social reason */
        if (bInfo.socialReasonSubject) {
          const blankXDeviation = -5
          const blankYDeviation = 12
          firstPage.drawRectangle({
            x: 320.2 - blankXDeviation,
            y: 185 - blankYDeviation,
            width: 100,
            height: 12,
            color: rgb(1, 1, 1),
            rotate: degrees(90)
          });
          firstPage.drawText(`${bInfo.socialReasonSubject}`, {
            x: 320.2,
            y: 185,
            size: 8,
            color: rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font: robotoBold
          });
        }

        /* RIF */
        if (bInfo.subjectRIF) {
          firstPage.drawRectangle({
            x: 320, // Coordenada X del texto a cubrir
            y: 475, // Coordenada Y del texto a cubrir
            width: 100, // Ancho del rectángulo
            height: 10, // Alto del rectángulo
            color: rgb(1, 1, 1), // Blanco
            rotate: degrees(90)
          });
          firstPage.drawText(`${bInfo.subjectRIF}`, {
            x: 320,
            y: 475,
            size: 8,
            // rgb para color verde claro
            color: rgb(0.4, 0.4, 0.7),
            rotate: degrees(90),
            font: robotoBold
          });
        }
      }

      if(formData.products.length > 0) {
        /* 
          So far we will only generate the PDF with the first product.
        */
        const product = formData.products[0];
        /* Date */
        if (product.date) {
          const blankXDeviation = -3
          const blankYDeviation = 4.7
          firstPage.drawRectangle({
              x: 382 - blankXDeviation,
              y: 84 - blankYDeviation,
              width: 46,
              height: 8.5,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(format(product.date, "dd-MM-yyyy", { locale: es }), {
              x: 382,
              y: 84,
              size: 7,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }
        /* Billing Information; Number */
        if (product.invoiceNumber) {
          const blankXDeviation = -4
          const blankYDeviation = 7.7
          firstPage.drawRectangle({
              x: 381 - blankXDeviation,
              y: 135 - blankYDeviation,
              width: 46,
              height: 8.5,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(product.invoiceNumber, {
              x: 382,
              y: 135,
              size: 7,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }

        /* Control Number */
        if (product.controlNumber) {
          const blankXDeviation = -4
          const blankYDeviation = 4.7
          firstPage.drawRectangle({
              x: 381 - blankXDeviation,
              y: 182 - blankYDeviation,
              width: 46,
              height: 8.5,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(product.controlNumber, {
              x: 382,
              y: 182,
              size: 7,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }

        /* Debit Note Number */
        if (product.debitNoteNumber) {
          const blankXDeviation = -3
          const blankYDeviation = 4.7
          firstPage.drawRectangle({
              x: 382 - blankXDeviation,
              y: 231 - blankYDeviation,
              width: 46,
              height: 8.5,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(product.debitNoteNumber, {
              x: 382,
              y: 231,
              size: 7,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }

        /* Credit Note Number */
        if (product.creditNoteNumber) {
          const blankXDeviation = -4
          const blankYDeviation = 2.7
          firstPage.drawRectangle({
              x: 381 - blankXDeviation,
              y: 287 - blankYDeviation,
              width: 42,
              height: 8.5,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(product.creditNoteNumber, {
              x: 382,
              y: 287,
              size: 7,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }

        /* Transaction Type */
        if (product.transactionType) {
          const blankXDeviation = -4
          const blankYDeviation = 0.7
          firstPage.drawRectangle({
              x: 381 - blankXDeviation,
              y: 340 - blankYDeviation,
              width: 38,
              height: 8.5,
              color: rgb(1, 1, 1),
              rotate: degrees(90)
            });
          firstPage.drawText(product.transactionType, {
              x: 382,
              y: 340,
              size: 7,
              color: rgb(0.4, 0.4, 0.7), 
              font: robotoBold,
              rotate: degrees(90) 
          });
        }

        /* console.log(product) */
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setBlob(blob)
      // Downloading the PDF
      /* const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprobante_retencion_${format(new Date(), "yyyy-MM-dd_HH-mm")}.pdf`;
      link.click(); 
      toast({
        title: "PDF generado exitosamente",
        description: "El documento ha sido descargado automáticamente.",
      });
      URL.revokeObjectURL(url) */
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Error al generar PDF",
        description: "Hubo un problema al generar el documento.",
      });
    }
  };

  React.useEffect(() => {
    generatePDF();
  }, [/* JSON.stringify(watch("products")) */]);

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
    methods
  };
}
