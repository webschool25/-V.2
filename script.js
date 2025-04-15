document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const pages = document.querySelectorAll('.page');
    const tabHome = document.getElementById('tab-home');
    const tabInput = document.getElementById('tab-input');
    const tabResults = document.getElementById('tab-results');
    const calculateBtn = document.getElementById('calculate-btn');
    const recalculateBtn = document.getElementById('recalculate-btn');
    const modeToggle = document.getElementById('mode-toggle');
    const modeLabel = document.getElementById('mode-label');
    
    // Select Elements
    const birthDay = document.getElementById('birth-day');
    const birthMonth = document.getElementById('birth-month');
    const birthYear = document.getElementById('birth-year');
    const workDay = document.getElementById('work-day');
    const workMonth = document.getElementById('work-month');
    const workYear = document.getElementById('work-year');
    
    // Result Elements
    const birthDateResult = document.getElementById('birth-date-result');
    const birthDayOfWeek = document.getElementById('birth-day-of-week');
    const ageResult = document.getElementById('age-result');
    const ageSliderFill = document.getElementById('age-slider-fill');
    const workDateResult = document.getElementById('work-date-result');
    const workDayOfWeek = document.getElementById('work-day-of-week');
    const workAgeResult = document.getElementById('work-age-result');
    const workAgeSliderFill = document.getElementById('work-age-slider-fill');
    const retirementDateContainer = document.getElementById('retirement-date-container');
    const retirementDateResult = document.getElementById('retirement-date-result');
    const retirementDayOfWeek = document.getElementById('retirement-day-of-week');
    
    // ตั้งค่าเริ่มต้น
    let isGovernmentMode = false;
    if (modeToggle) {
        modeToggle.checked = false;
    }
    
    // ข้อมูลสำหรับการสร้างตัวเลือก
    const thaiMonths = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    const thaiDaysOfWeek = [
        "วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"
    ];
    
    // สร้างตัวเลือกวัน (1-31)
    function populateDays(selectElement) {
        selectElement.innerHTML = '<option value="" disabled selected>วัน</option>';
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectElement.appendChild(option);
        }
    }
    
    // สร้างตัวเลือกเดือน (มกราคม-ธันวาคม)
    function populateMonths(selectElement) {
        selectElement.innerHTML = '<option value="" disabled selected>เดือน</option>';
        for (let i = 0; i < 12; i++) {
            const option = document.createElement('option');
            option.value = i + 1; // เดือนเริ่มจาก 1
            option.textContent = thaiMonths[i];
            selectElement.appendChild(option);
        }
    }
    
    // สร้างตัวเลือกปี (ปัจจุบัน-ย้อนหลัง 100 ปี)
    function populateYears(selectElement) {
        const currentYear = new Date().getFullYear();
        selectElement.innerHTML = '<option value="" disabled selected>ปี</option>';
        for (let i = 0; i <= 100; i++) {
            const year = currentYear - i;
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + 543; // แปลงเป็นปี พ.ศ.
            selectElement.appendChild(option);
        }
    }
    
    // สร้างตัวเลือกทั้งหมด
    populateDays(birthDay);
    populateMonths(birthMonth);
    populateYears(birthYear);
    populateDays(workDay);
    populateMonths(workMonth);
    populateYears(workYear);
    
    // สลับไปยังหน้าที่ระบุ
    function switchPage(pageId) {
        // ซ่อนทุกหน้า
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // แสดงหน้าที่เลือก
        document.getElementById(pageId).classList.add('active');
        
        // อัปเดตแถบแท็บ
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // เลือกแท็บที่สอดคล้องกับหน้า
        if (pageId === 'page-home') {
            tabHome.classList.add('active');
        } else if (pageId === 'page-input') {
            tabInput.classList.add('active');
        } else if (pageId === 'page-results') {
            tabResults.classList.add('active');
        }
    }
    
    // คำนวณอายุระหว่างสองวันที่
    function calculateAge(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        
        if (days < 0) {
            months--;
            // หาจำนวนวันในเดือนก่อนหน้า
            const lastMonth = new Date(
                currentDate.getFullYear(), 
                currentDate.getMonth(), 
                0
            ).getDate();
            days += lastMonth;
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { years, months, days };
    }
    
    // แปลงวันที่เป็นข้อความภาษาไทย
    function formatThaiDate(day, month, year) {
        // แปลงปีเป็น พ.ศ.
        const thaiYear = parseInt(year) + 543;
        return `${day} ${thaiMonths[month - 1]} พ.ศ. ${thaiYear}`;
    }
    
    // แสดงผลอายุเป็นข้อความภาษาไทย
    function formatAgeResult(age) {
        let result = "";
        
        if (age.years > 0) {
            result += `${age.years} ปี `;
        }
        
        if (age.months > 0) {
            result += `${age.months} เดือน `;
        }
        
        if (age.days > 0) {
            result += `${age.days} วัน`;
        }
        
        return result.trim() || "0 วัน";
    }
    
    // คำนวณวันเกษียณอายุราชการ
    function calculateRetirementDate(birthDate) {
        // สร้างวันที่เกษียณ (อายุ 60 ปี)
        const retirementDate = new Date(birthDate);
        retirementDate.setFullYear(birthDate.getFullYear() + 60);
        
        // ตรวจสอบว่าเกิดหลัง 1 ตุลาคมหรือไม่
        if (birthDate.getMonth() >= 9) { // เดือนตุลาคมคือ index 9 (0-indexed)
            // ถ้าเกิดตั้งแต่ 1 ตุลาคมเป็นต้นไป ให้เพิ่มอีก 1 ปี
            retirementDate.setFullYear(retirementDate.getFullYear() + 1);
        }
        
        return retirementDate;
    }
    
    // ล้างข้อมูลการเลือก
    function clearInputs() {
        birthDay.selectedIndex = 0;
        birthMonth.selectedIndex = 0;
        birthYear.selectedIndex = 0;
        workDay.selectedIndex = 0;
        workMonth.selectedIndex = 0;
        workYear.selectedIndex = 0;
    }
    
    // คำนวณและแสดงผลลัพธ์
    function showResults() {
        // ตรวจสอบว่าได้เลือกข้อมูลครบทุกช่องหรือไม่
        if (!birthDay.value || !birthMonth.value || !birthYear.value || 
            !workDay.value || !workMonth.value || !workYear.value) {
            alert('กรุณาเลือกข้อมูลให้ครบทุกช่อง');
            return;
        }
        
        // สร้าง Date objects
        const birthDate = new Date(
            birthYear.value, 
            birthMonth.value - 1, 
            birthDay.value
        );
        
        const workDate = new Date(
            workYear.value, 
            workMonth.value - 1, 
            workDay.value
        );
        
        const currentDate = new Date(); // วันที่ปัจจุบัน
        
        // ตรวจสอบความถูกต้องของวันที่
        if (isNaN(birthDate.getTime()) || isNaN(workDate.getTime())) {
            alert('วันที่ไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง');
            return;
        }
        
        // ตรวจสอบว่าวันเกิดไม่เกินวันปัจจุบัน
        if (birthDate > currentDate) {
            alert('วันเกิดไม่สามารถเป็นวันที่ในอนาคตได้');
            return;
        }
        
        // ตรวจสอบว่าวันที่เข้าทำงานไม่เกินวันปัจจุบัน
        if (workDate > currentDate) {
            alert('วันที่เข้าทำงานไม่สามารถเป็นวันที่ในอนาคตได้');
            return;
        }
        
        // ตรวจสอบว่าวันที่เข้าทำงานไม่น้อยกว่าวันเกิด
        if (workDate < birthDate) {
            alert('วันที่เข้าทำงานไม่สามารถเป็นวันที่ก่อนวันเกิดได้');
            return;
        }
        
        // คำนวณอายุและอายุงาน
        const age = calculateAge(birthDate, currentDate);
        const workAge = calculateAge(workDate, currentDate);
        
        // แสดงผลวันเดือนปีเกิด
        birthDateResult.textContent = formatThaiDate(
            birthDay.value, 
            birthMonth.value, 
            birthYear.value
        );
        
        // แสดงวันในสัปดาห์สำหรับวันเกิด
        birthDayOfWeek.textContent = `ตรงกับ${thaiDaysOfWeek[birthDate.getDay()]}`;
        
        // แสดงผลอายุปัจจุบัน
        ageResult.textContent = formatAgeResult(age);
        
        // ตั้งค่าแถบแสดงความคืบหน้าของอายุ (ขีดจำกัดที่ 100 ปี)
        const agePercentage = Math.min(100, (age.years / 100) * 100);
        ageSliderFill.style.width = `${agePercentage}%`;
        
        // แสดงผลวันเดือนปีที่เข้าทำงาน
        workDateResult.textContent = formatThaiDate(
            workDay.value, 
            workMonth.value, 
            workYear.value
        );
        
        // แสดงวันในสัปดาห์สำหรับวันเข้าทำงาน
        workDayOfWeek.textContent = `ตรงกับ${thaiDaysOfWeek[workDate.getDay()]}`;
        
        // แสดงผลอายุงาน
        workAgeResult.textContent = formatAgeResult(workAge);
        
        // ตั้งค่าแถบแสดงความคืบหน้าของอายุงาน (ขีดจำกัดที่ 50 ปี)
        const workAgePercentage = Math.min(100, (workAge.years / 50) * 100);
        workAgeSliderFill.style.width = `${workAgePercentage}%`;
        
        // ถ้าเป็นโหมดราชการ ให้แสดงข้อมูลเกษียณอายุ
        if (isGovernmentMode) {
            // คำนวณวันเกษียณ
            const retirementDate = calculateRetirementDate(birthDate);
            
            // แสดงวันเกษียณ
            retirementDateResult.textContent = formatThaiDate(
                retirementDate.getDate(),
                retirementDate.getMonth() + 1,
                retirementDate.getFullYear()
            );
            
            // แสดงวันในสัปดาห์สำหรับวันเกษียณ
            retirementDayOfWeek.textContent = `ตรงกับ${thaiDaysOfWeek[retirementDate.getDay()]}`;
            
            // แสดงส่วนของวันเกษียณ
            retirementDateContainer.style.display = 'block';
        } else {
            // ซ่อนส่วนของวันเกษียณเมื่ออยู่ในโหมดทั่วไป
            retirementDateContainer.style.display = 'none';
        }
        
        // สลับไปยังหน้าผลลัพธ์
        switchPage('page-results');
    }
    
    // Event Listeners
    tabHome.addEventListener('click', () => switchPage('page-home'));
    tabInput.addEventListener('click', () => switchPage('page-input'));
    tabResults.addEventListener('click', () => switchPage('page-results'));
    
    calculateBtn.addEventListener('click', showResults);
    recalculateBtn.addEventListener('click', () => {
        clearInputs(); // ล้างข้อมูลการเลือก
        switchPage('page-input');
    });
    
    // Event listener สำหรับการเปลี่ยนโหมด
    if (modeToggle) {
        modeToggle.addEventListener('change', function() {
            isGovernmentMode = this.checked;
            
            // อัปเดตข้อความแสดงโหมด
            if (modeLabel) {
                modeLabel.textContent = isGovernmentMode ? 'ราชการ' : 'ทั่วไป';
            }
        });
    }
});