import React from "react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PDFDocument, rgb } from "pdf-lib";
import { useToast } from "@/hooks/use-toast";

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

export function useBillingForm({ setBlob }: { setBlob?: (blob: Blob) => void } = {}) {
  const { toast } = useToast();

  const methods = useForm<BillingFormData>({
    defaultValues: {
      products: [
        {
          date: null,
          invoiceNumber: "",
          controlNumber: "",
          debitNoteNumber: "",
          creditNoteNumber: "",
          transactionType: "",
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
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  console.log(fields)
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
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();
      let yPosition = height - 150;
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
          });
          yPosition -= 15;
        }
        if (product.invoiceNumber) {
          firstPage.drawText(`N° Factura: ${product.invoiceNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
        if (product.controlNumber) {
          firstPage.drawText(`N° Control: ${product.controlNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
        if (product.transactionType) {
          firstPage.drawText(`Tipo: ${product.transactionType}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
        if (product.debitNoteNumber) {
          firstPage.drawText(`N° Nota Débito: ${product.debitNoteNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
        if (product.creditNoteNumber) {
          firstPage.drawText(`N° Nota Crédito: ${product.creditNoteNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
        if (product.affectedInvoiceNumber) {
          firstPage.drawText(`N° Factura Afectada: ${product.affectedInvoiceNumber}`, {
            x: 70,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
        yPosition -= 20;
      });
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
