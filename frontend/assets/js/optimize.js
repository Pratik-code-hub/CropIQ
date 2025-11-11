document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('runOpt');
  const out = document.getElementById('optResult');
  btn.addEventListener('click', ()=>{
    const crop = document.getElementById('optCrop').value;
    const moist = Number(document.getElementById('moist').value);
    const rf7 = Number(document.getElementById('rf7').value);
    const n2 = Number(document.getElementById('n2').value);
    const price = Number(document.getElementById('price').value);
    const area2 = Number(document.getElementById('area2').value);
    const recs = [];
    if (moist < 40 && rf7 < 30) recs.push('Irrigate 35–45 mm every 3 days.');
    else if (moist > 70) recs.push('Skip next irrigation; soil moisture high.');
    else recs.push('Irrigate 25–30 mm in 4–5 days.');
    if (n2 < 80) recs.push('Apply 50 kg/ha Urea split in 2 doses.');
    else if (n2 > 150) recs.push('Avoid extra nitrogen.');
    else recs.push('Maintain current nitrogen levels.');
    if (crop==='paddy' && rf7 < 20) recs.push('Consider short-duration paddy variety.');
    const demoYield = 3.8;
    const rev = demoYield * price;
    const cost = 12000;
    const profit = rev - cost;
    out.innerHTML = '<h3>Result</h3>' + recs.map(r=>`<div class="card"><p class="small">${r}</p></div>`).join('')+`<hr/><p><b>Revenue/ha:</b> ₹${rev} <b>Profit/ha:</b> ₹${profit}</p>`;
    const ctx = document.getElementById('profitChart');
    if (ctx){
      if(window._profitChart) window._profitChart.destroy();
      window._profitChart = new Chart(ctx, {type:'bar', data:{labels:['Revenue','Cost','Profit'], datasets:[{label:'₹', data:[rev, cost, profit]}]}});
    }
  });
});


