import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface BusinessInfo {
  emissionDate: Date | null;                       
  socialReasonAgent: string | null;    // Nombre o razón social del agente 
  fiscalAgent: string | null;          // Registro de información fiscal del agente
  fiscalPeriod: Date | null;           // Período fiscal
  fiscalAddress: string | null;        // Dirección fiscal del agente
  socialReasonSubjetc: string | null;  // Nombre o razón social del sujeto
  subjectFif: string | null;           // Registro de información fiscal del sujeto
}

type Store = {
  businessInfo: BusinessInfo | null
  setBusinessInfo: (business: BusinessInfo) => void
}


const useStore = create<Store>()(
  devtools((set) => ({
    businessInfo: null,
    setBusinessInfo: (businessInfo: BusinessInfo) => set({ businessInfo }, false, 'setBusinessInfo')
  }), { name: 'BusinessStore' })
)

export default useStore;