
import jsPDF from 'jspdf';
import { Prescription, Patient, Medicine } from '@/types';
import { getMedicineByIdSync } from '@/utils/storage';

export class PDFGenerator {
  private static readonly PAGE_HEIGHT = 842; // A4 em pontos
  private static readonly MARGIN = 40;
  private static readonly MAX_MEDICINES_PER_PAGE = 8;

  static async generatePrescriptionPDF(
    prescription: Prescription,
    patient: Patient
  ): Promise<Blob> {
    const doc = new jsPDF('p', 'pt', 'a4');
    
    this.addHeader(doc);
    this.addPatientInfo(doc, patient);
    this.addPrescriptionDate(doc, prescription.data);
    
    // Verificar se precisa de múltiplas páginas
    const medicineGroups = this.groupMedicinesByPage(prescription.medicamentos);
    
    medicineGroups.forEach((group, groupIndex) => {
      if (groupIndex > 0) {
        doc.addPage();
        this.addHeader(doc);
        this.addContinuationNote(doc, patient.nome);
      }
      this.addMedicines(doc, group, groupIndex > 0 ? 0 : 220);
    });
    
    this.addFooter(doc, prescription.data);
    
    return doc.output('blob');
  }

  static async generateMultiplePrescriptions(
    prescriptions: Prescription[],
    patient: Patient
  ): Promise<Blob> {
    const doc = new jsPDF('p', 'pt', 'a4');
    
    prescriptions.forEach((prescription, index) => {
      if (index > 0) doc.addPage();
      
      this.addHeader(doc);
      this.addPatientInfo(doc, patient);
      this.addPrescriptionDate(doc, prescription.data);
      
      // Lógica de paginação para medicamentos
      const medicineGroups = this.groupMedicinesByPage(prescription.medicamentos);
      medicineGroups.forEach((group, groupIndex) => {
        if (groupIndex > 0) {
          doc.addPage();
          this.addHeader(doc);
          this.addContinuationNote(doc, patient.nome);
        }
        this.addMedicines(doc, group, groupIndex > 0 ? 160 : 220);
      });
      
      this.addFooter(doc, prescription.data);
      
      if (prescription.observacoes) {
        this.addObservations(doc, prescription.observacoes);
      }
    });
    
    return doc.output('blob');
  }

  private static addHeader(doc: jsPDF): void {
    // Cabeçalho: "RECEITUÁRIO MÉDICO"
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PREFEITURA MUNICIPAL DE PEROBAL', 297, 40, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('SECRETARIA MUNICIPAL DE SAÚDE', 297, 60, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('RECEITUÁRIO MÉDICO', 297, 90, { align: 'center' });
    
    // Linha separadora
    doc.setLineWidth(1);
    doc.line(40, 100, 555, 100);
  }

  private static addPatientInfo(doc: jsPDF, patient: Patient): void {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 130;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', 40, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(patient.nome, 100, yPosition);
    
    yPosition += 20;
    if (patient.cpf) {
      doc.setFont('helvetica', 'bold');
      doc.text('CPF:', 40, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(patient.cpf, 80, yPosition);
      yPosition += 20;
    }
    
    if (patient.dataNascimento) {
      doc.setFont('helvetica', 'bold');
      doc.text('Data Nasc.:', 40, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(this.formatDate(patient.dataNascimento), 120, yPosition);
    }
  }

  private static addPrescriptionDate(doc: jsPDF, date: string): void {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Data:', 400, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(this.formatDate(date), 440, 130);
  }

  private static addMedicines(doc: jsPDF, medicines: any[], startY: number = 220): void {
    let yPosition = startY;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAMENTOS PRESCRITOS:', 40, yPosition - 20);
    
    medicines.forEach((medicine, index) => {
      const medicineData = getMedicineByIdSync(medicine.medicamentoId);
      if (medicineData) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${medicineData.nome} - ${medicineData.dosagem}`, 40, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`    (${medicineData.apresentacao})`, 40, yPosition + 15);
        doc.text(`    ${medicine.posologia}`, 40, yPosition + 30);
        
        yPosition += 60;
      }
    });
  }

  private static addObservations(doc: jsPDF, observations: string): void {
    const pageHeight = doc.internal.pageSize.height;
    const yPosition = pageHeight - 150;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES:', 40, yPosition);
    
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(observations, 500);
    doc.text(splitText, 40, yPosition + 20);
  }

  private static addFooter(doc: jsPDF, date: string): void {
    const pageHeight = doc.internal.pageSize.height;
    const yPosition = pageHeight - 100;
    
    const formattedDate = this.formatDateExtensive(date);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, 420, yPosition - 40, { align: 'right' });
    
    // Linha para assinatura
    doc.setLineWidth(1);
    doc.line(200, yPosition, 400, yPosition);
    
    doc.setFontSize(10);
    doc.text('Assinatura do Profissional', 300, yPosition + 15, { align: 'center' });
    
    // Rodapé da organização
    doc.setFontSize(8);
    doc.text('Rua Jaracatiá, 1060 - Telefax (044)3625-1225 CEP. 87538-000 PEROBAL - PARANÁ', 
             297, pageHeight - 20, { align: 'center' });
  }

  private static addContinuationNote(doc: jsPDF, patientName: string): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Continuação da receita - Paciente: ${patientName}`, 40, 120);
  }

  private static groupMedicinesByPage(medicines: any[]): any[][] {
    const groups: any[][] = [];
    for (let i = 0; i < medicines.length; i += this.MAX_MEDICINES_PER_PAGE) {
      groups.push(medicines.slice(i, i + this.MAX_MEDICINES_PER_PAGE));
    }
    return groups;
  }

  private static formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  }

  private static formatDateExtensive(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `Perobal, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  static downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
