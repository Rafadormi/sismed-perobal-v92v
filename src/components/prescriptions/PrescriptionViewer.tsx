
import { Prescription, Patient, Medicine } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { getMedicineById } from '@/utils/storage';

interface PrescriptionViewerProps {
  prescription: Prescription;
  patient: Patient;
  onBack: () => void;
  onPrint: () => void;
}

const PrescriptionViewer = ({ prescription, patient, onBack, onPrint }: PrescriptionViewerProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  };

  const getMedicine = (id: number): Medicine | undefined => {
    return getMedicineById(id);
  };

  return (
    <>
      {/* Estilos para impressão */}
      <style>{`
        @media print {
          body {
            font-family: "Courier New", monospace;
            font-size: 12pt;
            line-height: 1.3;
          }
          
          .no-print, .no-print * {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-container {
            width: 100%;
            padding: 20px;
          }
          
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      {/* Versão para tela */}
      <Card className="p-6 no-print">
        <div className="border-b pb-4 mb-6">
          <div className="text-center">
            <img 
              src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
              alt="Prefeitura Municipal de Perobal" 
              className="mx-auto mb-4 max-h-32"
            />
            <h2 className="text-2xl font-bold mb-1">Receituário Médico</h2>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold flex items-center text-health-700 mb-2">
                <User className="mr-2 h-5 w-5" />
                Dados do Paciente
              </h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nome:</span> {patient.nome}</p>
                <p><span className="font-medium">CPF:</span> {patient.cpf}</p>
                <p><span className="font-medium">Data Nasc.:</span> {formatDate(patient.dataNascimento)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold flex items-center text-health-700 mb-2">
                <Calendar className="mr-2 h-5 w-5" />
                Dados da Receita
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Data:</span> {formatDate(prescription.data)}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold border-b pb-2 mb-3">Medicamentos Prescritos</h3>
            
            <div className="space-y-4">
              {prescription.medicamentos.map((med, index) => {
                const medicine = getMedicine(med.medicamentoId);
                return (
                  <div key={index} className="border-b pb-3">
                    <p className="font-medium">{medicine?.nome} - {medicine?.dosagem} ({medicine?.apresentacao})</p>
                    <p className="text-sm mt-1">{med.posologia}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {prescription.observacoes && (
            <div>
              <h3 className="font-semibold">Observações</h3>
              <p className="text-sm mt-1">{prescription.observacoes}</p>
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t">
            <div className="flex justify-center">
              <div className="text-center w-64 border-t border-black pt-2">
                <p className="text-sm">Assinatura do Profissional</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
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
      </Card>

      {/* Versão para impressão */}
      <div className="print-only print-container">
        <div className="print-header">
          <img 
            src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
            alt="Prefeitura Municipal de Perobal" 
            className="w-full max-h-24 object-contain mb-4"
          />
          <h2 className="text-xl font-bold mb-4 text-center">RECEITUÁRIO MÉDICO</h2>
        </div>
        
        <div className="prescription-content">
          <table className="w-full mb-4">
            <tbody>
              <tr>
                <td className="align-top py-1">
                  <strong>Paciente:</strong> {patient.nome}
                </td>
                <td className="align-top py-1">
                  <strong>Data:</strong> {formatDate(prescription.data)}
                </td>
              </tr>
              <tr>
                <td className="align-top py-1">
                  <strong>CPF:</strong> {patient.cpf}
                </td>
                <td className="align-top py-1">
                  <strong>Data Nasc.:</strong> {formatDate(patient.dataNascimento)}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="border-t border-b py-3 my-4">
            <h3 className="font-bold mb-2">MEDICAMENTOS PRESCRITOS:</h3>
            
            <ol className="list-decimal pl-6 space-y-6">
              {prescription.medicamentos.map((med, index) => {
                const medicine = getMedicine(med.medicamentoId);
                return (
                  <li key={index} className="mb-2">
                    <p className="font-bold">{medicine?.nome} - {medicine?.dosagem} ({medicine?.apresentacao})</p>
                    <p>{med.posologia}</p>
                  </li>
                );
              })}
            </ol>
          </div>
          
          {prescription.observacoes && (
            <div className="my-4">
              <h3 className="font-bold mb-1">OBSERVAÇÕES:</h3>
              <p>{prescription.observacoes}</p>
            </div>
          )}
          
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
      </div>
    </>
  );
};

export default PrescriptionViewer;
