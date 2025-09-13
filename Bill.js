    // Slab rates (ascending)
    const slabs = [
      { upto: 100, rate: 4.2 },
      { upto: 200, rate: 6 },
      { upto: 400, rate: 8 },
      { upto: Infinity, rate: 13 }
    ];

    const unitsInput = document.getElementById('units');
    const calcBtn = document.getElementById('calc');
    const resetBtn = document.getElementById('reset');
    const amountEl = document.getElementById('amount');
    const breakdownEl = document.getElementById('breakdown');

    function calculateBill(units) {
      units = Number(units);
      if (!Number.isFinite(units) || units < 0) return null;

      let remaining = units;
      let total = 0;
      let prevLimit = 0;
      const parts = [];

      for (const slab of slabs) {
        const slabMax = slab.upto;
        const slabUnits = Math.max(0, Math.min(remaining, slabMax - prevLimit));
        if (slabUnits > 0) {
          const slabCost = slabUnits * slab.rate;
          total += slabCost;
          parts.push({ units: slabUnits, rate: slab.rate, cost: slabCost });
          remaining -= slabUnits;
        }
        prevLimit = slabMax;
        if (remaining <= 0) break;
      }

      return { total, parts };
    }

    function formatINR(x) {
      return '₹ ' + x.toFixed(2);
    }

    calcBtn.addEventListener('click', () => {
      const units = unitsInput.value.trim();
      if (units === '') {
        alert('Please enter units (non-negative).');
        unitsInput.focus();
        return;
      }
      const u = Number(units);
      if (!Number.isFinite(u) || u < 0) {
        alert('Enter a valid non-negative number for units.');
        unitsInput.focus();
        return;
      }

      const result = calculateBill(u);
      if (!result) return;

      amountEl.textContent = formatINR(result.total);

      // create breakdown text
      const partsText = result.parts.map(p => `${p.units}u × ₹${p.rate} = ${formatINR(p.cost)}`).join(' • ');
      breakdownEl.textContent = partsText || '—';
    });

    resetBtn.addEventListener('click', () => {
      unitsInput.value = '';
      amountEl.textContent = '—';
      breakdownEl.textContent = '—';
      unitsInput.focus();
    });

    // Allow Enter key in input to calculate
    unitsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        calcBtn.click();
      }
    });
