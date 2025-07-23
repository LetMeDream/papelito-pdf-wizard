import React from "react";
import PdfCanvas from "@/components/misc/PdfCanvas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FormProvider } from "react-hook-form";
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  ClipboardList,
  FileDown 
} from "lucide-react";
import { Form, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProductForm } from "@/hooks/useProductForm";

import { useState } from "react";
import Cleave from 'cleave.js/react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const BillingForm = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);

  const {
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
  } = useProductForm({ setBlob });


  return (
    <>
      <div className="bg-background w-[98vw]">
        {/* Header */}
        <header className="bg-card border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <ClipboardList className="h-6 w-6 mr-2 text-primary" />
                  Formulario de Facturación
                </h1>
                <p className="text-muted-foreground">Gestión de productos y detalles de facturación</p>
              </div>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="container mx-auto px-6 py-8 max-w-6xl">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Products Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Productos / Servicios</h2>
                  <Button type="button" onClick={addProduct} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>

                <div className="space-y-8">
                  {fields.map((field, index) => (
                    <div key={field.id} className="relative">
                      {/* Product Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-primary">
                          Producto {index + 1}
                        </h3>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeProduct(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        )}
                      </div>

                      {/* Product Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="space-y-2">
                          <Label>Fecha *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !selectedDates[index] && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDates[index] 
                                  ? format(selectedDates[index]!, "PPP", { locale: es }) 
                                  : "Seleccionar fecha"
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDates[index] || undefined}
                                onSelect={(date) => handleDateChange(index, date)}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Invoice Number */}
                        <div className="space-y-2">
                          <Label>Número de Factura *</Label>
                          <Input
                            {...register(`products.${index}.invoiceNumber`, { 
                              onBlur: () => generatePDF(),
                              required: "Este campo es obligatorio",
                            })}
                            placeholder="Ej: FAC-001"
                            maxLength={8}
                          />
                          {errors.products?.[index]?.invoiceNumber && (
                            <p className="text-sm text-destructive">
                              {errors.products[index]?.invoiceNumber?.message}
                            </p>
                          )}
                        </div>

                        {/* Control Number */}
                        <div className="space-y-2">
                          <Label>Número de Control de Factura *</Label>
                          <Input
                            {...register(`products.${index}.controlNumber`, { 
                              onBlur: () => generatePDF(),
                              required: "Este campo es obligatorio" 
                            })}
                            placeholder="Ej: CTRL-001"
                            maxLength={10}
                          />
                          {errors.products?.[index]?.controlNumber && (
                            <p className="text-sm text-destructive">
                              {errors.products[index]?.controlNumber?.message}
                            </p>
                          )}
                        </div>

                        {/* Debit Note Number */}
                        <div className="space-y-2">
                          <Label>Número de Nota de Débito</Label>
                          <Input
                            {...register(`products.${index}.debitNoteNumber`, {
                              onBlur: () => generatePDF(),
                            })}
                            placeholder="Ej: ND-001"
                            maxLength={12}
                          />
                        </div>

                        {/* Credit Note Number */}
                        <div className="space-y-2">
                          <Label>Número de Nota de Crédito</Label>
                          <Input
                            {...register(`products.${index}.creditNoteNumber`, {
                              onBlur: () => generatePDF(),
                            })}
                            placeholder="Ej: NC-001"
                            maxLength={10}
                          />
                        </div>

                        {/* Transaction Type */}
                        <div className="space-y-2">
                          <Label>Tipo de Transacción *</Label>
                          <select
                            {...register(`products.${index}.transactionType`, {
                              required: "Este campo es obligatorio",
                              onChange: () => generatePDF()
                            })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={watch(`products.${index}.transactionType`) ?? ""}
                          >
                            <option value="" disabled>Seleccione tipo</option>
                            <option value="01-Reg.">01-Reg.</option>
                            <option value="02-Reg">02-Reg</option>
                          </select>
                          {errors.products?.[index]?.transactionType && (
                            <p className="text-sm text-destructive">
                              {errors.products[index]?.transactionType?.message}
                            </p>
                          )}
                        </div>

                        {/* Affected Invoice Number */}
                        <div className="space-y-2">
                          <Label>Número de Factura Afectada</Label>
                          <Input
                            {...register(`products.${index}.affectedInvoiceNumber`, {
                              onBlur: () => generatePDF(),
                            })}
                            maxLength={10}
                            placeholder="Ej: FAC-000"
                          />
                        </div>

                        {/* % de recolección; (Select con dos opciones; 100% y 75%) */}
                        <div className="space-y-2">
                          <Label>% de Recolección</Label>
                          <select
                            {...register(`products.${index}.recolectedPercentage`, {
                              onChange: () => generatePDF(),
                            })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="" disabled>Seleccione porcentaje de recolección</option>
                            <option value="100">100%</option>
                            <option value="75">75%</option>
                          </select>
                        </div>

                        {/* Monto Final en $ */}
                        <div className="space-y-2">
                          <Label>Monto Final</Label>
                          <Cleave
                            options={{
                              numeral: true,
                              numeralThousandsGroupStyle: 'thousand',
                              numeralDecimalMark: ',',
                              delimiter: '.',
                            }}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Ej: 1.234,56"
                            maxLength={9}
                            value={watch(`products.${index}.baseAmount`) ?? ''}
                            onChange={e => {
                              console.log(e.target.value)
                              setValue(`products.${index}.baseAmount`, e.target.value);
                            }}
                            onBlur={() => generatePDF()}
                          />
                        </div>

                      </div>

                      {/* Separator */}
                      {index < fields.length - 1 && (
                        <Separator className="mt-8" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>


            </form>
          </FormProvider>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Productos
                </>
              )}
            </Button>
            <Button 
              type="button" 
              onClick={generatePDF} 
              variant="secondary" 
              className="flex-1"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generar PDF
            </Button>
            <Button
              type="button"
              onClick={() => setShowCanvas((prev) => !prev)}
              variant="outline"
              className="flex-1"
            >
              {showCanvas ? 'Ocultar Canvas' : 'Mostrar Canvas'}
            </Button>
            <Link to="/business-form" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Volver a Formulario de Negocio
              </Button>
            </Link>
          </div>
          
        </main>

        {/* Sección inferior con canvas, visible solo si showCanvas es true */}
      </div>
      <div className="flex justify-center border border-slate-800 ml-[0.5vw] md:ml-[15vw] w-[99vw] md:w-[70vw] p-0 mb-10">
        <TransformWrapper limitToBounds={true}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <div className="relative">
              <div className="tools absolute top-2 right-2 flex space-x-4 z-10">
                <button
                  className="bg-white p-2 px-4 rounded shadow hover:bg-gray-100 transition-colors"
                  onClick={() => zoomIn()}
                >
                  +
                </button>
                <button
                  className="bg-white p-2 px-4 rounded shadow hover:bg-gray-100 transition-colors"
                  onClick={() => zoomOut()}
                >
                  -
                </button>
                <button
                  className="bg-white p-2 px-4 rounded shadow hover:bg-gray-100 transition-colors"
                  onClick={() => resetTransform()}
                >
                  x
                </button>
              </div>
              <TransformComponent>
                <PdfCanvas blob={blob} />
              </TransformComponent>
            </div>
          )}
        </TransformWrapper>
      </div>
    </>
  );
};

export default BillingForm;