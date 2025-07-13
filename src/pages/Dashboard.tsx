import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardList, History, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema de Gestión de Documentos</h1>
              <p className="text-muted-foreground">Agilización de papeleo institucional</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Historial
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white mb-6">
            <h2 className="text-xl font-semibold mb-2">Bienvenido al Sistema de Documentos</h2>
            <p className="text-primary-foreground/90">
              Crea y gestiona documentos institucionales de forma rápida y eficiente. 
              Completa los formularios y genera PDFs automáticamente.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Business Form Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Formulario de Negocio</h3>
                <p className="text-muted-foreground mb-4">
                  Captura la información general del agente de retención, 
                  datos fiscales y periodo de la transacción.
                </p>
                <Link to="/business-form">
                  <Button className="w-full">
                    Completar Formulario
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Billing Form Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Formulario de Facturación</h3>
                <p className="text-muted-foreground mb-4">
                  Registra los detalles de productos, facturas, notas de débito 
                  y crédito de forma detallada.
                </p>
                <Link to="/billing-form">
                  <Button variant="secondary" className="w-full">
                    Gestionar Productos
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Documentos Generados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Formularios Completados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Registros Guardados</div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="text-center py-8">
            <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No hay actividad reciente. Comienza completando un formulario.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;