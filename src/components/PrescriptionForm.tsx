
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMedicines } from '@/hooks/useMedicines';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { 
  Medicine, 
  PrescriptionMedicine,
  PrescriptionDateConfig
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2 } from "lucide-react";
import PrescriptionDateSelector from './PrescriptionDateSelector';
import { getPatientById } from '@/utils/storage';

interface PrescriptionFormProps {
  patientId?: number;
  onSuccess?: () => void;
}

const PrescriptionForm = ({ patientId, onSuccess }: PrescriptionFormProps) => {
  const { toast } = useToast();
  const { medicines, isLoading: isMedicinesLoading } = useMedicines();
  const { generateMultiplePrescriptions } = usePrescriptions();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
  const [posologia, setPosologia] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [medicamentosAdicionados, setMedicamentosAdicionados] = useState<PrescriptionMedicine[]>([]);
  const [prescriptionDates, setPrescriptionDates] = useState<PrescriptionDateConfig[]>([
    { enabled: true, date: new Date().toISOString().split('T')[0] }
  ]);

  // Obter nome do paciente
  const patientName = patientId ? getPatientById(patientId)?.nome || "" : "";

  // Filtrar medicamentos com a pesquisa
  const filteredMedicines = medicines.filter(med => 
    med.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMedicineToList = () => {
    if (!selectedMedicine || !posologia) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um medicamento e informe a posologia",
        variant: "destructive"
      });
      return;
    }

    const newMedication: PrescriptionMedicine = {
      medicamentoId: selectedMedicine,
      posologia: posologia
    };

    setMedicamentosAdicionados([...medicamentosAdicionados, newMedication]);

    // Limpar os campos
    setSelectedMedicine(null);
    setPosologia("");
  };

  const removeMedicine = (index: number) => {
    const updatedMeds = [...medicamentosAdicionados];
    updatedMeds.splice(index, 1);
    setMedicamentosAdicionados(updatedMeds);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!patientId) {
      toast({
        title: "Erro",
        description: "Paciente não selecionado",
        variant: "destructive"
      });
      return;
    }
    
    if (medicamentosAdicionados.length === 0) {
      toast({
        title: "Lista vazia",
        description: "Adicione pelo menos um medicamento à receita",
        variant: "destructive"
      });
      return;
    }

    const enabledDates = prescriptionDates.filter(d => d.enabled);
    
    if (enabledDates.length === 0) {
      toast({
        title: "Nenhuma data selecionada",
        description: "Selecione pelo menos uma data para gerar a receita",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await generateMultiplePrescriptions({
        pacienteId: patientId,
        medicamentos: medicamentosAdicionados,
        observacoes: observacoes,
        datas: prescriptionDates
      });
      
      // Limpar o formulário
      setMedicamentosAdicionados([]);
      setObservacoes('');
      setPrescriptionDates([{ 
        enabled: true, 
        date: new Date().toISOString().split('T')[0] 
      }]);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao gerar receitas:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para obter o medicamento pelo ID
  const getMedicineInfo = (id: number): Medicine | undefined => {
    return medicines.find(med => med.id === id);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-health-700">
        Gerar Receita Médica
      </h2>
      
      {patientId ? (
        <p className="mb-6 text-lg">
          Paciente: <strong>{patientName}</strong>
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
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar medicamento"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dosagem</TableHead>
                    <TableHead>Apresentação</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isMedicinesLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        Carregando medicamentos...
                      </TableCell>
                    </TableRow>
                  ) : filteredMedicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum medicamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedicines.map((med) => (
                      <TableRow key={med.id} className={med.id === selectedMedicine ? "bg-health-100" : ""}>
                        <TableCell>{med.nome}</TableCell>
                        <TableCell>{med.dosagem}</TableCell>
                        <TableCell>{med.apresentacao}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant={med.id === selectedMedicine ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedMedicine(med.id === selectedMedicine ? null : med.id)}
                          >
                            {med.id === selectedMedicine ? "Selecionado" : "Selecionar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="posologia">Posologia</Label>
              <Textarea
                id="posologia"
                value={posologia}
                onChange={(e) => setPosologia(e.target.value)}
                placeholder="Ex: Tomar 1 comprimido a cada 8 horas por 7 dias"
                rows={2}
              />
            </div>
            
            <Button
              type="button"
              onClick={addMedicineToList}
              className="w-full bg-health-600 hover:bg-health-700"
              disabled={!selectedMedicine || !posologia}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Medicamento à Receita
            </Button>
          </TabsContent>
          
          <TabsContent value="list">
            {medicamentosAdicionados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum medicamento adicionado à receita
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Posologia</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicamentosAdicionados.map((med, index) => {
                      const medicine = getMedicineInfo(med.medicamentoId);
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{medicine?.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {medicine?.dosagem} - {medicine?.apresentacao}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{med.posologia}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMedicine(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="mt-4">
              <Badge variant="secondary" className="mr-2">
                Total: {medicamentosAdicionados.length} medicamentos
              </Badge>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            placeholder="Observações adicionais para a receita"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-health-600 hover:bg-health-700"
            disabled={isSubmitting || !patientId || medicamentosAdicionados.length === 0}
          >
            {isSubmitting ? 'Gerando...' : prescriptionDates.filter(d => d.enabled).length > 1 
              ? `Gerar ${prescriptionDates.filter(d => d.enabled).length} Receitas` 
              : 'Gerar Receita'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PrescriptionForm;
