/**
 * DataExporter - Export RPAIT data in various formats
 *
 * Phase 4 Task 4.5: Data Export
 * Supports JSON and CSV export formats
 */

class DataExporter {
  /**
   * Export persona RPAIT scores as JSON
   */
  static exportPersonaAsJSON(artworkId, personaId) {
    const rpait = RPAITManager.getRPAIT(artworkId, personaId);
    if (!rpait) {
      console.warn(`⚠️  No RPAIT data for ${personaId} (${artworkId})`);
      return null;
    }

    const artwork = RPAITManager.getArtworkData(artworkId);
    const data = {
      artwork: {
        id: artworkId,
        title: artwork?.title || 'Unknown',
        year: artwork?.year || 'Unknown',
      },
      persona: personaId,
      rpait: {
        Representation: rpait.Representation || 5,
        Philosophy: rpait.Philosophy || 5,
        Aesthetics: rpait.Aesthetics || 5,
        Interpretation: rpait.Interpretation || 5,
        Technique: rpait.Technique || 5,
      },
      exportDate: new Date().toISOString(),
    };

    return data;
  }

  /**
   * Export multiple personas as JSON (comparison)
   */
  static exportComparisonAsJSON(artworkId, personaIds) {
    const artwork = RPAITManager.getArtworkData(artworkId);
    const personas = personaIds.map(personaId => {
      const rpait = RPAITManager.getRPAIT(artworkId, personaId);
      return {
        name: personaId,
        rpait: {
          Representation: rpait?.Representation || 5,
          Philosophy: rpait?.Philosophy || 5,
          Aesthetics: rpait?.Aesthetics || 5,
          Interpretation: rpait?.Interpretation || 5,
          Technique: rpait?.Technique || 5,
        },
      };
    });

    const data = {
      artwork: {
        id: artworkId,
        title: artwork?.title || 'Unknown',
        year: artwork?.year || 'Unknown',
      },
      personas: personas,
      exportDate: new Date().toISOString(),
    };

    return data;
  }

  /**
   * Export as JSON file and trigger download
   */
  static downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `rpait-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Downloaded JSON: ${a.download}`);
  }

  /**
   * Export persona RPAIT scores as CSV
   */
  static exportPersonaAsCSV(artworkId, personaId) {
    const rpait = RPAITManager.getRPAIT(artworkId, personaId);
    if (!rpait) {
      console.warn(`⚠️  No RPAIT data for ${personaId} (${artworkId})`);
      return null;
    }

    const artwork = RPAITManager.getArtworkData(artworkId);

    // CSV header row
    const headers = ['Artwork', 'Artwork Title', 'Year', 'Persona', 'Representation', 'Philosophy', 'Aesthetics', 'Interpretation', 'Technique'];

    // CSV data row
    const row = [
      artworkId,
      artwork?.title || 'Unknown',
      artwork?.year || 'Unknown',
      personaId,
      rpait.Representation || 5,
      rpait.Philosophy || 5,
      rpait.Aesthetics || 5,
      rpait.Interpretation || 5,
      rpait.Technique || 5,
    ];

    // Escape and quote fields
    const escapedRow = row.map(field => {
      const fieldStr = String(field);
      if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
        return `"${fieldStr.replace(/"/g, '""')}"`;
      }
      return fieldStr;
    });

    const csv = headers.join(',') + '\n' + escapedRow.join(',');
    return csv;
  }

  /**
   * Export comparison as CSV
   */
  static exportComparisonAsCSV(artworkId, personaIds) {
    const artwork = RPAITManager.getArtworkData(artworkId);

    // CSV header
    const headers = ['Persona', 'Representation', 'Philosophy', 'Aesthetics', 'Interpretation', 'Technique'];

    // CSV rows
    const rows = personaIds.map(personaId => {
      const rpait = RPAITManager.getRPAIT(artworkId, personaId);
      return [
        personaId,
        rpait?.Representation || 5,
        rpait?.Philosophy || 5,
        rpait?.Aesthetics || 5,
        rpait?.Interpretation || 5,
        rpait?.Technique || 5,
      ];
    });

    // Build CSV
    let csv = `Artwork: ${artwork?.title || 'Unknown'}\n`;
    csv += `Artwork ID: ${artworkId}\n`;
    csv += `Year: ${artwork?.year || 'Unknown'}\n`;
    csv += `Export Date: ${new Date().toISOString()}\n\n`;
    csv += headers.join(',') + '\n';
    csv += rows.map(row =>
      row.map(field => {
        const fieldStr = String(field);
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      }).join(',')
    ).join('\n');

    return csv;
  }

  /**
   * Download CSV file
   */
  static downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `rpait-export-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ Downloaded CSV: ${a.download}`);
  }

  /**
   * Generate HTML preview of data
   */
  static generatePreviewHTML(data) {
    if (Array.isArray(data.personas)) {
      // Comparison data
      let html = `<div style="font-family: sans-serif; font-size: 12px;">`;
      html += `<h3>${data.artwork.title} (${data.artwork.year})</h3>`;
      html += `<table style="border-collapse: collapse; width: 100%;">`;
      html += `<tr style="background: #f5f5f5;">`;
      html += `<th style="border: 1px solid #ddd; padding: 8px;">Persona</th>`;
      html += `<th style="border: 1px solid #ddd; padding: 8px;">R</th>`;
      html += `<th style="border: 1px solid #ddd; padding: 8px;">P</th>`;
      html += `<th style="border: 1px solid #ddd; padding: 8px;">A</th>`;
      html += `<th style="border: 1px solid #ddd; padding: 8px;">I</th>`;
      html += `<th style="border: 1px solid #ddd; padding: 8px;">T</th>`;
      html += `</tr>`;

      data.personas.forEach(persona => {
        html += `<tr>`;
        html += `<td style="border: 1px solid #ddd; padding: 8px;">${persona.name}</td>`;
        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${persona.rpait.Representation}</td>`;
        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${persona.rpait.Philosophy}</td>`;
        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${persona.rpait.Aesthetics}</td>`;
        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${persona.rpait.Interpretation}</td>`;
        html += `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${persona.rpait.Technique}</td>`;
        html += `</tr>`;
      });

      html += `</table>`;
      html += `<p style="font-size: 10px; color: #999;">${data.exportDate}</p>`;
      html += `</div>`;
      return html;
    } else {
      // Single persona data
      let html = `<div style="font-family: sans-serif; font-size: 12px;">`;
      html += `<h3>${data.artwork.title} (${data.artwork.year})</h3>`;
      html += `<p><strong>Persona:</strong> ${data.persona}</p>`;
      html += `<table style="border-collapse: collapse;">`;
      html += `<tr style="background: #f5f5f5;"><th style="border: 1px solid #ddd; padding: 8px;">Dimension</th><th style="border: 1px solid #ddd; padding: 8px;">Score</th></tr>`;

      Object.entries(data.rpait).forEach(([dim, score]) => {
        html += `<tr><td style="border: 1px solid #ddd; padding: 8px;">${dim}</td><td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${score}</td></tr>`;
      });

      html += `</table>`;
      html += `<p style="font-size: 10px; color: #999;">${data.exportDate}</p>`;
      html += `</div>`;
      return html;
    }
  }
}

// Make globally accessible
window.DataExporter = DataExporter;
