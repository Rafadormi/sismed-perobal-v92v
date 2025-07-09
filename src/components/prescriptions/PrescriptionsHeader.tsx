
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { Patient } from '@/types';

interface PrescriptionsHeaderProps {
  selectedPatient: Patient | null;
  activeTab: string;
  onBackToSearch: () => void;
}

const PrescriptionsHeader = ({ selectedPatient, activeTab, onBackToSearch }: PrescriptionsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 no-print">
      <div className="flex items-center">
        <FileText className="mr-3 h-8 w-8 text-health-700" />
        <div>
          <h1 className="text-3xl font-bold text-health-700">Receitas</h1>
          <p className="text-gray-600">
            {selectedPatient 
              ? `Paciente: ${selectedPatient.nome}` 
              : 'Busque um paciente para gerar ou visualizar receitas'}
          </p>
        </div>
      </div>
      
      {selectedPatient && activeTab === 'list' && (
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onBackToSearch}
            variant="outline"
          >
            <Search className="mr-1 h-4 w-4" /> Buscar outro paciente
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsHeader;
