
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedicines } from '@/hooks/useMedicines';
import { usePrescriptionForm } from '@/hooks/usePrescriptionForm';
import PrescriptionDateSelector from './PrescriptionDateSelector';
import MedicineSelector from './prescription-form/MedicineSelector';
import MedicineList from './prescription-form/MedicineList';
import PrescriptionObservations from './prescription-form/PrescriptionObservations';
import PrescriptionSubmitButton from './prescription-form/PrescriptionSubmitButton';

interface PrescriptionFormProps {
  patientId?: number;
  onSuccess?: () => void;
}

const PrescriptionForm = ({ patientId, onSuccess }: PrescriptionFormProps) => {
  const { medicines, isLoading: isMedicinesLoading } = useMedicines();
  const {
    patient,
    selectedMedicines,
    prescriptionDates,
    setPrescriptionDates,
    observations,
    setObservations,
    isSubmitting,
    addMedicine,
    removeMedicine,
    generatePrescriptions
  } = usePrescriptionForm(patientId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await generatePrescriptions(onSuccess);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-health-700">
        Gerar Receita Médica
      </h2>
      
      {patient ? (
        <p className="mb-6 text-lg">
          Paciente: <strong>{patient.nome}</strong>
        </p>
      ) : (
        <p className="mb-6 text-red-500">
          Paciente não selecionado. Volte e selecione um paciente.
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <PrescriptionDateSelector 
            dates={prescriptionDates}
            onChange={setPrescriptionDates}
            initialDate={new Date().toISOString().split('T')[0]}
          />
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Adicionar Medicamentos</TabsTrigger>
            <TabsTrigger value="list">Medicamentos Adicionados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <MedicineSelector
              medicines={medicines}
              selectedMedicines={selectedMedicines}
              onAddMedicine={addMedicine}
              isLoading={isMedicinesLoading}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <MedicineList
              selectedMedicines={selectedMedicines}
              onRemoveMedicine={removeMedicine}
            />
          </TabsContent>
        </Tabs>

        <PrescriptionObservations
          observations={observations}
          onObservationsChange={setObservations}
        />
        
        <PrescriptionSubmitButton
          isSubmitting={isSubmitting}
          patientId={patientId}
          selectedMedicines={selectedMedicines}
          prescriptionDates={prescriptionDates}
        />
      </form>
    </Card>
  );
};

export default PrescriptionForm;
