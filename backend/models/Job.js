const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────
//  So sánh với Requirements (19 trường bắt buộc):
//
//  REQ #  | Tên trường yêu cầu              | Field trong Schema       | Status
//  -------|----------------------------------|--------------------------|-------
//  1      | Tên công ty                     | companyName              | ✅
//  2      | Website công ty                 | website                  | ✅
//  3      | Vị trí tuyển dụng               | title                    | ✅
//  4      | Ngành phù hợp                   | industry                 | ✅
//  5      | Level                           | level                    | ✅
//  6      | Địa điểm                        | location                 | ✅
//  7      | Hình thức làm việc              | employmentType           | ✅
//  8      | Mô tả công việc                 | description              | ✅
//  9      | Yêu cầu ứng viên                | requirements             | ✅
//  10     | Kỹ năng/công nghệ yêu cầu       | skills[]                 | ✅
//  11     | Mức lương/trợ cấp               | salary (text)            | ✅
//         |                                  | salaryMin, salaryMax     | ✅ (bonus: filter số)
//  12     | Quyền lợi                       | benefits                 | ✅
//  13     | Deadline ứng tuyển              | deadline                 | ✅
//  14     | Link JD gốc                     | originalUrl              | ✅
//  15     | Nguồn thu thập                  | source                   | ✅
//  16     | Ngày thu thập                   | scrapedAt                | ✅
//  17     | Trạng thái job                  | status                   | ✅
//  18     | Mức độ phù hợp học viên MindX   | mindxFitScore            | ✅
//  19     | Ghi chú của team SS             | ssNotes                  | ✅
//
//  Bonus fields (thêm để hỗ trợ tính năng):
//         | Logo công ty                    | companyLogo              | ✅ (UI)
//         | Lương min (số - cho filter)     | salaryMin                | ✅ (filter)
//         | Lương max (số - cho filter)     | salaryMax                | ✅ (filter)
//
//  KẾT QUẢ: 19/19 trường bắt buộc ✅ + 3 trường bonus
// ─────────────────────────────────────────────────────────

const jobSchema = new mongoose.Schema(
  {
    // ── 1. Tên công ty ──────────────────────────────────
    companyName: {
      type: String,
      required: [true, 'Tên công ty là bắt buộc'],
      trim: true,
    },

    // ── Bonus: Logo công ty (URL ảnh) ───────────────────
    companyLogo: {
      type: String,
      default: '',
    },

    // ── 2. Website công ty ──────────────────────────────
    website: {
      type: String,
      required: [true, 'Website công ty là bắt buộc'],
      trim: true,
    },

    // ── 3. Vị trí tuyển dụng ────────────────────────────
    title: {
      type: String,
      required: [true, 'Vị trí tuyển dụng là bắt buộc'],
      trim: true,
    },

    // ── 4. Ngành phù hợp ────────────────────────────────
    industry: {
      type: String,
      required: true,
      enum: {
        values: ['Code', 'Data Analysis', 'Business Analysis'],
        message: 'Ngành phải là: Code, Data Analysis, hoặc Business Analysis',
      },
    },

    // ── 5. Level ────────────────────────────────────────
    level: {
      type: String,
      required: true,
      enum: {
        values: ['Intern', 'Fresher', 'Junior'],
        message: 'Level phải là: Intern, Fresher, hoặc Junior',
      },
    },

    // ── 6. Địa điểm ─────────────────────────────────────
    location: {
      type: String,
      required: true,
      enum: {
        values: ['Hà Nội', 'TP.HCM', 'Remote', 'Hybrid'],
        message: 'Địa điểm phải là: Hà Nội, TP.HCM, Remote, hoặc Hybrid',
      },
    },

    // ── 7. Hình thức làm việc ───────────────────────────
    employmentType: {
      type: String,
      required: true,
      enum: {
        values: ['Fulltime', 'Parttime', 'Internship', 'Trainee'],
        message: 'Hình thức phải là: Fulltime, Parttime, Internship, hoặc Trainee',
      },
    },

    // ── 8. Mô tả công việc ──────────────────────────────
    description: {
      type: String,
      required: [true, 'Mô tả công việc là bắt buộc'],
    },

    // ── 9. Yêu cầu ứng viên ─────────────────────────────
    requirements: {
      type: String,
      required: [true, 'Yêu cầu ứng viên là bắt buộc'],
    },

    // ── 10. Kỹ năng/công nghệ yêu cầu ──────────────────
    skills: {
      type: [String],
      default: [],
    },

    // ── 11a. Mức lương (text hiển thị) ──────────────────
    salary: {
      type: String,
      default: 'Thỏa thuận',
    },

    // ── 11b. Bonus: Lương min/max dạng số (để filter) ───
    salaryMin: {
      type: Number,
      default: null,
    },
    salaryMax: {
      type: Number,
      default: null,
    },

    // ── 12. Quyền lợi ───────────────────────────────────
    benefits: {
      type: String,
      default: '',
    },

    // ── 13. Deadline ứng tuyển ──────────────────────────
    deadline: {
      type: String, // format: 'YYYY-MM-DD'
      required: [true, 'Deadline ứng tuyển là bắt buộc'],
    },

    // ── 14. Link JD gốc ─────────────────────────────────
    originalUrl: {
      type: String,
      required: [true, 'Link JD gốc là bắt buộc'],
      trim: true,
    },

    // ── 15. Nguồn thu thập ──────────────────────────────
    source: {
      type: String,
      required: true,
      enum: {
        values: ['TopCV', 'ITviec', 'LinkedIn', 'VietnamWorks', 'Ybox', 'Facebook Group', 'JobsGo', 'NEU', 'Manual'],
        message: 'Nguồn không hợp lệ',
      },
    },

    // ── 16. Ngày thu thập ───────────────────────────────
    scrapedAt: {
      type: String, // format: 'YYYY-MM-DD'
      default: () => new Date().toISOString().split('T')[0],
    },

    // ── 17. Trạng thái job ──────────────────────────────
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Còn tuyển', 'Hết hạn', 'Chưa xác minh', 'Đã gửi học viên'],
        message: 'Trạng thái không hợp lệ',
      },
      default: 'Còn tuyển',
    },

    // ── 18. Mức độ phù hợp với học viên MindX ──────────
    mindxFitScore: {
      type: String,
      required: true,
      enum: {
        values: ['High', 'Medium', 'Low'],
        message: 'Fit Score phải là: High, Medium, hoặc Low',
      },
      default: 'Medium',
    },

    // ── 19. Ghi chú của team SS ─────────────────────────
    ssNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // tự thêm createdAt, updatedAt
    versionKey: false,
  }
);

// ── Indexes để tăng tốc query ────────────────────────────
jobSchema.index({ title: 'text', companyName: 'text', skills: 'text' }); // full-text search
jobSchema.index({ industry: 1 });
jobSchema.index({ level: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ source: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ mindxFitScore: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ originalUrl: 1 }, { unique: true, sparse: true }); // dedup key

module.exports = mongoose.model('Job', jobSchema);
