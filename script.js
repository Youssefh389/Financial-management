document.addEventListener("DOMContentLoaded", function () {

  // التنقل بين الصفحات

  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach(btn => {

    btn.addEventListener("click", function () {

      const target = this.getAttribute("data-target");

      showPage(target);

    });

  });

  function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {

      page.classList.remove("active");

    });

    document.getElementById(pageId).classList.add("active");

  }

  // استرجاع البيانات من localStorage

  let collectionsData = JSON.parse(localStorage.getItem("collectionsData")) || [];

  let expensesData = JSON.parse(localStorage.getItem("expensesData")) || [];

  // بيانات صافي المتحصلات تُحسب بناءً على بيانات المتحصلات والمصروفات

  // دالة الحصول على التاريخ الحالي بصيغة YYYY-MM-DD

  function getCurrentDate() {

    const d = new Date();

    const year = d.getFullYear();

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }

  // دالة حفظ البيانات في localStorage

  function saveData() {

    localStorage.setItem("collectionsData", JSON.stringify(collectionsData));

    localStorage.setItem("expensesData", JSON.stringify(expensesData));

  }

  /* ===== المتحصلات ===== */

  const addCollectionBtn = document.getElementById("addCollectionBtn");

  const collectionFormContainer = document.getElementById("collectionFormContainer");

  const collectionForm = document.getElementById("collectionForm");

  const cancelCollectionBtn = document.getElementById("cancelCollection");

  addCollectionBtn.addEventListener("click", function () {

    collectionFormContainer.classList.remove("hidden");

    document.getElementById("collectionDate").value = getCurrentDate();

  });

  cancelCollectionBtn.addEventListener("click", function () {

    collectionFormContainer.classList.add("hidden");

    collectionForm.reset();

  });

  collectionForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const newCollection = {

      id: Date.now(),

      date: document.getElementById("collectionDate").value,

      name: document.getElementById("collectionName").value,

      amount: parseFloat(document.getElementById("collectionAmount").value)

    };

    collectionsData.push(newCollection);

    saveData();

    updateCollectionsTable();

    updateCollectionsStats();

    updateNetCollections();

    collectionForm.reset();

    collectionFormContainer.classList.add("hidden");

  });

  function updateCollectionsTable() {

    const tbody = document.querySelector("#collectionsTable tbody");

    tbody.innerHTML = "";

    collectionsData.forEach(item => {

      const tr = document.createElement("tr");

      tr.innerHTML = `

        <td>${item.date}</td>

        <td>${item.name}</td>

        <td>${item.amount.toFixed(2)}</td>

        <td class="actions">

          <button class="editCollection" data-id="${item.id}" title="تعديل">

            <svg class="icon edit-icon" width="16" height="16" viewbox="0 0 24 24" fill="currentColor">

              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z"></path>

            </svg>

          </button>

          <button class="deleteCollection" data-id="${item.id}" title="حذف">

            <svg class="icon delete-icon" width="16" height="16" viewbox="0 0 24 24" fill="currentColor">

              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"></path>

            </svg>

          </button>

        </td>

      `;

      tbody.appendChild(tr);

    });

    document.querySelectorAll(".deleteCollection").forEach(btn => {

      btn.addEventListener("click", function () {

        const id = parseInt(this.getAttribute("data-id"));

        collectionsData = collectionsData.filter(item => item.id !== id);

        saveData();

        updateCollectionsTable();

        updateCollectionsStats();

        updateNetCollections();

      });

    });

    document.querySelectorAll(".editCollection").forEach(btn => {

      btn.addEventListener("click", function () {

        const id = parseInt(this.getAttribute("data-id"));

        const item = collectionsData.find(i => i.id === id);

        if (item) {

          document.getElementById("collectionDate").value = item.date;

          document.getElementById("collectionName").value = item.name;

          document.getElementById("collectionAmount").value = item.amount;

          collectionFormContainer.classList.remove("hidden");

          collectionsData = collectionsData.filter(i => i.id !== id);

        }

      });

    });

  }

  function updateCollectionsStats() {

    const today = getCurrentDate();

    const dailyTotal = collectionsData

      .filter(item => item.date === today)

      .reduce((sum, item) => sum + item.amount, 0);

    document.getElementById("dailyCollections").textContent = dailyTotal.toFixed(2);

    const currentDate = new Date();

    const dayOfWeek = currentDate.getDay(); // اعتبار الأحد أول الأسبوع

    const startOfWeek = new Date(currentDate);

    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const weekTotal = collectionsData

      .filter(item => {

        const itemDate = new Date(item.date);

        return itemDate >= startOfWeek && itemDate <= currentDate;

      })

      .reduce((sum, item) => sum + item.amount, 0);

    document.getElementById("weeklyCollections").textContent = weekTotal.toFixed(2);

  }

  /* ===== المصروفات ===== */

  const addExpenseBtn = document.getElementById("addExpenseBtn");

  const expenseFormContainer = document.getElementById("expenseFormContainer");

  const expenseForm = document.getElementById("expenseForm");

  const cancelExpenseBtn = document.getElementById("cancelExpense");

  addExpenseBtn.addEventListener("click", function () {

    expenseFormContainer.classList.remove("hidden");

    document.getElementById("expenseDate").value = getCurrentDate();

  });

  cancelExpenseBtn.addEventListener("click", function () {

    expenseFormContainer.classList.add("hidden");

    expenseForm.reset();

  });

  expenseForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const newExpense = {

      id: Date.now(),

      date: document.getElementById("expenseDate").value,

      reason: document.getElementById("expenseReason").value,

      amount: parseFloat(document.getElementById("expenseAmount").value)

    };

    expensesData.push(newExpense);

    saveData();

    updateExpensesTable();

    updateExpensesStats();

    updateNetCollections();

    expenseForm.reset();

    expenseFormContainer.classList.add("hidden");

  });

  function updateExpensesTable() {

    const tbody = document.querySelector("#expensesTable tbody");

    tbody.innerHTML = "";

    expensesData.forEach(item => {

      const tr = document.createElement("tr");

      tr.innerHTML = `

        <td>${item.date}</td>

        <td>${item.reason}</td>

        <td>${item.amount.toFixed(2)}</td>

        <td class="actions">

          <button class="editExpense" data-id="${item.id}" title="تعديل">

            <svg class="icon edit-icon" width="16" height="16" viewbox="0 0 24 24" fill="currentColor">

              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z"></path>

            </svg>

          </button>

          <button class="deleteExpense" data-id="${item.id}" title="حذف">

            <svg class="icon delete-icon" width="16" height="16" viewbox="0 0 24 24" fill="currentColor">

              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"></path>

            </svg>

          </button>

        </td>

      `;

      tbody.appendChild(tr);

    });

    document.querySelectorAll(".deleteExpense").forEach(btn => {

      btn.addEventListener("click", function () {

        const id = parseInt(this.getAttribute("data-id"));

        expensesData = expensesData.filter(item => item.id !== id);

        saveData();

        updateExpensesTable();

        updateExpensesStats();

        updateNetCollections();

      });

    });

    document.querySelectorAll(".editExpense").forEach(btn => {

      btn.addEventListener("click", function () {

        const id = parseInt(this.getAttribute("data-id"));

        const item = expensesData.find(i => i.id === id);

        if (item) {

          document.getElementById("expenseDate").value = item.date;

          document.getElementById("expenseReason").value = item.reason;

          document.getElementById("expenseAmount").value = item.amount;

          expenseFormContainer.classList.remove("hidden");

          expensesData = expensesData.filter(i => i.id !== id);

        }

      });

    });

  }

  function updateExpensesStats() {

    const today = getCurrentDate();

    const dailyTotal = expensesData

      .filter(item => item.date === today)

      .reduce((sum, item) => sum + item.amount, 0);

    document.getElementById("dailyExpenses").textContent = dailyTotal.toFixed(2);

    const currentDate = new Date();

    const dayOfWeek = currentDate.getDay();

    const startOfWeek = new Date(currentDate);

    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const weekTotal = expensesData

      .filter(item => {

        const itemDate = new Date(item.date);

        return itemDate >= startOfWeek && itemDate <= currentDate;

      })

      .reduce((sum, item) => sum + item.amount, 0);

    document.getElementById("weeklyExpenses").textContent = weekTotal.toFixed(2);

  }

  /* ===== صافي المتحصلات ===== */

  function updateNetCollections() {

    const tbody = document.querySelector("#netCollectionsTable tbody");

    tbody.innerHTML = "";

    const currentDate = new Date();

    const dayOfWeek = currentDate.getDay();

    const startOfWeek = new Date(currentDate);

    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const weekCollections = collectionsData

      .filter(item => {

        const itemDate = new Date(item.date);

        return itemDate >= startOfWeek && itemDate <= currentDate;

      })

      .reduce((sum, item) => sum + item.amount, 0);

    const weekExpenses = expensesData

      .filter(item => {

        const itemDate = new Date(item.date);

        return itemDate >= startOfWeek && itemDate <= currentDate;

      })

      .reduce((sum, item) => sum + item.amount, 0);

    const net = weekCollections - weekExpenses;

    const tr = document.createElement("tr");

    tr.innerHTML = `

      <td>${getCurrentDate()}</td>

      <td>${weekExpenses.toFixed(2)}</td>

      <td>${weekCollections.toFixed(2)}</td>

      <td>${net.toFixed(2)}</td>

      <td class="actions">

        <button class="deleteNet" data-week="${getCurrentDate()}" title="حذف">

          <svg class="icon delete-icon" width="16" height="16" viewbox="0 0 24 24" fill="currentColor">

            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"></path>

          </svg>

        </button>

      </td>

    `;

    tbody.appendChild(tr);

  }

  // تحديث الجداول والإحصائيات عند بدء التشغيل

  updateCollectionsTable();

  updateCollectionsStats();

  updateExpensesTable();

  updateExpensesStats();

  updateNetCollections();

  // حفظ البيانات عند الخروج

  window.addEventListener("beforeunload", saveData);

  /* ===== إنشاء صناديق الشهور السابقة مع أزرار الأسابيع ===== */

  function createMonthBoxes(containerId, pageType) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    for (let m = 1; m <= 3; m++) {

      const monthBox = document.createElement("div");

      monthBox.className = "month-box";

      // أيقونة صغيرة لصندوق الشهر

      const icon = document.createElement("span");

      icon.className = "month-icon";

      icon.innerHTML = `<svg width="16" height="16" viewbox="0 0 24 24" fill="currentColor">

        <path d="M3 4h18v2H3zM3 10h18v2H3zM3 16h18v2H3z"></path>

      </svg>`;

      monthBox.appendChild(icon);

      const title = document.createElement("span");

      title.textContent = `شهر سابق ${m}`;

      monthBox.appendChild(title);

      // أزرار الأسابيع (4 أسابيع)

      const weeksContainer = document.createElement("div");

      weeksContainer.className = "weeks-container";

      for (let w = 1; w <= 4; w++) {

        const weekBtn = document.createElement("button");

        weekBtn.className = "week-btn";

        weekBtn.textContent = `أسبوع ${w}`;

        weekBtn.addEventListener("click", function () {

          showWeeklyDetails(pageType, m, w);

        });

        weeksContainer.appendChild(weekBtn);

      }

      monthBox.appendChild(weeksContainer);

      container.appendChild(monthBox);

    }

  }

  createMonthBoxes("collectionsMonths", "collections");

  createMonthBoxes("expensesMonths", "expenses");

  createMonthBoxes("netMonths", "net");

  /* ===== حساب الفترة الزمنية لأسبوع محدد ===== */

  function getWeekRange(monthOffset, weekNumber) {

    const current = new Date();

    // الحصول على الشهر الهدف بطرح عدد الأشهر المطلوبة

    let targetDate = new Date(current.getFullYear(), current.getMonth() - monthOffset, 1);

    const year = targetDate.getFullYear();

    const month = targetDate.getMonth();

    let startDay, endDay;

    if (weekNumber === 1) {

      startDay = 1; endDay = 7;

    } else if (weekNumber === 2) {

      startDay = 8; endDay = 14;

    } else if (weekNumber === 3) {

      startDay = 15; endDay = 21;

    } else if (weekNumber === 4) {

      startDay = 22;

      endDay = new Date(year, month + 1, 0).getDate();

    }

    let start = new Date(year, month, startDay);

    let end = new Date(year, month, endDay);

    end.setHours(23, 59, 59, 999);

    return { start, end };

  }

  /* ===== عرض تفاصيل الأسبوع مع خاصية التبديل (Toggle) ===== */

  function showWeeklyDetails(pageType, monthOffset, weekNumber) {

    let weekId = `${pageType}_${monthOffset}_${weekNumber}`;

    let container;

    if (pageType === "collections") {

      container = document.getElementById("collectionsWeekDetails");

    } else if (pageType === "expenses") {

      container = document.getElementById("expensesWeekDetails");

    } else if (pageType === "net") {

      container = document.getElementById("netWeekDetails");

    }

    // إذا كانت التفاصيل معروضة لنفس الأسبوع، نقوم بإخفائها عند النقر مرة ثانية

    if (!container.classList.contains("hidden") && container.getAttribute("data-week-id") === weekId) {

      container.classList.add("hidden");

      container.removeAttribute("data-week-id");

      return;

    }

    container.setAttribute("data-week-id", weekId);

    const { start, end } = getWeekRange(monthOffset, weekNumber);

    let html = "";

    if (pageType === "collections") {

      let filtered = collectionsData.filter(item => {

        let itemDate = new Date(item.date);

        return itemDate >= start && itemDate <= end;

      });

      html += `<h3>تفاصيل المتحصلات للفترة ${start.toLocaleDateString()} - ${end.toLocaleDateString()}</h3>`;

      if (filtered.length > 0) {

        html += `<table>

                  <thead>

                    <tr><th>التاريخ</th><th>الاسم</th><th>المبلغ</th></tr>

                  </thead>

                  <tbody>`;

        let total = 0;

        filtered.forEach(item => {

          total += item.amount;

          html += `<tr>

                    <td>${item.date}</td>

                    <td>${item.name}</td>

                    <td>${item.amount.toFixed(2)}</td>

                  </tr>`;

        });

        html += `</tbody>

                <tfoot>

                  <tr>

                    <td colspan="2">الإجمالي الأسبوعي</td>

                    <td>${total.toFixed(2)}</td>

                  </tr>

                </tfoot>

              </table>`;

      } else {

        html += `<p>لا توجد بيانات لهذه الفترة.</p>`;

      }

    } else if (pageType === "expenses") {

      let filtered = expensesData.filter(item => {

        let itemDate = new Date(item.date);

        return itemDate >= start && itemDate <= end;

      });

      html += `<h3>تفاصيل المصروفات للفترة ${start.toLocaleDateString()} - ${end.toLocaleDateString()}</h3>`;

      if (filtered.length > 0) {

        html += `<table>

                  <thead>

                    <tr><th>التاريخ</th><th>السبب</th><th>المبلغ</th></tr>

                  </thead>

                  <tbody>`;

        let total = 0;

        filtered.forEach(item => {

          total += item.amount;

          html += `<tr>

                    <td>${item.date}</td>

                    <td>${item.reason}</td>

                    <td>${item.amount.toFixed(2)}</td>

                  </tr>`;

        });

        html += `</tbody>

                <tfoot>

                  <tr>

                    <td colspan="2">الإجمالي الأسبوعي</td>

                    <td>${total.toFixed(2)}</td>

                  </tr>

                </tfoot>

              </table>`;

      } else {

        html += `<p>لا توجد بيانات لهذه الفترة.</p>`;

      }

    } else if (pageType === "net") {

      let collFiltered = collectionsData.filter(item => {

        let itemDate = new Date(item.date);

        return itemDate >= start && itemDate <= end;

      });

      let expFiltered = expensesData.filter(item => {

        let itemDate = new Date(item.date);

        return itemDate >= start && itemDate <= end;

      });

      let totalColl = collFiltered.reduce((sum, item) => sum + item.amount, 0);

      let totalExp = expFiltered.reduce((sum, item) => sum + item.amount, 0);

      let net = totalColl - totalExp;

      html += `<h3>تفاصيل صافي المتحصلات للفترة ${start.toLocaleDateString()} - ${end.toLocaleDateString()}</h3>`;

      html += `<table>

                <thead>

                  <tr><th>المجموعات</th><th>المصروفات</th><th>الصافي</th></tr>

                </thead>

                <tbody>

                  <tr>

                    <td>${totalColl.toFixed(2)}</td>

                    <td>${totalExp.toFixed(2)}</td>

                    <td>${net.toFixed(2)}</td>

                  </tr>

                </tbody>

              </table>`;

    }

    container.innerHTML = html;

    container.classList.remove("hidden");

  }

});