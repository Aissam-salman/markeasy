import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';

/**
 * Exporte le contenu markdown rendu en PDF
 */
export const exportToPdf = async (element: HTMLElement, filename: string = 'document.pdf'): Promise<void> => {
  try {
    console.log('Début de la capture HTML...');
    // Créer un canvas à partir du HTML
    const canvas = await html2canvas(element, {
      scale: 2, // Meilleure qualité
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff'
    });
    console.log('Canvas créé:', canvas.width, 'x', canvas.height);

    const imgData = canvas.toDataURL('image/png');
    console.log('Image convertie en base64');

    // Calculer les dimensions pour le PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Créer le PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Ajouter la première page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    console.log('PDF créé, ouverture du dialogue de sauvegarde...');

    // Utiliser l'API Tauri pour sauvegarder le fichier
    const selectedPath = await save({
      filters: [{
        name: 'PDF',
        extensions: ['pdf']
      }],
      defaultPath: filename
    });

    if (selectedPath) {
      console.log('Chemin sélectionné:', selectedPath);
      // Obtenir le PDF en tant que Uint8Array
      const pdfData = pdf.output('arraybuffer');
      const uint8Array = new Uint8Array(pdfData);

      // Écrire le fichier
      await writeFile(selectedPath, uint8Array);
      console.log('PDF sauvegardé avec succès!');
    } else {
      console.log('Sauvegarde annulée par l\'utilisateur');
    }
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    throw new Error('Impossible d\'exporter en PDF');
  }
};
