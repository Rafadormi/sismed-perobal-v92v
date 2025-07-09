
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientSearchCard from '@/components/patients/PatientSearchCard';
import PrescriptionListCard from '@/components/prescriptions/PrescriptionListCard';
import PrescriptionForm from '@/components/PrescriptionForm';
import PrescriptionViewer from '@/components/prescriptions/PrescriptionViewer';
import { Button } from '@/components/ui/button';
import { Patient, Prescription } from '@/types';

interface PrescriptionsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  patients: Patient[];
  selectedPatient: Patient | null;
  selectedPrescription: Prescription | null;
  prescriptions: Prescription[];
  isPatientsLoading: boolean;
  isPrescriptionsLoading: boolean;
  onSelectPatient: (patient: Patient) => void;
  onNewPrescription: () => void;
  onViewPrescription: (prescription: Prescription) => void;
  onDeletePrescription: (id: number) => void;
  onPrescriptionCreated: () => void;
  onBackToList: () => void;
  onPrint: () => void;
}

const PrescriptionsTabs = ({
  activeTab,
  onTabChange,
  patients,
  selectedPatient,
  selectedPrescription,
  prescriptions,
  isPatientsLoading,
  isPrescriptionsLoading,
  onSelectPatient,
  onNewPrescription,
  onViewPrescription,
  onDeletePrescription,
  onPrescriptionCreated,
  onBackToList,
  onPrint
}: PrescriptionsTabsProps) => {
  const handleTabChange = (value: string) => {
    if (value === 'search' && activeTab !== 'search') {
      onTabChange('search');
    } else {
      onTabChange(value);
    }
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="tabs-container no-print"
    >
      <TabsList className="grid w-full max-w-lg grid-cols-4">
        <TabsTrigger value="search" disabled={activeTab === 'view'}>
          Buscar Paciente
        </TabsTrigger>
        <TabsTrigger value="list" disabled={!selectedPatient || activeTab === 'view'}>
          Lista de Receitas
        </TabsTrigger>
        <TabsTrigger value="new" disabled={!selectedPatient || activeTab === 'view'}>
          Nova Receita
        </TabsTrigger>
        <TabsTrigger value="view" disabled={!selectedPrescription}>
          Visualizar
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="search" className="mt-4">
        <PatientSearchCard
          patients={patients}
          onSelectPatient={onSelectPatient}
          isLoading={isPatientsLoading}
        />
      </TabsContent>
      
      <TabsContent value="list" className="mt-4">
        {selectedPatient && (
          <PrescriptionListCard
            patient={selectedPatient}
            prescriptions={prescriptions}
            onNewPrescription={onNewPrescription}
            onViewPrescription={onViewPrescription}
            onDeletePrescription={onDeletePrescription}
            isLoading={isPrescriptionsLoading}
          />
        )}
      </TabsContent>
      
      <TabsContent value="new" className="mt-4 no-print">
        {selectedPatient && (
          <>
            <PrescriptionForm 
              patientId={selectedPatient.id}
              onSuccess={onPrescriptionCreated}
            />
            
            <div className="mt-4 flex justify-start">
              <Button 
                variant="outline"
                onClick={onBackToList}
              >
                Voltar para lista
              </Button>
            </div>
          </>
        )}
      </TabsContent>
      
      <TabsContent value="view" className="mt-4">
        {selectedPrescription && selectedPatient && (
          <PrescriptionViewer
            prescription={selectedPrescription}
            patient={selectedPatient}
            onBack={onBackToList}
            onPrint={onPrint}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PrescriptionsTabs;
