
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PrescriptionsHeader from '@/components/prescriptions/PrescriptionsHeader';
import PrescriptionsTabs from '@/components/prescriptions/PrescriptionsTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Patient, Prescription } from '@/types';
import { usePatients } from '@/hooks/usePatients';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { getPatientByIdSync } from '@/utils/storage';

const Prescriptions = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');
  
  const [activeTab, setActiveTab] = useState<string>('search');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  const { patients, isLoading: isPatientsLoading } = usePatients();
  const { 
    prescriptions, 
    isLoading: isPrescriptionsLoading, 
    deletePrescription 
  } = usePrescriptions();
  
  useEffect(() => {
    if (patientIdParam) {
      const patientId = parseInt(patientIdParam);
      const patient = getPatientByIdSync(patientId);
      
      if (patient) {
        setSelectedPatient(patient);
        setActiveTab('list');
      }
    }
  }, [patientIdParam]);
  
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('list');
  };
  
  const handleNewPrescription = () => {
    setActiveTab('new');
  };
  
  const handlePrescriptionCreated = () => {
    setActiveTab('list');
  };
  
  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setActiveTab('view');
  };
  
  const handleDeletePrescription = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
      deletePrescription(id);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleBackToSearch = () => {
    setSelectedPatient(null);
    setSelectedPrescription(null);
    setActiveTab('search');
  };

  const handleBackToList = () => {
    setSelectedPrescription(null);
    setActiveTab('list');
  };

  const handleTabChange = (value: string) => {
    if (value === 'search' && activeTab !== 'search') {
      setSelectedPatient(null);
      setSelectedPrescription(null);
      setActiveTab('search');
    } else {
      setActiveTab(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print">
        <Navbar />
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <PrescriptionsHeader
          selectedPatient={selectedPatient}
          activeTab={activeTab}
          onBackToSearch={handleBackToSearch}
        />

        {(isPatientsLoading || isPrescriptionsLoading) && (
          <Card className="mb-4 no-print">
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">Carregando dados...</div>
            </CardContent>
          </Card>
        )}
        
        <PrescriptionsTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          patients={patients}
          selectedPatient={selectedPatient}
          selectedPrescription={selectedPrescription}
          prescriptions={prescriptions}
          isPatientsLoading={isPatientsLoading}
          isPrescriptionsLoading={isPrescriptionsLoading}
          onSelectPatient={handleSelectPatient}
          onNewPrescription={handleNewPrescription}
          onViewPrescription={handleViewPrescription}
          onDeletePrescription={handleDeletePrescription}
          onPrescriptionCreated={handlePrescriptionCreated}
          onBackToList={handleBackToList}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
};

export default Prescriptions;
