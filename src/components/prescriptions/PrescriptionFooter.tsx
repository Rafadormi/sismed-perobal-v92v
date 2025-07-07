
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

interface PrescriptionFooterProps {
  onBack: () => void;
  onPrint: () => void;
}

const PrescriptionFooter = ({ onBack, onPrint }: PrescriptionFooterProps) => {
  return (
    <>
      {/* Screen version */}
      <div className="mt-8 pt-8 border-t no-print">
        <div className="flex justify-center mb-8">
          <div className="text-center w-64 border-t border-black pt-2">
            <p className="text-sm">Assinatura do Profissional</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          
          <Button
            onClick={onPrint}
            className="bg-health-600 hover:bg-health-700"
          >
            <Printer className="mr-1 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Print version */}
      <div className="print-only">
        <div className="mt-12 pt-4">
          <div className="flex justify-center">
            <div className="text-center border-t border-black pt-1" style={{width: '200px'}}>
              <p>Assinatura do Profissional</p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-center mt-8 pt-8">
          <p>Rua Jaracatiá, 1060 - Telefax (044)3625-1225 CEP. 87538-000 PEROBAL - PARANÁ</p>
        </div>
      </div>
    </>
  );
};

export default PrescriptionFooter;
