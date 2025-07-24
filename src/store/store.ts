import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface BusinessInfo {
  emissionDate: Date | null;                       
  socialReasonAgent: string | null;    // Nombre o razón social del agente 
  fiscalAgent: string | null;          // Registro de información fiscal del agente
  fiscalPeriod: Date | null;           // Período fiscal
  fiscalAddress: string | null;        // Dirección fiscal del agente
  socialReasonSubject: string | null;  // Nombre o razón social del sujeto
  subjectRIF: string | null;           // Registro de información fiscal del sujeto
  billNumber: string | null;  // Número de factura (opcional)
}

type Store = {
  businessInfo: BusinessInfo | null
  setBusinessInfo: (business: BusinessInfo) => void
}


const useStore = create<Store>()(
  devtools((set) => ({
    businessInfo: {
        // Inicializar con dummy data, not null
        emissionDate: new Date(),
        socialReasonAgent: "GRUPO CONSOMKA, C.A." as string,
        fiscalAgent: "j-04040404040-1",
        fiscalPeriod: new Date(),
        fiscalAddress: "Dirección Fiscal de Prueba",
        socialReasonSubject: "TIENDAS DAKA,. C.A." as string,
        subjectRIF: "V123456789",
        billNumber: '019',
      },
    setBusinessInfo: (businessInfo: BusinessInfo) => set(() => ({ businessInfo }))
  }), 
    { name: 'BusinessStore' }
  )
)

export default useStore;