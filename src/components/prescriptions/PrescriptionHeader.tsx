
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
            src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
            alt="Prefeitura Municipal de Perobal" 
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
        <img 
          src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
          alt="Prefeitura Municipal de Perobal" 
          className="w-full max-h-24 object-contain mb-4"
        />
        <h2 className="text-xl font-bold mb-4 text-center">RECEITUÁRIO MÉDICO</h2>
        
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
      </div>
    </>
  );
};

export default PrescriptionHeader;
