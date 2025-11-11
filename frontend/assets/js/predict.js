document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('predictForm');
  const result = document.getElementById('result');
  const yieldChart = document.getElementById('yieldChart');
  const fmtINR = v=>'₹'+Number(v).toLocaleString('en-IN');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    result.innerHTML = '<div class="card">Predicting…</div>';
    const fd = Object.fromEntries(new FormData(form).entries());
    ['area','ph','n','p','k','temp','rain','mandi_price'].forEach(k=>{ if(fd[k]!=null) fd[k]=Number(fd[k]) || 0 });
    fd.crop = (fd.crop||'').toLowerCase(); fd.season=(fd.season||'').toLowerCase();
    try {
  // 🔗 Backend (Render) se connect karne ke liye full URL use karo
  const res = await fetch('https://cropiq1.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fd)
  });

  const j = await res.json();
  const mandi = Number(fd.mandi_price) || 8000;
  const profit = Math.round(j.predicted_yield_t_per_ha * mandi);

  // ✨ Show result on page
  result.innerHTML = `
    <div class="card">
      <h3>Prediction</h3>
      <p><b>${j.predicted_yield_t_per_ha} t/ha</b> — Total: <b>${j.predicted_total_tons} tons</b></p>
      <p>Est. profit: <b>${fmtINR(profit)}</b> (@${fmtINR(mandi)} per ton)</p>
    </div>
  `;

  // 📊 Draw comparison chart
  try {
    const dash = await fetch('https://cropiq1.onrender.com/dashboard');
    const dd = await dash.json();

    let cropAvg = dd.avg_yield_t_per_ha;
    for (const k of Object.keys(dd.district_avg_yields)) {
      if (k.toLowerCase() == fd.crop) cropAvg = dd.district_avg_yields[k];
    }

    if (window.predictChart) window.predictChart.destroy();
    const ctx = yieldChart.getContext('2d');
    window.predictChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Predicted', 'Avg (' + fd.crop + ')'],
        datasets: [{
          label: 't/ha',
          data: [j.predicted_yield_t_per_ha, cropAvg]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

  } catch (e) {
    console.warn(e);
  }

} catch (err) {
  console.error(err);
  result.innerHTML = '<div class="card"><b>Error</b> ' + err.message + '</div>';
}

  });
});