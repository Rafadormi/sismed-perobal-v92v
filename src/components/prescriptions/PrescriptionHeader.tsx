
import { Patient, Prescription } from '@/types';
import { format } from 'date-fns';
import { User, Calendar } from 'lucide-react';

interface PrescriptionHeaderProps {
  prescription: Prescription;
  patient: Patient;
}

const PrescriptionHeader = ({ prescription, patient }: PrescriptionHeaderProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <>
      {/* Screen version */}
      <div className="border-b pb-4 mb-6 no-print">
        <div className="text-center">
          <img 
            src="/lovable-uploads/691ec7a3-d30a-49df-b439-78a738b3aac6.png" 
            alt="Prefeitura Municipal de Perobal - Sistema de Saúde" 
            className="mx-auto mb-4 max-h-32"
          />
          <h2 className="text-2xl font-bold mb-1">Receituário Médico</h2>
        </div>
      </div>

      <div className="space-y-6 no-print">
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
      </div>

      {/* Print version */}
      <div className="print-only">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/691ec7a3-d30a-49df-b439-78a738b3aac6.png" 
              alt="Brasão da Prefeitura de Perobal" 
              className="h-20 w-20 object-contain mr-4"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">PREFEITURA MUNICIPAL DE PEROBAL</h1>
              <p className="text-sm text-gray-600 font-medium">SECRETARIA MUNICIPAL DE SAÚDE</p>
              <p className="text-xs text-gray-500">CNPJ: 76.460.526/0001-16</p>
              <p className="text-xs text-gray-500">Rua Jaracatiá, 1060 - CEP 87538-000 - Perobal - PR</p>
              <p className="text-xs text-gray-500">Telefax: (44) 3625-1225</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">RECEITA MÉDICA</p>
            <p className="text-xs text-gray-600">Data: {formatDate(prescription.data)}</p>
          </div>
        </div>
        
        <div className="mb-4 text-sm border-t border-b border-gray-300 py-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Paciente:</strong> {patient.nome}</p>
              <p><strong>CPF/RG:</strong> {patient.cpf}</p>
            </div>
            <div>
              <p><strong>Data de Nascimento:</strong> {formatDate(patient.dataNascimento)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionHeader;
