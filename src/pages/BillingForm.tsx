import React from "react";
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
import { useBillingForm } from "@/hooks/useBillingForm";

import { useState } from "react";

const BillingForm = () => {
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
  } = useBillingForm();

  const [showCanvas, setShowCanvas] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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
                            required: "Este campo es obligatorio" 
                          })}
                          placeholder="Ej: FAC-001"
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
                            required: "Este campo es obligatorio" 
                          })}
                          placeholder="Ej: CTRL-001"
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
                          {...register(`products.${index}.debitNoteNumber`)}
                          placeholder="Ej: ND-001"
                        />
                      </div>

                      {/* Credit Note Number */}
                      <div className="space-y-2">
                        <Label>Número de Nota de Crédito</Label>
                        <Input
                          {...register(`products.${index}.creditNoteNumber`)}
                          placeholder="Ej: NC-001"
                        />
                      </div>

                      {/* Transaction Type */}
                      <div className="space-y-2">
                        <Label>Tipo de Transacción *</Label>
                        <Input
                          {...register(`products.${index}.transactionType`, { 
                            required: "Este campo es obligatorio" 
                          })}
                          placeholder="Ej: Venta de productos"
                        />
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
                          {...register(`products.${index}.affectedInvoiceNumber`)}
                          placeholder="Ej: FAC-000"
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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

            {/* Sección inferior con canvas, visible solo si showCanvas es true */}
            {showCanvas && (
              <div className="flex justify-center mt-8">
                <div style={{ maxWidth: 600, width: '100%' }}>
                  <canvas id="pdf-canvas" width={600} height={800} style={{ border: '1px solid #ccc', background: '#fff', width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default BillingForm;