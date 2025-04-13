const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const methodOverride = require('method-override');
const session = require('express-session');

const app = express();
const db = new sqlite3.Database("database.db");
app.use(methodOverride('_method'));

// Then your routes

// إعداد المحرك والقوالب
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Add this at the top of your main JS file


// إعداد الميدلوير
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret-key-homeexa-123',  // 🔐 استبدله بسطر عشوائي قوي في الإنتاج
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true فقط إذا كنت تستخدم HTTPS
}));

// إنشاء جدول المستخدمين إذا لم يكن موجودًا
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
        supplier TEXT,
        branch TEXT,
        phone TEXT,
        email TEXT
    )
`);

// إنشاء جدول الطلبات إذا لم يكن موجودًا
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerPhone TEXT NOT NULL,
    customerName TEXT NOT NULL,
    customerLat REAL NOT NULL,
    customerLng REAL NOT NULL,
    serviceDate TEXT NOT NULL, 
    serviceTime TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    status TEXT CHECK(status IN ('InProgress', 'On Hold', 'completed', 'canceled', 'Assigned', 'New')) DEFAULT 'New',
    totalPrice REAL NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
   
    )
`);


/////////////////////////////Services Talble///////////////////////////////
db.run(`
    CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category Text NOT NULL,
  price REAL NOT NULL
     )`);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     db.run(`
      CREATE TABLE IF NOT EXISTS task_services (
  
  task_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,  
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
         )`);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      db.run(`
        CREATE TABLE IF NOT EXISTS time_slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  start TEXT NOT NULL,
  end TEXT NOT NULL
)
`);
///////////////////////////////////////////
db.run("INSERT OR IGNORE INTO time_slots (label, start, end) VALUES (?, ?, ?)", 
  ['9-12 ص', '09:00', '12:00']);

db.run("INSERT OR IGNORE INTO time_slots (label, start, end) VALUES (?, ?, ?)", 
  ['1-5 م', '13:00', '17:00']);

db.run("INSERT OR IGNORE INTO time_slots (label, start, end) VALUES (?, ?, ?)", 
  ['6-9 م', '18:00', '21:00']);
////////////////////////////////////////////////////////////////////////////////////////

// إضافة مستخدمين افتراضيين إذا لم يكونوا موجودين
db.run("INSERT OR IGNORE INTO users (fullName, username, supplier, branch, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
    ["Admin User", "admin", "المورد الرئيسي", "الفرع الرئيسي", "0500000000", "admin@example.com", "adminpass", "admin"]);

// db.run("INSERT OR IGNORE INTO users (fullName, username, supplier, branch, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
//     ["Normal User", "user", "مورد عادي", "فرع فرعي", "0511111111", "user@example.com", "userpass", "user"]);
    db.get("SELECT COUNT(*) AS count FROM services", (err, row) => {
        if (err) {
            return console.error("Error counting services:", err.message);
        }
    
        if (row.count > 70) {
            console.log("✅ الخدمات موجودة مسبقًا، لن يتم إعادة إدخالها.");
            return;
        }
    
        // إدخال البيانات إذا لم تكن موجودة
        db.serialize(() => {
          db.run("INSERT INTO services (name, price, category) VALUES ('افحص سباكة بيتك', 400, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('افحص كهرباء بيتك', 400, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تأسيس إنارة أرضية', 75, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تأسيس خط او نقطة كهربائية خارجي', 70, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تبديل فيش كهرباء', 20, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تثبيت القفل الذكي للباب بدون برمجة', 120, 'smart');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب اكسسوارات دورة مياه او مرآه / بالحبة الواحدة', 25, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب انتركوم', 200, 'smart');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير السخان عادي', 100, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير دش الاستحمام', 50, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير دينمو', 200, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير صفاية أرضية', 50, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير عوامة خزان', 70, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير قلب سخان مركزي', 80, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير مفتاح انارة', 20, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير مفتاح تشغيل المكيف او السخان', 30, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب أو تغيير إنارة أرضية', 35, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب ثريا جاهزة', 75, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب ثريا مع توصيل الاكسسوارات وملحقاتها', 190, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب جرس', 50, 'smart');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب حامل تلفزيون', 40, 'other');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب إنارة مع تخريم ( الحجم الصغير )', 30, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب إنارة مع  تخريم ( الحجم الكبير )', 50, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير سخان مخفي / فوري', 150, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب سماعة دش', 20, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب سيفون عربي', 80, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب شريط ليد مخفي ( اكثر من 10 متر )', 15, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب شريط ليد مخفي ( 10 متر وأقل )', 30, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب طبلون كهرباء كامل داخلي', 500, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب فلتر مياه', 200, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب كابينة استحمام شاور ( حواجز )', 300, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب كرسي افرنجي', 150, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('ازالة كرسي افرنجي', 100, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب لمبات نيون', 40, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب لوحة', 30, 'other');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب مروحة شفط', 50, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب مغسلة', 150, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب مغسلة دولاب', 200, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب طقم شور', 200, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تسليك انسداد التصريف', 300, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تسليك انسداد حوض المطبخ', 80, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير الكشاف الخارجي', 50, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب خلاط', 50, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب رداد سخان', 50, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب شطاف', 30, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب قفل الأبواب', 40, 'other');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب مقبض الأبواب', 40, 'other');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير سبوت لايت', 15, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير شمعة عامود (400led)', 50, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير غطاء كرسي افرنجي', 44, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير قلب سخان عادي', 80, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير لمبات السطح', 35, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير محبس زاوية', 25, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير محبس زاوية مع لي', 50, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تفيير مفتاح فرعي لطبلون الكهرب', 50, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير هراب مغسلة', 35, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغييرعوامة الخزان', 80, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير مفتاح  رئيسي لطبلون الكهرباء', 120, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد تصريف الغسالة', 150, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد فيش كهرباء', 50, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد كهرباء لغسالة او نشافة ملابس جديد من الطبلون', 150, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد كهرباء لفرن جديد من الطبلون', 150, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تنظيف خزانات', 180, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تنظيف سخان عادي', 80, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('صيانة انتركوم', 120, 'smart');");
          db.run("INSERT INTO services (name, price, category) VALUES ('فك وتركيب كرسي عربي', 250, 'plumbing');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تنظيف سخان مركزي', 150, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب سخان مركزي', 250, 'electricity');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تبديل إنارة', 20, 'electricity');");
          
        });
    });
    
    

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.render("Login_page");
});
// app.get("/login", (req, res) => {
//     res.render("login_page");
// });
// app.get("/test", (req, res) => {
//     res.render("test");
// });
// app.get("/test2", (req, res) => {
//     res.render("test2");
// });

// // صفحة تسجيل الدخول
// app.get("/login_page", (req, res) => {
//     res.render("Login_Page");
// });
app.get("/user_dashboard", (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/");

  const query = `
    SELECT t.*, GROUP_CONCAT(s.name, ', ') AS serviceNames
    FROM tasks t
    LEFT JOIN task_services ts ON t.id = ts.task_id
    LEFT JOIN services s ON ts.service_id = s.id
    WHERE t.createdByUserId = ?
    GROUP BY t.id
    ORDER BY t.createdAt DESC
  `;

  db.all(query, [user.id], (err, tasks) => {
    if (err) {
      console.error("Error loading tasks:", err);
      return res.status(500).send("حدث خطأ أثناء تحميل الطلبات");
    }
    res.render("user_dashboard", { tasks }); // 👈 مرر الطلبات
  });
});


// تسجيل الدخول ومعرفة الدور
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
      if (err) {
          console.error("Error fetching user:", err);
          return res.status(500).send("حدث خطأ أثناء تسجيل الدخول.");
      }
      if (!user) {
          return res.send("Invalid username or password.");
      }

      // ✅ حفظ المستخدم في الجلسة
      req.session.user = {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
      };

      if (user.role === "admin") {
          res.redirect("/admin_dashboard");
      } else {
          res.redirect("/user_dashboard");
      }
  });
});
app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "غير مصرح" });
  }

  res.json(req.session.user); // ترجع بيانات الجلسة للمستخدم الحالي
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("حدث خطأ أثناء تسجيل الخروج.");
    }
    res.redirect("/");
  });
});



// عرض لوحة تحكم المشرف
app.get("/admin_dashboard", (req, res) => {
    db.all("SELECT * FROM users", [], (err, users) => {
        if (err) {
            return res.status(500).send("حدث خطأ أثناء جلب المستخدمين.");
        }
        res.render("admin_dashboard", { users });
    });
});



// إضافة مستخدم جديد


app.post("/addUser", (req, res) => {
    const { fullName, username, password, supplier, branch, phone, email } = req.body;

    // ✅ استخدم علامات الاستفهام (؟) بدلاً من القيم المباشرة
    const sql = `INSERT INTO users (fullName, username, password, supplier, branch, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [fullName, username, password, supplier, branch, phone, email], function (err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: "حدث خطأ أثناء إضافة المستخدم", 
                error: err.message 
            });
        }
        res.json({ 
            success: true, 
            message: "تمت إضافة المستخدم بنجاح!", 
            id: this.lastID 
        });
    });
});
app.get("/getUsers", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "حدث خطأ أثناء جلب البيانات", error: err.message });
        }
        res.json({ success: true, users: rows });
    });
});


// تحديث المستخدم
app.get("/editUser/:id", (req, res) => {
    const userId = req.params.id;
    req.session.previousPage = req.headers.referer; // احفظ الرابط السابق

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).send("حدث خطأ أثناء جلب بيانات المستخدم.");
        }

        if (!user) {
            return res.status(404).send("المستخدم غير موجود.");
        }

        res.render("updateUser", {
            id: user.id,
            username: user.username,
            fullname: user.fullName,
            supplier: user.supplier,
            branch: user.branch,
            phone: user.phone,
            email: user.email,
            
        });
    });
});
app.post("/updateUser/:id", (req, res) => {
    const userId = req.params.id;
    
    const { fullName, username, password, supplier, branch, phone, email } = req.body;

    let query = "UPDATE users SET fullName = ?, username = ?, supplier = ?, branch = ?, phone = ?, email = ?";
    const params = [fullName, username, supplier, branch, phone, email];

    if (password && password.trim() !== "") {
        query += ", password = ?";
        params.push(password);
    }

    query += " WHERE id = ?";
    params.push(userId);

    db.run(query, params, function(err) {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send("حدث خطأ أثناء تحديث المستخدم.");
        }

        const redirectTo = req.session.previousPage || "/admin_dashboard";
    delete req.session.previousPage; // حذف القيمة بعد الاستخدام
    res.redirect(redirectTo);
    });
});



// حذف المستخدم
// Delete user API
app.delete("/deleteUser/:id", (req, res) => {
    const userId = req.params.id;

    db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
        if(err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("حدث خطأ أثناء حذف المستخدم.");
        }

        if(this.changes === 0) {
            return res.status(404).send("المستخدم غير موجود.");
        }

        res.send("تم حذف المستخدم بنجاح.");
    });
});

//////////////////////////////////////////////////////
// إضافة طلب جديد
app.post('/addtask', (req, res) => {
  const {
    customerPhone,
    customerName,
    customerLat,
    customerLng,
    serviceDate,
    serviceTime,
    paymentMethod,
    totalPrice,
    services
  } = req.body;

  const createdByUserId = req.session?.user?.id || null;

  if (
    !customerPhone || !customerName || !customerLat || !customerLng ||
    !serviceDate || !serviceTime || !paymentMethod || !totalPrice
  ) {
    return res.status(400).json({
      success: false,
      message: "جميع الحقول مطلوبة ويجب اختيار خدمة واحدة على الأقل"
    });
  }

  const sql = `
    INSERT INTO tasks (
      customerPhone, customerName, customerLat, customerLng,
      serviceDate, serviceTime, paymentMethod, status,
      totalPrice, createdAt, createdByUserId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Assigned', ?, datetime('now'), ?)
  `;

  db.run(sql, [
    customerPhone,
    customerName,
    customerLat,
    customerLng,
    serviceDate,
    serviceTime,
    paymentMethod,
    totalPrice,
    createdByUserId
  ], function (err) {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    const taskId = this.lastID;

    if (Array.isArray(services) && services.length > 0) {
      const stmt = db.prepare('INSERT INTO task_services (task_id, service_id) VALUES (?, ?)');
      services.forEach(serviceId => {
        stmt.run(taskId, serviceId);
      });
      stmt.finalize();
    }

    res.json({ success: true, taskId });
  });
});

  





// جلب جميع الطلبات
app.get("/gettasks", (req, res) => {
  const { supplier = "", status = "" } = req.query;

  let baseQuery = `SELECT * FROM tasks WHERE 1=1`;
  const params = [];

  if (supplier) {
    baseQuery += ` AND customerName LIKE ?`;
    params.push(`%${supplier}%`);
  }

  if (status) {
    baseQuery += ` AND LOWER(status) = LOWER(?)`;
    params.push(status.toLowerCase());
  }

  db.all(baseQuery, params, (err, tasks) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "خطأ في جلب الطلبات",
        error: err.message,
      });
    }

    if (!tasks.length) return res.json([]);

    const taskIds = tasks.map(t => t.id);
    const placeholders = taskIds.map(() => '?').join(',');

    const serviceQuery = `
      SELECT ts.task_id, s.name 
      FROM task_services ts 
      JOIN services s ON ts.service_id = s.id 
      WHERE ts.task_id IN (${placeholders})
    `;

    db.all(serviceQuery, taskIds, (err, serviceRows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "خطأ في جلب الخدمات",
          error: err.message,
        });
      }

      const servicesMap = {};
      serviceRows.forEach(row => {
        if (!servicesMap[row.task_id]) servicesMap[row.task_id] = [];
        servicesMap[row.task_id].push(row.name);
      });

      const enrichedTasks = tasks.map(task => ({
        ...task,
        customerLocation: `https://www.google.com/maps?q=${task.customerLat},${task.customerLng}`,
        services: servicesMap[task.id] || []
      }));

      res.json(enrichedTasks);
    });
  });
});







  app.get('/user_tasks', (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).send("غير مصرح");
  
    const query = `SELECT * FROM tasks WHERE createdByUserId = ? ORDER BY createdAt DESC`;
  
    db.all(query, [user.id], (err, tasks) => {
      if (err) return res.status(500).send("خطأ في قاعدة البيانات");
  
      if (!tasks.length) return res.render("user_tasks", { tasks: [] });
  
      const taskIds = tasks.map(t => t.id);
      const placeholders = taskIds.map(() => '?').join(',');
      const serviceQuery = `SELECT ts.task_id, s.name FROM task_services ts JOIN services s ON ts.service_id = s.id WHERE ts.task_id IN (${placeholders})`;
  
      db.all(serviceQuery, taskIds, (err, serviceRows) => {
        if (err) return res.status(500).send("فشل في جلب الخدمات");
  
        const servicesMap = {};
        serviceRows.forEach(row => {
          if (!servicesMap[row.task_id]) servicesMap[row.task_id] = [];
          servicesMap[row.task_id].push(row.name);
        });
  
        const enriched = tasks.map(t => ({
          ...t,
          services: servicesMap[t.id] || [],
          customerLocation: `https://www.google.com/maps?q=${t.customerLat},${t.customerLng}`
        }));
  
        res.render("user_tasks", { tasks: enriched });
      });
    });
  });
  app.get('/my-tasks', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).send("غير مصرح");
  
    const query = `SELECT * FROM tasks WHERE createdByUserId = ?`;
    db.all(query, [userId], (err, tasks) => {
      if (err) return res.status(500).send("خطأ في قاعدة البيانات");
  
      const taskIds = tasks.map(t => t.id);
      if (taskIds.length === 0) return res.render("user_tasks", { tasks: [] });
  
      const placeholders = taskIds.map(() => '?').join(',');
      db.all(`SELECT ts.task_id, s.name FROM task_services ts JOIN services s ON ts.service_id = s.id WHERE ts.task_id IN (${placeholders})`, taskIds, (err, serviceRows) => {
        const servicesMap = {};
        serviceRows.forEach(row => {
          if (!servicesMap[row.task_id]) servicesMap[row.task_id] = [];
          servicesMap[row.task_id].push(row.name);
        });
  
        const enriched = tasks.map(t => ({
          ...t,
          services: servicesMap[t.id] || [],
          customerLocation: `https://www.google.com/maps?q=${t.customerLat},${t.customerLng}`
        }));
  
        res.render("user_tasks", { tasks: enriched });
      });
    });
  });
  
  



// GET route to display the edit form
// GET route to display the edit form - Fixed to match your schema
app.get('/edit_task/:id', (req, res) => {
    const taskId = req.params.id;
  
    db.get(`SELECT * FROM tasks WHERE id = ?`, [taskId], (err, task) => {
      if (err) {
        console.error('Error fetching task:', err);
        return res.status(500).send('حدث خطأ أثناء جلب بيانات المهمة');
      }
  
      if (!task) {
        return res.status(404).send('لم يتم العثور على المهمة');
      }
  
      db.all(`SELECT service_id FROM task_services WHERE task_id = ?`, [taskId], (err, serviceRows) => {
        if (err) {
          console.error('Error fetching task services:', err);
          return res.status(500).send('حدث خطأ أثناء جلب خدمات المهمة');
        }
  
        const selectedServiceIds = serviceRows.map(row => row.service_id);
  
        db.all(`SELECT * FROM services`, [], (err, allServices) => {
          if (err) {
            console.error('Error fetching all services:', err);
            return res.status(500).send('حدث خطأ أثناء جلب قائمة الخدمات');
          }
  
          // حساب السعر الإجمالي بناءً على الخدمات المختارة
          const totalPrice = allServices
            .filter(service => selectedServiceIds.includes(service.id))
            .reduce((sum, s) => sum + s.price, 0);
  
          res.render('editTask', {
            task: {
              ...task,
              serviceIds: selectedServiceIds,
              totalPrice: totalPrice
            },
            allServices,
            selectedServiceIds
          });
        });
      });
    });
  });
  
  
  
  //POST route to handle task updates - Fixed to match your schema
  // app.post('/update_task/:id', (req, res) => {
  //   const taskId = req.params.id;
  
  //   let {
  //     customerPhone,
  //     customerName,
  //     customerLat,
  //     customerLng,
  //     serviceTime,
  //     paymentMethod,
  //     status, 
  //     services // يجب أن تكون مصفوفة من أرقام
  //   } = req.body;

  //   console.log(req.body);
  
  //   // ✅ حاول تحويلها إلى مصفوفة إذا كانت موجودة كسلسلة
  //   if (typeof services === 'string') {
  //     services = [services]; // إذا كانت خدمة واحدة فقط
  //   }
  
  //   // if (!Array.isArray(services) || services.length === 0) {
  //   //   return res.status(400).json({
  //   //     success: false,
  //   //     message: "يجب اختيار خدمة واحدة على الأقل"
  //   //   });
  //   // }
  
  //   // ✅ تحقق من الحقول المهمة
  //   if (!customerPhone || !customerName || !customerLat || !customerLng || !serviceTime || !paymentMethod) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "جميع الحقول مطلوبة"
  //     });
  //   }
  
  //   const updateTaskSql = `
  //     UPDATE tasks
  //     SET
  //       customerPhone = ?,
  //       customerName = ?,
  //       customerLat = ?,
  //       customerLng = ?,
  //       serviceTime = ?,
  //       paymentMethod = ?,
  //       status = ? WHERE id = ?
  //   `;
  
  //   db.run(updateTaskSql, [
  //     customerPhone,
  //     customerName,
  //     customerLat,
  //     customerLng,
  //     serviceTime,
  //     paymentMethod,
  //     status || 'Assigned',
      
  //     taskId
  //   ], function (err) {
  //     if (err) {
  //       console.error("Error updating task:", err);
  //       return res.status(500).json({ success: false, message: "فشل تحديث الطلب", error: err.message });
  //     }
  //     else{
  //        return res.render("admin_dashboard");
  //     }
  
  // //     // 🧹 حذف الخدمات القديمة
  // //   //   db.run(`DELETE FROM task_services WHERE task_id = ?`, [taskId], (err) => {
  // //   //     if (err) {
  // //   //       console.error("Error clearing old services:", err);
  // //   //       return res.status(500).json({ success: false, message: "فشل حذف الخدمات القديمة", error: err.message });
  // //   //     }
  
  // //   //     // ➕ إضافة الخدمات الجديدة
  // //   //     const insertStmt = db.prepare(`INSERT INTO task_services (task_id, service_id) VALUES (?, ?)`);
  // //   //     services.forEach(serviceId => insertStmt.run(taskId, serviceId));
  // //   //     insertStmt.finalize();
  
  // //   //     // 💰 حساب السعر الإجمالي
  // //   //     const placeholders = services.map(() => '?').join(',');
  // //   //     db.get(`SELECT SUM(price) AS total FROM services WHERE id IN (${placeholders})`, services, (err, result) => {
  // //   //       if (err) {
  // //   //         console.error("Error calculating total:", err);
  // //   //         return res.status(500).json({ success: false, message: "فشل في حساب السعر", error: err.message });
  // //   //       }
  
  // //   //       const totalPrice = result.total || 0;
  
  // //   //       db.run(`UPDATE tasks SET totalPrice = ? WHERE id = ?`, [totalPrice, taskId], (err) => {
  // //   //         if (err) {
  // //   //           console.error("Error updating total price:", err);
  // //   //           return res.status(500).json({ success: false, message: "تم التعديل ولكن لم يتم تحديث السعر", error: err.message });
  // //   //         }
  
  // //   //         return res.json({ success: true, message: "تم تحديث الطلب بنجاح" });
  // //   //       });
  // //   //     });
  // //   //   }); //delete
  //   });
  // });
  // // app.post('/update_task/:id', (req, res) => {
  // //   const taskId = req.params.id;
  
  // //   let {
  // //     customerPhone,
  // //     customerName,
  // //     customerLat,
  // //     customerLng,
  // //     serviceTime,
  // //     paymentMethod,
  // //     status,
  // //     services, // [{ id: 3, quantity: 2 }, ...]
  // //     totalPrice
  // //   } = req.body;
  
  // //   // ⚠️ تأكد من أن الخدمات مصفوفة من كائنات
  // //   if (typeof services === 'string') {
  // //     try {
  // //       services = JSON.parse(services);
  // //     } catch {
  // //       services = [{ id: services, quantity: 1 }];
  // //     }
  // //   }
  
  // //   if (!Array.isArray(services) || services.length === 0) {
  // //     return res.status(400).json({
  // //       success: false,
  // //       message: "يجب اختيار خدمة واحدة على الأقل"
  // //     });
  // //   }
  
  // //   if (!customerPhone || !customerName || !customerLat || !customerLng || !serviceTime || !paymentMethod) {
  // //     return res.status(400).json({
  // //       success: false,
  // //       message: "جميع الحقول مطلوبة"
  // //     });
  // //   }
  
  // //   const updateTaskSql = `
  // //     UPDATE tasks SET
  // //       customerPhone = ?,
  // //       customerName = ?,
  // //       customerLat = ?,
  // //       customerLng = ?,
  // //       serviceTime = ?,
  // //       paymentMethod = ?,
  // //       status = ?,
  // //       totalPrice = ?
  // //     WHERE id = ?
  // //   `;
  
  // //   db.run(updateTaskSql, [
  // //     customerPhone,
  // //     customerName,
  // //     customerLat,
  // //     customerLng,
  // //     serviceTime,
  // //     paymentMethod,
  // //     status || 'Assigned',
  // //     totalPrice || 0,
  // //     taskId
  // //   ], function (err) {
  // //     if (err) {
  // //       console.error("Error updating task:", err);
  // //       return res.status(500).json({ success: false, message: "فشل تحديث الطلب", error: err.message });
  // //     }
  
  // //     // حذف الخدمات القديمة
  // //     db.run(`DELETE FROM task_services WHERE task_id = ?`, [taskId], err => {
  // //       if (err) {
  // //         return res.status(500).json({ success: false, message: "فشل حذف الخدمات السابقة" });
  // //       }
  
  // //       const insertStmt = db.prepare(`INSERT INTO task_services (task_id, service_id, quantity) VALUES (?, ?, ?)`);
  // //       services.forEach(service => {
  // //         insertStmt.run(taskId, service.id, service.quantity || 1);
  // //       });
  // //       insertStmt.finalize();
  
  // //       res.redirect("/admin_dashboard"); // ✅ يمكنك تغييره حسب ما تريد
  // //     });
  // //   });
  // // });
  app.post("/update_task/:id", (req, res) => {
    const { customerName, customerPhone, customerLat, customerLng, serviceTime, paymentMethod, status, totalPrice } = req.body;
    const taskId = req.params.id;
  
    const updateQuery = `
      UPDATE tasks
      SET customerName = ?, customerPhone = ?, customerLat = ?, customerLng = ?,
          serviceTime = ?, paymentMethod = ?, status = ?, totalPrice = ?
      WHERE id = ?
    `;
  
    db.run(updateQuery, [customerName, customerPhone, customerLat, customerLng, serviceTime, paymentMethod, status, totalPrice, taskId], function(err) {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).send("حدث خطأ أثناء تحديث الطلب");
      }
      res.redirect("/admin_dashboard"); // أو اعرض صفحة تأكيد التعديل
    });
  });
  
  
  

  // DELETE route to delete an order
  app.delete('/deleteorder/:id', (req, res) => {
    const orderId = req.params.id;

    const sql = 'DELETE FROM tasks WHERE id = ?';

    db.run(sql, [orderId], function (err) {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({
                success: false,
                message: "فشل حذف الطلب",
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "الطلب غير موجود"
            });
        }

        res.json({
            success: true,
            message: "تم حذف الطلب بنجاح"
        });
    });
});
app.get("/chart", (req, res) => {
    res.render("chart");
});

app.get('/search-order/:phone', (req, res) => {
    const { phone } = req.params;

    if (!phone) {
        return res.status(400).json({ 
            message: 'Phone number is required' 
        });
    }

    const query = `
        SELECT 
            customerPhone, 
            customerName, 
            customerLat,
            customerLng,
            
            serviceTime, 
            paymentMethod
        FROM tasks 
        WHERE customerPhone = ?
    `;

    db.get(query, [phone], (err, order) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                message: 'Server error while searching order',
                error: err.message 
            });
        }

        if (!order) {
            return res.status(404).json({ 
                message: 'No order found with this phone number' 
            });
        }

        // Construct Google Maps URL using coordinates
        order.customerLocation = `https://www.google.com/maps?q=${order.customerLat},${order.customerLng}`;

        // Optionally, remove the latitude and longitude fields from the response
        delete order.customerLat;
        delete order.customerLng;

        res.json(order);
    });
});
/////////////////////////////////////////////////
app.get("/search-tasks", (req, res) => {
  const { name = '', status = '' } = req.query;
  const baseQuery = `SELECT * FROM tasks WHERE 1=1`;
  const conditions = [];
  // if (status) {
  //   conditions.push("status = ?");
  //   params.push(status); // ← لا تعدل القيمة هنا
  // }
  const params = [];

  if (name) {
    conditions.push("customerName LIKE ?");
    params.push(`%${name}%`);
  }
  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  const query = [baseQuery, ...conditions.map(c => `AND ${c}`)].join(" ");

  db.all(query, params, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!tasks.length) return res.json([]);

    const taskIds = tasks.map(t => t.id);
    const placeholders = taskIds.map(() => '?').join(',');
    const serviceQuery = `SELECT ts.task_id, s.name FROM task_services ts JOIN services s ON ts.service_id = s.id WHERE ts.task_id IN (${placeholders})`;

    db.all(serviceQuery, taskIds, (err, serviceRows) => {
      if (err) return res.status(500).json({ error: err.message });
      const servicesMap = {};
      serviceRows.forEach(r => {
        if (!servicesMap[r.task_id]) servicesMap[r.task_id] = [];
        servicesMap[r.task_id].push(r.name);
      });
      const enriched = tasks.map(task => ({
        ...task,
        customerLocation: `https://www.google.com/maps?q=${task.customerLat},${task.customerLng}`,
        services: servicesMap[task.id] || []
      }));
      res.json(enriched);
    });
  });
});

const columnExists = async (tableName, columnName) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
      if (err) return reject(err);
      const exists = rows.some(row => row.name === columnName);
      resolve(exists);
    });
  });
};

const addColumnIfNotExists = async (table, column, type) => {
  const exists = await columnExists(table, column);
  if (!exists) {
    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    console.log(`✅ Added column ${column} to ${table}`);
  } else {
    console.log(`ℹ️ Column ${column} already exists in ${table}`);
  }
};
(async () => {
  await addColumnIfNotExists("tasks", "createdByUserId", "INTEGER");
})();




// تشغيل الخادم
const PORT = process.env.PORT || 3000;;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
