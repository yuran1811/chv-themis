# Guide

---

## Thay đổi đường dẫn các thư mục

- Mở file ".env" và thay đổi các đường dẫn của chính bạn
- Các đường dẫn mặc định khi không được cấu hình:
    - PROBLEMS_DIR: /resources/\_problems
    - RANKING_DIR: /resources/\_rankings
    - SUBMISSIONS_DIR: /resources/uploads
    - CONTESTANTS_DIR: /resources/contestants
    - TASKS_DIR = /resources/tasks
- Chế độ chấm bài (offline và online):
    - RANKING_MODE: off / onl (mặc định là "off")
        - "off": Chế độ chấm bài offline sẽ lấy rank từ file excel xuất từ themis
        - "onl": Chế độ chấm bài online sẽ lấy rank từ lịch sử nộp bài trên web
- Thay đổi danh sách tài khoản của ứng dụng tại [**đây**](../src/db/accounts.json)

---

## Change the folders' path

- Open ".env" file and change the directory for each folder you want
- Default directories:
    - PROBLEMS_DIR: /resources/\_problems
    - RANKING_DIR: /resources/\_rankings
    - SUBMISSIONS_DIR: /resources/uploads
    - CONTESTANTS_DIR: /resources/contestants
    - TASKS_DIR = /resources/tasks
- Defaul Mode:
    - RANKING_MODE: off / onl (Default: off)
- Change the accounts list [**here**](../src/db/accounts.json)
