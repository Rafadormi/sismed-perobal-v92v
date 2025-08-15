
import { PrescriptionDateConfig } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface PrescriptionDateSelectorProps {
  dates: PrescriptionDateConfig[];
  onChange: (dates: PrescriptionDateConfig[]) => void;
  initialDate: string;
}

const PrescriptionDateSelector = ({ dates, onChange, initialDate }: PrescriptionDateSelectorProps) => {
  const handleDateChange = (index: number, date: string) => {
    const newDates = [...dates];
    newDates[index].date = date;
    onChange(newDates);
  };

  const handleEnabledChange = (index: number, enabled: boolean) => {
    const newDates = [...dates];
    newDates[index].enabled = enabled;
    onChange(newDates);
  };

  const addDate = () => {
    const newDate: PrescriptionDateConfig = {
      enabled: true,
      date: initialDate
    };
    onChange([...dates, newDate]);
  };

  const removeDate = (index: number) => {
    if (dates.length > 1) {
      const newDates = dates.filter((_, i) => i !== index);
      onChange(newDates);
    }
  };

  const enabledCount = dates.filter(d => d.enabled).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Datas das Receitas ({enabledCount} selecionada{enabledCount !== 1 ? 's' : ''})
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDate}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adicionar Data
        </Button>
      </div>

      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        {dates.map((dateConfig, index) => (
          <div key={index} className="flex items-center gap-3 bg-white p-3 rounded border">
            <Checkbox
              checked={dateConfig.enabled}
              onCheckedChange={(checked) => handleEnabledChange(index, !!checked)}
            />
            
            <div className="flex-1">
              <Input
                type="date"
                value={dateConfig.date}
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="w-full"
              />
            </div>
            
            {dates.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDate(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        <p>• Selecione as datas em que deseja gerar as receitas</p>
        <p>• Pode gerar múltiplas receitas com a mesma prescrição</p>
        <p>• Útil para tratamentos contínuos ou receitas de uso controlado</p>
      </div>
    </div>
  );
};

export default PrescriptionDateSelector;
