import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, set } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowLeft, Save, FileText } from "lucide-react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import useStore from "@/store/store";
import { routes } from "@/helpers/routes";
import { getFixedValue } from "@/helpers/form";

interface BusinessFormData {
  emissionDate: Date;
  socialReasonAgent: string;
  fiscalAgent: string;
  fiscalPeriod: Date;
  fiscalAddress: string;
  socialReasonSubject: string;
  subjectRIF: string;
  billNumber: string;
}

const BusinessForm = () => {
  const { toast } = useToast();
  const [emissionDate, setEmissionDate] = useState<Date>();
  const [fiscalPeriod, setFiscalPeriod] = useState<Date>();
  const { businessInfo, setBusinessInfo } = useStore();
  const navigate = useNavigate();

  const methods = useForm<BusinessFormData>({
    // Preload values for default form state with some dummy data
    defaultValues: businessInfo
  });

  useEffect(() => {
    // Set initial values for emissionDate and fiscalPeriod
    setEmissionDate(methods.getValues("emissionDate"));
    setFiscalPeriod(methods.getValues("fiscalPeriod"));
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues
  } = methods

  const onSubmit = async (data: BusinessFormData) => {
    try {
      // Concatenar el valor fijo con el editable
      const fixedValue = getFixedValue();
      const fullBillNumber = `${fixedValue}${data.billNumber}`;
      const newData = { ...data, billNumber: fullBillNumber };
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Business form data:", {
        ...newData,
        emissionDate,
        fiscalPeriod,
      });
      setBusinessInfo(newData)
      toast({
        title: "Formulario guardado exitosamente",
        description: "Los datos del negocio han sido registrados correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "Hubo un problema al guardar los datos. Inténtalo nuevamente.",
      });
    }
  };

  const onClickContinue = () => {
    const values = getValues()
    if (values) {
      setBusinessInfo(values);
      navigate(routes.productForm);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <FileText className="h-6 w-6 mr-2 text-primary" />
                Formulario de Negocio
              </h1>
              <p className="text-muted-foreground">Información general del agente de retención</p>
            </div>
            <Link to={routes.dashboard}>
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Emission Date */}
              <div className="space-y-2">
                <Label htmlFor="emissionDate">Fecha de Emisión *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !emissionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {emissionDate ? format(emissionDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={emissionDate}
                      onSelect={(date) => {
                        setEmissionDate(date);
                        setValue("emissionDate", date as Date);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.emissionDate && (
                  <p className="text-sm text-destructive">Este campo es obligatorio</p>
                )}
              </div>

              {/* Agent Name */}
              <div className="space-y-2">
                <Label htmlFor="socialReasonAgent">Nombre o Razón Social del Agente de Retención *</Label>
                <Input
                  id="socialReasonAgent"
                  {...register("socialReasonAgent", { required: "Este campo es obligatorio" })}
                  placeholder="Ej: Empresa ABC C.A."
                />
                {errors.socialReasonAgent && (
                  <p className="text-sm text-destructive">{errors.socialReasonAgent.message}</p>
                )}
              </div>

              {/* Agent Fiscal Info */}
              <div className="space-y-2">
                <Label htmlFor="fiscalAgent">Registro de Información Fiscal del Agente de Retención *</Label>
                <Input
                  id="fiscalAgent"
                  {...register("fiscalAgent", { required: "Este campo es obligatorio" })}
                  placeholder="Ej: J-12345678-9"
                />
                {errors.fiscalAgent && (
                  <p className="text-sm text-destructive">{errors.fiscalAgent.message}</p>
                )}
              </div>

              {/* Fiscal Period */}
              <div className="space-y-2">
                <Label htmlFor="fiscalPeriod">Periodo Fiscal *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fiscalPeriod && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fiscalPeriod ? format(fiscalPeriod, "MMMM yyyy", { locale: es }) : "Seleccionar periodo"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fiscalPeriod}
                      onSelect={(date) => {
                        setFiscalPeriod(date);
                        setValue("fiscalPeriod", date as Date);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.fiscalPeriod && (
                  <p className="text-sm text-destructive">Este campo es obligatorio</p>
                )}
              </div>

              {/* Fiscal Address */}
              <div className="space-y-2">
                <Label htmlFor="fiscalAddress">Dirección Fiscal del Agente de Retención *</Label>
                <Textarea
                  id="fiscalAddress"
                  {...register("fiscalAddress", { required: "Este campo es obligatorio" })}
                  placeholder="Dirección completa incluyendo ciudad, estado y código postal"
                  rows={3}
                />
                {errors.fiscalAddress && (
                  <p className="text-sm text-destructive">{errors.fiscalAddress.message}</p>
                )}
              </div>

              {/* Subject Name */}
              <div className="space-y-2">
                <Label htmlFor="socialReasonSubject">Nombre o Razón Social del Sujeto de Retención *</Label>
                <Input
                  id="socialReasonSubjetc"
                  {...register("socialReasonSubject", { required: "Este campo es obligatorio" })}
                  placeholder="Ej: Cliente XYZ S.A."
                />
                {errors.socialReasonSubject && (
                  <p className="text-sm text-destructive">{errors.socialReasonSubject.message}</p>
                )}
              </div>

              {/* Subject RIF */}
              <div className="space-y-2">
                <Label htmlFor="subjectRIF">RIF del Sujeto de Retención *</Label>
                <Input
                  id="subjectRIF"
                  {...register("subjectRIF", { required: "Este campo es obligatorio" })}
                  placeholder="Ej: V-87654321-0"
                />
                {errors.subjectRIF && (
                  <p className="text-sm text-destructive">{errors.subjectRIF.message}</p>
                )}
              </div>

              {/* bill Number - compuesto */}
              <div className="space-y-2">
                <Label htmlFor="billNumber">Número de Comprobante *</Label>
                <div className="flex w-full">
                  {/* Parte fija: año+mes */}
                  {/** Calcula el valor fijo dinámicamente **/}
                  {(() => {
                    const fixedValue = getFixedValue();
                    return (
                      <input
                        type="text"
                        value={fixedValue}
                        disabled
                        readOnly
                        tabIndex={-1}
                        className="rounded-r-none border-r-0 bg-muted text-muted-foreground w-28 px-2 py-2 border border-input focus:ring-0 focus:outline-none"
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                      />
                    );
                  })()}
                  {/* Parte editable */}
                  <Input
                    id="billNumber"
                    {...register("billNumber", { required: "Este campo es obligatorio" })}
                    placeholder="Secuencia o código"
                    className="rounded-l-none border-l-0 w-full px-2 py-2 border border-input focus:ring-0 focus:outline-none"
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    maxLength={3}
                  />
                </div>
                {errors.billNumber && (
                  <p className="text-sm text-destructive">{errors.billNumber.message}</p>
                )}
              </div>



              {/* Submit Button */}
              <div className="flex space-x-4 pt-6">
                
                <Button 
                  type="button" 
                  variant="default" 
                  className={cn("flex-1", businessInfo ? "" : "cursor-not-allowed opacity-50")}
                  disabled={!businessInfo}
                  onClick={onClickContinue}
                >
                  Continuar a Facturación
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </main>
    </div>
  );
};

export default BusinessForm;