/* ==========================================================================
   KruMate OS — Export helpers
   Pure ports of js/app.js textFor / renderPrintHTML / copy / download / print,
   with UI.toast replaced by a toast-callback param and UI.sanitize replaced by
   the imported helper. Output strings preserved byte-for-byte.
   ========================================================================== */
import { labelFor } from '../data/types.js';
import { t as i18nT } from '../services/i18n.js';
import { sanitize } from './format.js';

function typeLabel(item) {
  return i18nT(labelFor(item.type));
}

export function textFor(item) {
  const label = typeLabel(item);
  let s = item.title + '\n(' + label + ' · ' + (item.grade || '') + ' · ' + (item.subject || '') + ')\n\n';
  if (item.type === 'lesson') {
    s += 'OBJECTIVES\n' + item.objectives.map(o => '• ' + o).join('\n') + '\n\n';
    s += 'MATERIALS\n' + item.materials.map(o => '• ' + o).join('\n') + '\n\n';
    s += 'PROCEDURE\n' + item.procedure.map(p => p.phase + ' (' + p.time + '): ' + p.detail).join('\n') + '\n\n';
    s += 'ASSESSMENT\n' + item.assessment.map(a => '• ' + a).join('\n');
  } else if (item.type === 'worksheet') {
    s += 'INSTRUCTIONS\n' + item.instructions + '\n\n';
    item.sections.forEach(sec => {
      s += sec.heading.toUpperCase() + '\n' + sec.tasks.map(task => '1. ' + task).join('\n') + '\n\n';
    });
  } else if (item.type === 'quiz') {
    item.questions.forEach((q, i) => {
      s += (i + 1) + '. ' + q.question + '\n';
      if (q.options) q.options.forEach((o, oi) => { s += '   ' + String.fromCharCode(65 + oi) + '. ' + o + '\n'; });
      s += '   [' + q.answer + ']\n\n';
    });
  } else if (item.type === 'rubric') {
    s += 'SCALE: ' + item.scale.join(' | ') + '\n\n';
    item.criteria.forEach(c => {
      s += c.name.toUpperCase() + '\n' + c.rows.map((r, i) => '  ' + (i + 1) + ') ' + r).join('\n') + '\n\n';
    });
  } else if (item.type === 'activity') {
    s += 'OBJECTIVE\n' + item.objective + '\n\n';
    s += 'TIME: ' + item.time + ' · GROUP: ' + item.groupSize + '\n\n';
    s += 'MATERIALS\n' + item.materials.map(m => '• ' + m).join('\n') + '\n\n';
    s += 'STEPS\n' + item.steps.map(st => st.time + ' — ' + st.detail).join('\n') + '\n\n';
    s += 'DISCUSSION\n' + item.discussion.map(d => 'Q: ' + d).join('\n');
  } else {
    item.slides.forEach((sl, i) => {
      s += '--- Slide ' + (i + 1) + ': ' + sl.title + ' ---\n' + (sl.subtitle ? sl.subtitle + '\n' : '') + (sl.bullets || []).map(b => '• ' + b).join('\n') + '\n\n';
    });
  }
  return s;
}

export function renderPrintHTML(item) {
  const label = typeLabel(item);
  let s = `<h1>${sanitize(item.title)}</h1><p>(KruMate · ${sanitize(label)}${item.grade ? ' · ' + sanitize(item.grade) : ''}${item.subject ? ' · ' + sanitize(item.subject) : ''})</p>`;
  if (item.type === 'lesson') {
    s += '<h2>Objectives</h2><ul>' + item.objectives.map(o => `<li>${sanitize(o)}</li>`).join('') + '</ul>';
    s += '<h2>Materials</h2><ul>' + item.materials.map(o => `<li>${sanitize(o)}</li>`).join('') + '</ul>';
    s += '<h2>Procedure</h2><ol>' + item.procedure.map(p => `<li class="avoid"><strong>${sanitize(p.phase)} (${sanitize(p.time)})</strong> — ${sanitize(p.detail)}</li>`).join('') + '</ol>';
    s += '<h2>Assessment</h2><ul>' + item.assessment.map(a => `<li>${sanitize(a)}</li>`).join('') + '</ul>';
  } else if (item.type === 'worksheet') {
    s += '<p><strong>Instructions:</strong> ' + sanitize(item.instructions) + '</p>';
    item.sections.forEach(sec => {
      s += `<h2>${sanitize(sec.heading)}</h2><ol>${sec.tasks.map(task => `<li class="avoid">${sanitize(task)}</li>`).join('')}</ol>`;
    });
  } else if (item.type === 'quiz') {
    item.questions.forEach((q, i) => {
      s += `<div class="avoid"><p><strong>${i + 1}. ${sanitize(q.question)}</strong></p>`;
      if (q.options) s += '<p>' + q.options.map((o, oi) => `${String.fromCharCode(65 + oi)}. ${sanitize(o)}`).join(' &nbsp;·&nbsp; ') + '</p>';
      s += `<p style="color:#666"><em>${sanitize(q.answer)}</em></p></div>`;
    });
  } else if (item.type === 'rubric') {
    s += '<table style="width:100%;border-collapse:collapse">' +
      '<tr style="background:#FBF3E8"><th style="border:1px solid #E5D9C8;padding:8px;text-align:left">Criteria</th>' +
      item.scale.map(sc => `<th style="border:1px solid #E5D9C8;padding:8px;text-align:left;font-size:.85em">${sanitize(sc)}</th>`).join('') + '</tr>' +
      item.criteria.map(c =>
        '<tr><td style="border:1px solid #E5D9C8;padding:8px"><strong>' + sanitize(c.name) + '</strong></td>' +
        c.rows.map(r => `<td style="border:1px solid #E5D9C8;padding:8px">${sanitize(r)}</td>`).join('') + '</tr>').join('') +
      '</table>';
  } else if (item.type === 'activity') {
    s += '<p><strong>Objective:</strong> ' + sanitize(item.objective) + '</p>';
    s += '<p><strong>' + sanitize(item.time) + '</strong> · <strong>' + sanitize(item.groupSize) + '</strong></p>';
    s += '<h2>Materials</h2><ul>' + item.materials.map(m => `<li>${sanitize(m)}</li>`).join('') + '</ul>';
    s += '<h2>Steps</h2><ol>' + item.steps.map(st => `<li class="avoid"><strong>${sanitize(st.time)}</strong> — ${sanitize(st.detail)}</li>`).join('') + '</ol>';
    s += '<h2>Discussion questions</h2><ul>' + item.discussion.map(d => `<li>${sanitize(d)}</li>`).join('') + '</ul>';
  } else {
    item.slides.forEach((sl, i) => {
      s += `<div class="avoid"><h3>Slide ${i + 1}: ${sanitize(sl.title)}</h3>${sl.subtitle ? '<p>' + sanitize(sl.subtitle) + '</p>' : ''}<ul>${(sl.bullets || []).map(b => `<li>${sanitize(b)}</li>`).join('')}</ul></div>`;
    });
  }
  return s;
}

export function copyItem(item, toast) {
  navigator.clipboard.writeText(textFor(item)).then(() => toast(i18nT('content.toastCopied'), 'ok'));
}

export function downloadItem(item, toast) {
  const blob = new Blob([textFor(item)], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (item.title || 'material').replace(/[^\w\u0E00-\u0E7F-]+/g, '_') + '.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(i18nT('content.toastDownloaded'));
}

export function printItem(item) {
  const root = document.getElementById('print-root');
  root.innerHTML = renderPrintHTML(item);
  window.print();
}

export async function exportAsImage(contentBodyRef, item, toast) {
  // ตรวจสอบว่า ref ชี้ไปที่ element จริงๆ
  const element = contentBodyRef?.current;
  if (!element) {
    toast('ไม่พบเนื้อหาที่จะบันทึก', 'error');
    return;
  }

  try {
    toast('กำลังสร้างรูปภาพ...');

    // โหลด html2canvas แบบ dynamic import (ไม่ต้อง import ที่บนไฟล์)
    const html2canvas = (await import('html2canvas')).default;

    // ถ่ายรูป element นั้น
    const canvas = await html2canvas(element, {
      scale: 2,              // ความละเอียดสูง (Retina)
      useCORS: true,         // รองรับรูปจาก URL อื่น
      backgroundColor: '#ffffff',  // พื้นหลังขาว
      logging: false,
      onclone: doc => {
        const el = doc.getElementById('slide-capture');
        if (el) {
          el.style.left = '0px';
          el.style.position = 'absolute';
          el.style.top = '0px';
        }
      },
    });

    // แปลง canvas เป็น PNG แล้ว download
    const link = document.createElement('a');
    link.download = (item.title || 'material')
      .replace(/[^\w\u0E00-\u0E7F-]+/g, '_') + '.png';  // รองรับชื่อไฟล์ภาษาไทย
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast('บันทึกรูปภาพสำเร็จ', 'ok');
  } catch (err) {
    console.error('Export image failed:', err);
    toast('บันทึกรูปภาพไม่สำเร็จ', 'error');
  }
}
