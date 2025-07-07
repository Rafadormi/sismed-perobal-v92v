
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PatientForm from '@/components/PatientForm';
import PatientTable from '@/components/PatientTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Patient } from '@/types';
import { usePatients } from '@/hooks/usePatients';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';

const Patients = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  
  const { 
    patients, 
    isLoading, 
    deletePatient, 
    isDeletingPatient 
  } = usePatients();
  
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setActiveTab('form');
  };
  
  const handlePrescription = (patient: Patient) => {
    navigate(`/prescriptions?patientId=${patient.id}`);
  };
  
  const handleFormSuccess = () => {
    setActiveTab('list');
    setEditingPatient(undefined);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
      deletePatient(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center">
            <Users className="mr-3 h-8 w-8 text-health-700" />
            <div>
              <h1 className="text-3xl font-bold text-health-700">Pacientes</h1>
              <p className="text-gray-600">Gerencie os cadastros de pacientes</p>
            </div>
          </div>
          
          {activeTab === 'list' && (
            <Button 
              onClick={() => setActiveTab('form')}
              className="mt-4 md:mt-0 bg-health-600 hover:bg-health-700"
            >
              <Plus className="mr-1 h-4 w-4" /> Novo Paciente
            </Button>
          )}
        </div>

        {isLoading && (
          <Card className="mb-4">
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">Carregando pacientes...</div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">
              Lista de Pacientes ({patients.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            <PatientTable 
              patients={patients}
              onEdit={handleEdit}
              onPrescription={handlePrescription}
              onPatientDeleted={(id) => handleDelete(id)}
              isDeleting={isDeletingPatient}
            />
          </TabsContent>
          
          <TabsContent value="form" className="mt-4">
            <PatientForm 
              initialData={editingPatient} 
              onSuccess={handleFormSuccess} 
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('list');
                  setEditingPatient(undefined);
                }}
              >
                Cancelar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Patients;
