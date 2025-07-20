
import { Button } from '@/components/ui/button';
import { PrescriptionDateConfig, PrescriptionMedicine } from '@/types';

interface PrescriptionSubmitButtonProps {
  isSubmitting: boolean;
  patientId?: number;
  selectedMedicines: PrescriptionMedicine[];
  prescriptionDates: PrescriptionDateConfig[];
}

const PrescriptionSubmitButton = ({ 
  isSubmitting, 
  patientId, 
  selectedMedicines, 
  prescriptionDates 
}: PrescriptionSubmitButtonProps) => {
  const enabledDatesCount = prescriptionDates.filter(d => d.enabled).length;
  
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        className="bg-health-600 hover:bg-health-700"
        disabled={isSubmitting || !patientId || selectedMedicines.length === 0}
      >
        {isSubmitting ? 'Gerando...' : enabledDatesCount > 1 
          ? `Gerar ${enabledDatesCount} Receitas` 
          : 'Gerar Receita'}
      </Button>
    </div>
  );
};

export default PrescriptionSubmitButton;
