
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PrescriptionObservationsProps {
  observations: string;
  onObservationsChange: (value: string) => void;
}

const PrescriptionObservations = ({ 
  observations, 
  onObservationsChange 
}: PrescriptionObservationsProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="observacoes">Observações</Label>
      <Textarea
        id="observacoes"
        name="observacoes"
        placeholder="Observações adicionais para a receita"
        value={observations}
        onChange={(e) => onObservationsChange(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default PrescriptionObservations;
