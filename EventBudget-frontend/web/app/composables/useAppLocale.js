// fileName: app/composables/useAppLocale.js
export const useAppLocale = () => {
  const locale = useCookie('app_lang', { 
    default: () => 'th',
    watch: true 
  })

  const translations = {
    th: {
      // --- Common (ปุ่ม/แจ้งเตือนทั่วไป) ---
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      create: 'สร้าง',
      edit: 'แก้ไข',
      delete: 'ลบ',
      confirm_delete: 'ยืนยันการลบ',
      loading: 'กำลังโหลด...',
      actions: 'จัดการ',
      warning_fill_all: 'กรุณากรอกข้อมูลให้ครบถ้วน',

      // --- Sidebar (เมนูข้าง) ---
      nav_events: 'จัดการอีเวนต์',
      nav_categories: 'หมวดหมู่ค่าใช้จ่าย',
      nav_currency: 'จัดการสกุลเงิน',
      nav_team: 'จัดการทีม',
      nav_settings: 'ตั้งค่าทั่วไป',

      // --- Settings: Team (จัดการทีม) ---
      team_management: 'จัดการทีม',
      add_member: 'เพิ่มสมาชิก',
      edit_member: 'แก้ไขสมาชิก',
      label_name: 'ชื่อ-นามสกุล',
      label_email: 'อีเมล',
      label_phone: 'เบอร์โทรศัพท์',
      confirm_delete_member: 'ต้องการลบสมาชิกคนนี้ใช่หรือไม่?',

      // --- Settings: Currency (สกุลเงิน) ---
      currency_management: 'จัดการสกุลเงิน',
      add_currency: 'เพิ่มสกุลเงิน',
      edit_currency: 'แก้ไขสกุลเงิน',
      label_code: 'รหัสสกุลเงิน (เช่น USD)',
      label_currency_name: 'ชื่อสกุลเงิน',
      label_rate: 'อัตราแลกเปลี่ยน (เทียบกับ THB)',
      base_currency: 'สกุลเงินหลัก',
      cannot_delete_base: 'ไม่สามารถลบสกุลเงินหลักได้',
      
      // --- Settings: Categories (หมวดหมู่) ---
      settings_categories: 'หมวดหมู่ค่าใช้จ่าย',
      settings_add_category: 'เพิ่มหมวดหมู่',
      settings_edit_category: 'แก้ไขหมวดหมู่',
      label_cat_name: 'ชื่อหมวดหมู่',
      label_cat_icon: 'ไอคอน (Emoji)',

      // --- Settings: General (ตั้งค่าทั่วไป) ---
      headerTitle: 'ตั้งค่าทั่วไป',
      language: 'ภาษา',
      appBackground: 'พื้นหลังแอป',
      uploadImage: 'อัปโหลดภาพ',
      backupRestore: 'สำรองและกู้คืนข้อมูล',
      backup: 'สำรองข้อมูล',
      restore: 'กู้คืนข้อมูล',

      // --- Event Tabs (เมนูย่อยในอีเวนต์) ---
      tab_dashboard: 'แดชบอร์ด',
      tab_budget: 'งบประมาณ',
      tab_expenses: 'ค่าใช้จ่าย',
      tab_timeline: 'ไทม์ไลน์',
      tab_tasks: 'งานที่ต้องทำ',

      // --- Page: Event List (หน้ารวม) ---
      events_title: 'รายการอีเวนต์',
      no_events: 'ยังไม่มีอีเวนต์ในระบบ',
      create_first_event: 'สร้างอีเวนต์แรก',
      confirm_delete_event_msg: 'ต้องการลบอีเวนต์นี้จริงหรือไม่?',

      // --- Page: Event Detail ---
      event_date: 'วันจัดงาน',
      budget: 'งบประมาณ',
      client: 'ลูกค้า',
      location: 'สถานที่',
      venue: 'สถานที่จัดงาน',
      accommodation: 'ที่พัก',
      files: 'ไฟล์งาน',
      open_link: 'เปิดลิงก์',
      no_link: 'ไม่มีลิงก์',
      no_desc: 'ไม่มีรายละเอียด',

      // --- Page: Budget (งบประมาณ) ---
      budget_overview: 'ภาพรวมงบประมาณ',
      budget_progress: 'ความคืบหน้าการใช้งบ',
      total_budget: 'งบทั้งหมด',
      used: 'ใช้ไปแล้ว',
      remaining: 'คงเหลือ',
      of_budget: 'ของงบประมาณ',
      expenses_by_category: 'รายจ่ายตามหมวดหมู่',
      no_expenses_data: 'ยังไม่มีรายการค่าใช้จ่าย',

      // --- Page: Timeline (ไทม์ไลน์) ---
      timeline_title: 'กำหนดการ ',
      timeline_subtitle: 'จัดการลำดับกิจกรรมแบบเรียลไทม์',
      add_day: 'เพิ่มวัน',
      start_timeline: 'เริ่มต้นสร้างกำหนดการ',
      no_timeline_data: 'ยังไม่มีข้อมูลกิจกรรมในระบบ เริ่มต้นด้วยการเพิ่มวันแรกของงาน',
      add_new_day: 'เพิ่มวันใหม่',
      add_activity_btn: '+ กิจกรรม',
      delete_day_btn: 'ลบวัน',
      add_first_activity: '+ เพิ่มกิจกรรมแรกของวันนี้',
      add_next_activity: 'เพิ่มกิจกรรมถัดไป',
      
      modal_day_title: 'กำหนดวันใหม่',
      modal_day_subtitle: 'เลือกวันที่และตั้งชื่อธีมงาน',
      label_event_date: 'วันที่จัดงาน',
      label_theme_title: 'ชื่อวัน / ธีม (Theme Title)',
      
      modal_activity_add: 'เพิ่มกิจกรรมใหม่',
      modal_activity_edit: 'แก้ไขกิจกรรม',
      modal_activity_subtitle: 'กรอกรายละเอียดให้ครบถ้วน',
      label_activity_name: 'ชื่อกิจกรรม',
      label_start_time: 'เริ่มเวลา',
      label_end_time: 'สิ้นสุด (ถ้ามี)',
      label_select_icon: 'เลือกไอคอนกิจกรรม',
      label_location_timeline: 'สถานที่ (Location)',
      label_desc_timeline: 'รายละเอียด (Optional)',
      confirm_delete_day_msg: 'ยืนยันการลบวันและกิจกรรมทั้งหมด?',
      confirm_delete_activity_msg: 'ยืนยันการลบกิจกรรม?',

      // --- Page: Tasks (สิ่งที่ต้องทำ) ---
      tasks_title: 'สิ่งที่ต้องทำ',
      no_tasks: 'ไม่มีงานค้าง สบายจัง!',
      create_new_task: 'สร้างงานใหม่',
      add_task: 'เพิ่มงานใหม่',
      label_task_title: 'ชื่องาน',
      label_task_desc: 'รายละเอียด',
      label_due_date: 'วันครบกำหนด',
      due_date_prefix: 'ครบกำหนด:',
      confirm_delete_task: 'ลบงานนี้?',

      // --- Page: Expenses (ค่าใช้จ่าย) ---
      expenses_title: 'ติดตามค่าใช้จ่าย',
      expenses_total: 'รวมทั้งหมด',
      no_expenses: 'ยังไม่มีรายการค่าใช้จ่าย',
      start_tracking: 'เริ่มบันทึกค่าใช้จ่ายแรกของคุณ',
      btn_add_expense: 'บันทึกค่าใช้จ่าย',
      modal_add_expense: 'บันทึกค่าใช้จ่าย',
      modal_edit_expense: 'แก้ไขรายการ',
      label_item_name: 'ชื่อรายการ',
      label_amount: 'จำนวนเงิน',
      label_category: 'หมวดหมู่',
      label_date: 'วันที่',
      label_time: 'เวลา',
      confirm_delete_expense: 'ต้องการลบรายการค่าใช้จ่ายนี้ใช่หรือไม่?',

      // --- Event Form Modal ---
      modal_add_event: 'เพิ่มอีเวนต์ใหม่',
      modal_edit_event: 'แก้ไขอีเวนต์',
      label_event_name: 'ชื่ออีเวนต์',
      label_desc: 'รายละเอียด',
      label_start_date: 'วันที่เริ่มต้น',
      label_end_date: 'วันสิ้นสุด',
      label_client_name: 'ชื่อลูกค้า',
      label_location: 'สถานที่/ประเทศ',
      label_total_budget: 'งบประมาณทั้งหมด',
      label_venue_name: 'ชื่อสถานที่จัดงาน',
      label_venue_url: 'ลิงก์สถานที่ (URL)',
      label_accom_name: 'ชื่อที่พัก',
      label_accom_url: 'ลิงก์ที่พัก (URL)',
      label_drive_link: 'ลิงก์ไฟล์งาน (Google Drive)',
    },
    en: {
      // --- Common ---
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      confirm_delete: 'Confirm Delete',
      loading: 'Loading...',
      actions: 'Actions',
      warning_fill_all: 'Please fill in all fields',

      // --- Sidebar ---
      nav_events: 'Event Management',
      nav_categories: 'Expense Categories',
      nav_currency: 'Currency Management',
      nav_team: 'Team Management',
      nav_settings: 'General Settings',

      // --- Settings: Team ---
      team_management: 'Team Management',
      add_member: 'Add Member',
      edit_member: 'Edit Member',
      label_name: 'Full Name',
      label_email: 'Email',
      label_phone: 'Phone Number',
      confirm_delete_member: 'Are you sure you want to delete this member?',

      // --- Settings: Currency ---
      currency_management: 'Currency Management',
      add_currency: 'Add Currency',
      edit_currency: 'Edit Currency',
      label_code: 'Currency Code (e.g. USD)',
      label_currency_name: 'Currency Name',
      label_rate: 'Exchange Rate (to THB)',
      base_currency: 'Base Currency',
      cannot_delete_base: 'Cannot delete base currency',
      
      // --- Settings: Categories ---
      settings_categories: 'Expense Categories',
      settings_add_category: 'Add Category',
      settings_edit_category: 'Edit Category',
      label_cat_name: 'Category Name',
      label_cat_icon: 'Icon (Emoji)',

      // --- Settings: General ---
      headerTitle: 'General Settings',
      language: 'Language',
      appBackground: 'App Background',
      uploadImage: 'Upload Image',
      backupRestore: 'Backup & Restore',
      backup: 'Backup Data',
      restore: 'Restore Data',

      // --- Event Tabs ---
      tab_dashboard: 'Dashboard',
      tab_budget: 'Budget',
      tab_expenses: 'Expenses',
      tab_timeline: 'Timeline',
      tab_tasks: 'Tasks',

      // --- Page: Event List ---
      events_title: 'Event List',
      no_events: 'No events found',
      create_first_event: 'Create First Event',
      confirm_delete_event_msg: 'Are you sure you want to delete this event?',

      // --- Page: Event Detail ---
      event_date: 'Event Date',
      budget: 'Budget',
      client: 'Client',
      location: 'Location',
      venue: 'Venue',
      accommodation: 'Accommodation',
      files: 'Files',
      open_link: 'Open Link',
      no_link: 'No Link',
      no_desc: 'No description',

      // --- Page: Budget ---
      budget_overview: 'Budget Overview',
      budget_progress: 'Budget Progress',
      total_budget: 'Total Budget',
      used: 'Used',
      remaining: 'Remaining',
      of_budget: 'of Budget',
      expenses_by_category: 'Expenses by Category',
      no_expenses_data: 'No expenses recorded',

      // --- Page: Timeline ---
      timeline_title: 'Timeline',
      timeline_subtitle: 'Real-time schedule management',
      add_day: 'Add Day',
      start_timeline: 'Start Scheduling',
      no_timeline_data: 'No activities yet. Start by adding the first day.',
      add_new_day: 'Add New Day',
      add_activity_btn: '+ Activity',
      delete_day_btn: 'Delete Day',
      add_first_activity: '+ Add First Activity',
      add_next_activity: 'Add Next Activity',
      
      modal_day_title: 'Set New Day',
      modal_day_subtitle: 'Select date and theme title',
      label_event_date: 'Event Date',
      label_theme_title: 'Day Name / Theme',
      
      modal_activity_add: 'Add New Activity',
      modal_activity_edit: 'Edit Activity',
      modal_activity_subtitle: 'Fill in the details',
      label_activity_name: 'Activity Name',
      label_start_time: 'Start Time',
      label_end_time: 'End Time (Optional)',
      label_select_icon: 'Select Icon',
      label_location_timeline: 'Location',
      label_desc_timeline: 'Description (Optional)',
      confirm_delete_day_msg: 'Delete this day and all activities?',
      confirm_delete_activity_msg: 'Delete this activity?',

      // --- Page: Tasks ---
      tasks_title: 'To-Do List',
      no_tasks: 'No pending tasks. All clear!',
      create_new_task: 'Create New Task',
      add_task: 'Add Task',
      label_task_title: 'Task Name',
      label_task_desc: 'Description',
      label_due_date: 'Due Date',
      due_date_prefix: 'Due:',
      confirm_delete_task: 'Delete this task?',

      // --- Page: Expenses ---
      expenses_title: 'Expense Tracker',
      expenses_total: 'Total',
      no_expenses: 'No expenses recorded',
      start_tracking: 'Start tracking your first expense',
      btn_add_expense: 'Record Expense',
      modal_add_expense: 'Record Expense',
      modal_edit_expense: 'Edit Expense',
      label_item_name: 'Item Name',
      label_amount: 'Amount',
      label_category: 'Category',
      label_date: 'Date',
      label_time: 'Time',
      confirm_delete_expense: 'Are you sure you want to delete this expense?',

      // --- Event Form Modal ---
      modal_add_event: 'Add New Event',
      modal_edit_event: 'Edit Event',
      label_event_name: 'Event Name',
      label_desc: 'Description',
      label_start_date: 'Start Date',
      label_end_date: 'End Date',
      label_client_name: 'Client Name',
      label_location: 'Location/Country',
      label_total_budget: 'Total Budget',
      label_venue_name: 'Venue Name',
      label_venue_url: 'Venue URL',
      label_accom_name: 'Accommodation Name',
      label_accom_url: 'Accommodation URL',
      label_drive_link: 'Google Drive Link',
    }
  }

  const t = computed(() => translations[locale.value] || translations.th)

  const setLocale = (lang) => {
    locale.value = lang
  }

  return { locale, t, setLocale }
}