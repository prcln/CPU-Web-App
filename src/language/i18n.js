const translations = {
  en: {
    // Nav & Header
    "title_main": "An Interactive, Graphical Simulator <br/>for Teaching Operating Systems",
    "nav_simulator": "Simulator",
    "nav_project": "Project",
    "nav_notes": "Notes",
    "nav_papers": "Papers",
    "nav_video": "Video",
    "nav_download": "Download",
    "nav_contact": "Contact",
    "theme_dark": "🌙 Dark",
    "theme_light": "☀️ Light",

    // SimHeader
    "btn_log": "📋 Log",
    "toggle_hide_sem": "Hide Semaphore Queues",
    "toggle_show_sem": "Show Semaphore Queues",
    "toggle_disable_alerts": "Disable Alerts",
    "toggle_enable_alerts": "Enable Alerts",
    "btn_last_event": "Last Event",
    "btn_start_auto": "▶ Start Auto",
    "btn_stop_auto": "⏹ Stop Auto",
    "btn_next_event": "Next Event",
    "btn_settings": "Update Settings",
    "btn_reset": "Reset Data",
    "btn_finish": "Finish Event",
    "btn_complete": "Complete Run",
    "lbl_simulation_time": "  Simulation Time  ",
    "btn_delay": "Delay (ms)",
    "lbl_available_memory": "Available Memory: {0}",

    // Panels
    "panel_cpu": "CPU",
    "cpu_idle": "IDLE",
    "cpu_process": "Process {0}",
    "cpu_memory": "Memory: {0}",
    "cpu_runtime": "Runtime: {0}",
    "cpu_quantum": "Quantum: {0}",

    // Queues
    "q_rejected": "Jobs Rejected by System",
    "q_incoming": "Job Scheduling Queue",
    "q_ready1": "Ready Queue Level 1",
    "q_io": "I/O Burst Queue",
    "q_ready2": "Ready Queue Level 2",
    "q_finished": "Finished Process List",
    "q_sem": "Semaphore {0} (Value: {1})",

    // Table Headers
    "th_process": "Process #",
    "th_job": "Job #",
    "th_memory": "Memory (M)",
    "th_runtime": "Run Time (R)",
    "th_wait": "Wait (W)",
    "th_arrival": "Arrival (A)",
    "th_burst": "Burst (B)",
    "th_finished": "Finished (F)",
    "th_type": "Type",
    "th_details": "Details",
    "table_prev": "Previous",
    "table_next": "Next",
    "table_loading": "Loading...",
    "table_nodata": "No rows found",
    "table_page": "Page",
    "table_of": "of",
    "table_rows": "rows",

    // Tooltips
    "tt_created": "Process P{0} was created and is waiting to be loaded into memory.",
    "tt_loaded": "Process P{0} is loaded into memory and waiting in the Ready Queue.",
    "tt_rejected": "Process P{0} was rejected. Required memory ({1}) exceeds max capacity ({2}).",
    "tt_run_q1": "Process P{0} is running on CPU with {1}ms quantum (Level 1).",
    "tt_run_q2": "Process P{0} is running on CPU with {1}ms quantum (Level 2).",
    "tt_demoted": "Process P{0} was demoted to Level 2 Queue due to quantum expiration.",
    "tt_io_wait": "Process P{0} is performing I/O. Will complete in {1}ms.",
    "tt_io_done": "Process P{0} finished I/O and returned to the Ready Queue.",
    "tt_sem_wait": "Process P{0} is blocked waiting for Semaphore {1}.",
    "tt_sem_done": "Process P{0} acquired Semaphore {1} and returned to the Ready Queue.",
    "tt_finished": "Process P{0} has finished all execution and freed its memory.",
    "tt_cpu_running": "Process is running on CPU.",

    // Alerts Modal
    "alert_log": "📋 Alert Log",
    "alert_no_alerts": "No alerts have been recorded yet.",
    "alert_clear": "Clear Log",
    "alert_time": "[Time: {0}]",

    // Settings
    "settings_title": "Settings",
    "settings_algo": "Algorithms",
    "settings_close": "Close",
    "settings_upload": "Upload Settings file",
    "settings_filename": "File Name: ",
    "settings_preview": "Data Preview: ",
    "settings_load": "Load Data",
    "settings_max_memory": "Max Memory: ",
    "settings_quantum_1": "Quantum 1: ",
    "settings_quantum_2": "Quantum 2: ",
    "settings_sem_1": "Semaphore 1: ",
    "settings_sem_2": "Semaphore 2: ",
    "settings_sem_3": "Semaphore 3: ",
    "settings_sem_4": "Semaphore 4: ",
    "settings_sem_5": "Semaphore 5: ",
    "settings_choose_scenario": "Choose Scenario: ",
    "settings_scenario_a": "Scenario A",
    "settings_scenario_b": "Scenario B",
    "settings_scenario_c": "Scenario C",
    "settings_scenario_d": "Scenario D",
    "settings_choose_file": " Choose File ",
    "settings_save": "Save",
    "Scenario A": "Scenario A",
    "Scenario B": "Scenario B",
    "Scenario C": "Scenario C",
    "Scenario D": "Scenario D",
    "File Chosen": "File Chosen",

    // Deadlock
    "dl_title": "Deadlock Detected",
    "dl_subtitle_time": "Detected at simulation time",
    "dl_subtitle_jobs": "processes involved",
    "dl_subtitle_sems": "semaphores locked",
    "dl_chain_label": "🔄 Circular Wait Chain",
    "dl_loop": "↩ loop",
    "dl_detail_label": "📋 Process Detail",
    "dl_holds": "Holds:",
    "dl_waiting": "Waiting for:"
  },
  vi: {
    // Nav & Header
    "title_main": "Phần mềm Mô phỏng Trực quan <br/>Hệ Điều Hành",
    "nav_simulator": "Mô phỏng",
    "nav_project": "Dự án",
    "nav_notes": "Tài liệu",
    "nav_papers": "Bài báo",
    "nav_video": "Video",
    "nav_download": "Tải xuống",
    "nav_contact": "Liên hệ",
    "theme_dark": "🌙 Tối",
    "theme_light": "☀️ Sáng",

    // SimHeader
    "btn_log": "📋 Nhật ký",
    "toggle_hide_sem": "Ẩn Hàng đợi Semaphore",
    "toggle_show_sem": "Hiện Hàng đợi Semaphore",
    "toggle_disable_alerts": "Tắt Cảnh báo",
    "toggle_enable_alerts": "Bật Cảnh báo",
    "btn_last_event": "Sự kiện Trước",
    "btn_start_auto": "▶ Chạy Tự động",
    "btn_stop_auto": "⏹ Dừng Tự động",
    "btn_next_event": "Sự kiện Kế",
    "btn_settings": "Cài đặt Hệ thống",
    "btn_reset": "Đặt lại Dữ liệu",
    "btn_finish": "Chạy tới Cuối",
    "btn_complete": "Hoàn tất Mô phỏng",
    "lbl_simulation_time": "  Thời gian Mô phỏng  ",
    "btn_delay": "Độ trễ (ms)",
    "lbl_available_memory": "Bộ nhớ Trống: {0}",

    // Panels
    "panel_cpu": "BỘ XỬ LÝ (CPU)",
    "cpu_idle": "RẢNH RỖI",
    "cpu_process": "Tiến trình {0}",
    "cpu_memory": "Bộ nhớ: {0}",
    "cpu_runtime": "Đã chạy: {0}",
    "cpu_quantum": "Lượng tử: {0}",

    // Queues
    "q_rejected": "Tiến trình Bị từ chối",
    "q_incoming": "Hàng đợi Chờ Nạp (Job Queue)",
    "q_ready1": "Hàng đợi Sẵn sàng (Cấp 1)",
    "q_io": "Hàng đợi Nhập/Xuất (I/O)",
    "q_ready2": "Hàng đợi Sẵn sàng (Cấp 2)",
    "q_finished": "Tiến trình Đã Hoàn Tất",
    "q_sem": "Semaphore {0} (Giá trị: {1})",

    // Table Headers
    "th_process": "Tiến trình",
    "th_job": "Công việc",
    "th_memory": "Bộ nhớ",
    "th_runtime": "Cần chạy",
    "th_wait": "Chờ",
    "th_arrival": "Thời điểm tới",
    "th_burst": "Thời gian I/O",
    "th_finished": "Lúc xong",
    "th_type": "Loại",
    "th_details": "Chi tiết",
    "table_prev": "Trang trước",
    "table_next": "Trang sau",
    "table_loading": "Đang tải...",
    "table_nodata": "Không có dữ liệu",
    "table_page": "Trang",
    "table_of": "/",
    "table_rows": "dòng",

    // Tooltips
    "tt_created": "Tiến trình P{0} mới được tạo và đang chờ nạp vào bộ nhớ.",
    "tt_loaded": "Tiến trình P{0} đã được nạp vào bộ nhớ và đang ở Hàng đợi Sẵn sàng.",
    "tt_rejected": "Tiến trình P{0} bị từ chối do yêu cầu bộ nhớ ({1}) vượt mức tối đa ({2}).",
    "tt_run_q1": "Tiến trình P{0} đang chạy trên CPU với lượng tử {1}ms (Cấp 1).",
    "tt_run_q2": "Tiến trình P{0} đang chạy trên CPU với lượng tử {1}ms (Cấp 2).",
    "tt_demoted": "Tiến trình P{0} bị đẩy xuống Hàng đợi cấp 2 do dùng hết lượng tử.",
    "tt_io_wait": "Tiến trình P{0} đang chờ thao tác I/O. Sẽ hoàn tất sau {1}ms.",
    "tt_io_done": "Tiến trình P{0} đã hoàn tất I/O và quay lại Hàng đợi Sẵn sàng.",
    "tt_sem_wait": "Tiến trình P{0} bị chặn vì đang chờ Semaphore {1} giải phóng.",
    "tt_sem_done": "Tiến trình P{0} đã nhận được Semaphore {1} và sẵn sàng chạy tiếp.",
    "tt_finished": "Tiến trình P{0} đã hoàn tất toàn bộ công việc và giải phóng bộ nhớ.",
    "tt_cpu_running": "Tiến trình đang được thực thi trên CPU.",

    // Alerts Modal
    "alert_log": "📋 Nhật ký Hệ thống",
    "alert_no_alerts": "Chưa có cảnh báo nào được ghi nhận.",
    "alert_clear": "Xóa Nhật ký",
    "alert_time": "[T={0}]",

    // Settings
    "settings_title": "Cài đặt Hệ thống",
    "settings_algo": "Thuật toán",
    "settings_close": "Đóng",
    "settings_upload": "Tải tệp cài đặt",
    "settings_filename": "Tên tệp: ",
    "settings_preview": "Dữ liệu: ",
    "settings_load": "Nạp dữ liệu",
    "settings_max_memory": "Bộ nhớ Tối đa: ",
    "settings_quantum_1": "Lượng tử 1: ",
    "settings_quantum_2": "Lượng tử 2: ",
    "settings_sem_1": "Semaphore 1: ",
    "settings_sem_2": "Semaphore 2: ",
    "settings_sem_3": "Semaphore 3: ",
    "settings_sem_4": "Semaphore 4: ",
    "settings_sem_5": "Semaphore 5: ",
    "settings_choose_scenario": "Chọn Kịch bản: ",
    "settings_scenario_a": "Kịch bản A",
    "settings_scenario_b": "Kịch bản B",
    "settings_scenario_c": "Kịch bản C",
    "settings_scenario_d": "Kịch bản D",
    "settings_choose_file": " Chọn tệp ",
    "settings_save": "Lưu",
    "Scenario A": "Kịch bản A",
    "Scenario B": "Kịch bản B",
    "Scenario C": "Kịch bản C",
    "Scenario D": "Kịch bản D",
    "File Chosen": "Đã chọn tệp",

    // Deadlock
    "dl_title": "Phát hiện Bế Tắc — Deadlock Detected",
    "dl_subtitle_time": "Phát hiện tại thời điểm",
    "dl_subtitle_jobs": "tiến trình tham gia",
    "dl_subtitle_sems": "semaphore bị khóa",
    "dl_chain_label": "🔄 Chuỗi Chờ Đợi Vòng Tròn",
    "dl_loop": "↩ vòng lặp",
    "dl_detail_label": "📋 Chi tiết Tiến trình",
    "dl_holds": "Đang giữ:",
    "dl_waiting": "Đang đợi:"
  }
};

let currentLang = localStorage.getItem('appLang') || 'en';

export const setLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem('appLang', lang);
  window.dispatchEvent(new Event('languageChange'));
};

export const getLanguage = () => currentLang;

export const t = (key, ...args) => {
  let text = translations[currentLang]?.[key] || translations['en'][key] || key;
  args.forEach((arg, index) => {
    text = text.replace(`{${index}}`, arg);
  });
  return text;
};
