document.addEventListener('DOMContentLoaded', async ()=>{
  const $ = id => document.getElementById(id);
  const fmtINR = v => '₹' + Number(v).toLocaleString('en-IN');

  async function loadDashboard(){
    try{
      const res = await fetch('/dashboard');
      const data = await res.json();
      $('avgYield').textContent = data.avg_yield_t_per_ha.toFixed(2);
      $('rainAde').textContent = data.rainfall_adequacy_pct + '%';
      $('medProfit').textContent = fmtINR(data.median_profit_inr);

      // bar chart
      const labels = Object.keys(data.district_avg_yields);
      const vals = Object.values(data.district_avg_yields);
      if(window.barChart) window.barChart.destroy();
      const ctx = document.getElementById('barYield').getContext('2d');
      window.barChart = new Chart(ctx, {type:'bar', data:{labels:labels, datasets:[{label:'t/ha', data:vals}]}, options:{responsive:true}});

      // pie risk
      const rlabels = Object.keys(data.risk_share_pct);
      const rvals = Object.values(data.risk_share_pct);
      if(window.pieChart) window.pieChart.destroy();
      const ctx2 = document.getElementById('pieRisk').getContext('2d');
      window.pieChart = new Chart(ctx2, {type:'pie', data:{labels:rlabels, datasets:[{data:rvals}]}, options:{responsive:true}});

      // alerts
      const alertsBody = $('alertsBody');
      alertsBody.innerHTML = data.alerts.length ? data.alerts.map(a=>`<tr><td>${a.date}</td><td>${a.loc}</td><td>${a.type}</td><td>${a.msg}</td></tr>`).join('') : '<tr><td colspan="4">No alerts</td></tr>';
    }catch(err){
      console.error(err);
    }
  }

  async function loadHistory(){
    try{
      const res = await fetch('/history?top=6');
      const data = await res.json();
      const labels = Array.from({length:8}).map((_,i)=>`T-${8-i}`);
      const datasets = Object.entries(data).map(([k,s],i)=>({label:k, data:s, fill:false, tension:0.3}));
      if(window.lineChart) window.lineChart.destroy();
      const ctx = document.getElementById('lineHist').getContext('2d');
      window.lineChart = new Chart(ctx, {type:'line', data:{labels:labels, datasets:datasets}, options:{responsive:true}});
    }catch(e){ console.error(e); }
  }

  await loadDashboard();
  await loadHistory();

  document.getElementById('refreshBtn').addEventListener('click', async ()=>{
    document.getElementById('refreshBtn').disabled = true;
    await loadDashboard(); await loadHistory();
    setTimeout(()=>document.getElementById('refreshBtn').disabled=false,500);
  });
});