import { jsPDF } from 'jspdf';

export function downloadHarvardPDF({ fullName, targetLabel, education, experience, projects, technicalSkills, skills }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 20; // 20mm margins
  const contentWidth = pageWidth - (margin * 2); // 170mm
  let y = 20; // starting top margin

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Header - Name
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Dark slate
  const nameText = (fullName || 'Mateo Benítez').toUpperCase();
  doc.text(nameText, pageWidth / 2, y, { align: 'center' });
  y += 7;

  // Target Position
  if (targetLabel) {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(targetLabel.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 6;
  }

  // Contact Info
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const contactInfo = 'Lima, Perú  •  mateo.benitez@aethera.edu.pe  •  github.com/mbenitez-tech  •  +51 987 654 321';
  doc.text(contactInfo, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Top Rule Divider
  doc.setLineWidth(0.6);
  doc.setDrawColor(15, 23, 42);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Sections Data
  const sections = [
    { title: '1. EDUCACIÓN', content: education },
    { title: '2. EXPERIENCIA LABORAL', content: experience },
    { title: '3. PROYECTOS Y LOGROS', content: projects },
    { title: '4. HABILIDADES TÉCNICAS Y HERRAMIENTAS', content: technicalSkills || skills },
  ];

  sections.forEach((sec) => {
    checkPageBreak(25);

    // Section Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.title, margin, y);
    y += 2;

    // Sub-line divider under section title
    doc.setLineWidth(0.2);
    doc.setDrawColor(148, 163, 184);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // Content Body
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    const textStr = sec.content ? sec.content.trim() : 'Sin información registrada.';
    const textLines = doc.splitTextToSize(textStr, contentWidth);

    checkPageBreak(textLines.length * 5 + 4);
    doc.text(textLines, margin, y);
    y += (textLines.length * 5) + 8;
  });

  // Save PDF
  const filename = `CV_Harvard_${(fullName || 'Mateo_Benitez').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
}
