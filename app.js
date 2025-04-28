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
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    createdByUserId INTEGER,
FOREIGN KEY (createdByUserId) REFERENCES users(id)
   
    )
`);


/////////////////////////////Services Talble///////////////////////////////
// db.run("DROP TABLE IF EXISTS services", (err) => {
//   if (err) return console.error("❌ فشل حذف الجدول:", err.message);
//   console.log("✅ تم حذف جدول الخدمات بنجاح");
// });

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
          db.run("INSERT INTO services (name, price, category) VALUES ('افحص سباكة بيتك', 400, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('افحص كهرباء بيتك', 400, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تأسيس إنارة أرضية', 75, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تأسيس خط او نقطة كهربائية خارجي', 70, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تبديل فيش كهرباء', 20, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تثبيت القفل الذكي للباب بدون برمجة', 120, 'ذكى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب اكسسوارات دورة مياه او مرآه / بالحبة الواحدة', 25, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب انتركوم', 200, 'ذكى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير السخان عادي', 100, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير دش الاستحمام', 50, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير دينمو', 200, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير صفاية أرضية', 50, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير عوامة خزان', 70, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير قلب سخان مركزي', 80, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير مفتاح انارة', 20, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير مفتاح تشغيل المكيف او السخان', 30, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب أو تغيير إنارة أرضية', 35, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب ثريا جاهزة', 75, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب ثريا مع توصيل الاكسسوارات وملحقاتها', 190, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب جرس', 50, 'ذكى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب حامل تلفزيون', 40, 'اخرى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب إنارة مع تخريم ( الحجم الصغير )', 30, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب إنارة مع  تخريم ( الحجم الكبير )', 50, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب او تغيير سخان مخفي / فوري', 150, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب سماعة دش', 20, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب سيفون عربي', 80, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب شريط ليد مخفي ( اكثر من 10 متر )', 15, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب شريط ليد مخفي ( 10 متر وأقل )', 30, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب طبلون كهرباء كامل داخلي', 500, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب فلتر مياه', 200, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب كابينة استحمام شاور ( حواجز )', 300, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب كرسي افرنجي', 150, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('ازالة كرسي افرنجي', 100, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب لمبات نيون', 40, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب لوحة', 30, 'اخرى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب مروحة شفط', 50, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب مغسلة', 150, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب مغسلة دولاب', 200, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب طقم شور', 200, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تسليك انسداد التصريف', 300, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تسليك انسداد حوض المطبخ', 80, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير الكشاف الخارجي', 50, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب خلاط', 50, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب رداد سخان', 50, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب شطاف', 30, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب قفل الأبواب', 40, 'اخرى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير او تركيب مقبض الأبواب', 40, 'اخرى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير سبوت لايت', 15, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير شمعة عامود (400led)', 50, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير غطاء كرسي افرنجي', 44, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير قلب سخان عادي', 80, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير لمبات السطح', 35, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير محبس زاوية', 25, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير محبس زاوية مع لي', 50, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تفيير مفتاح فرعي لطبلون الكهرب', 50, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير هراب مغسلة', 35, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغييرعوامة الخزان', 80, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تغيير مفتاح  رئيسي لطبلون الكهرباء', 120, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد تصريف الغسالة', 150, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد فيش كهرباء', 50, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد كهرباء لغسالة او نشافة ملابس جديد من الطبلون', 150, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تمديد كهرباء لفرن جديد من الطبلون', 150, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تنظيف خزانات', 180, ' سباكة');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تنظيف سخان عادي', 80, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('صيانة انتركوم', 120, 'ذكى');");
          db.run("INSERT INTO services (name, price, category) VALUES ('فك وتركيب كرسي عربي', 250, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تنظيف سخان مركزي', 150, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تركيب سخان مركزي', 250, 'كهرباء');");
          db.run("INSERT INTO services (name, price, category) VALUES ('تبديل إنارة', 20, 'كهرباء');");
          
        });
    });
    
    

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.render("Login_page");
});

app.get("/user_dashboard", (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/");

  const taskQuery = `
    SELECT t.*, GROUP_CONCAT(s.name, ', ') AS serviceNames
    FROM tasks t
    LEFT JOIN task_services ts ON t.id = ts.task_id
    LEFT JOIN services s ON ts.service_id = s.id
    WHERE t.createdByUserId = ?
    GROUP BY t.id
    ORDER BY t.createdAt DESC
  `;

  const slotsQuery = `SELECT * FROM time_slots ORDER BY start`;

  db.all(taskQuery, [user.id], (err, tasks) => {
    if (err) {
      console.error("Error loading tasks:", err);
      return res.status(500).send("حدث خطأ أثناء تحميل الطلبات");
    }

    db.all(slotsQuery, [], (err, slots) => {
      if (err) {
        console.error("Error loading time slots:", err);
        return res.status(500).send("حدث خطأ أثناء تحميل الفترات الزمنية");
      }

      res.render("user_dashboard", { tasks, slots }); // 👈 مرر أيضًا slots
    });
  });
});



// تسجيل الدخول ومعرفة الدور
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
      if (err) {
          console.error("Error fetching user:", err);
          return res.send(`<script>alert("حدث خطأ داخلي."); window.location.href = "/";</script>`);
        
      }
      if (!user) {
          return res.send(`<script>alert("اسم المستخدم أو كلمة المرور غير صحيحة"); window.location.href = "/";</script>`);
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
    if (err) return res.status(500).send("حدث خطأ أثناء جلب المستخدمين.");

    db.all("SELECT * FROM time_slots", [], (err, timeSlots) => {
      if (err) return res.status(500).send("خطأ في الفترات الزمنية");

      db.all("SELECT * FROM services", [], (err, services) => {
        if (err) return res.status(500).send("حدث خطأ أثناء جلب الخدمات");

        res.render("admin_dashboard", {
          users,
          timeSlots,
          services // ✅ مرر الخدمات هنا
        });
      });
    });
  });
});
app.post("/update-timeslots", (req, res) => {
  const { ids, labels, starts, ends } = req.body;

  const allIds = Array.isArray(ids) ? ids : [ids];
  const allLabels = Array.isArray(labels) ? labels : [labels];
  const allStarts = Array.isArray(starts) ? starts : [starts];
  const allEnds = Array.isArray(ends) ? ends : [ends];

  const stmt = db.prepare("UPDATE time_slots SET label = ?, start = ?, end = ? WHERE id = ?");

  allIds.forEach((id, i) => {
    stmt.run(allLabels[i], allStarts[i], allEnds[i], id);
  });

  stmt.finalize(() => {
    res.redirect("/admin_dashboard");
  });
});




app.get("/api/timeblocks", (req, res) => {
  db.all("SELECT * FROM time_slots", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const blocks = {};
    rows.forEach(slot => {
      blocks[slot.label] = {
        start: slot.start,
        end: slot.end
      };
    });

    res.json(blocks);
  });
});

app.get('/manage-timeslots', (req, res) => {
  db.all("SELECT * FROM time_slots ORDER BY start", (err, rows) => {
    if (err) {
      return res.status(500).send("خطأ في تحميل الفترات الزمنية");
    }
    res.render("time_slots", { slots: rows });
  });
});
app.get("/api/timeblocks", (req, res) => {
  db.all("SELECT * FROM time_slots", (err, rows) => {
    if (err) return res.status(500).json({ error: "خطأ" });
    const map = {};
    rows.forEach(r => map[r.label] = { start: r.start, end: r.end });
    res.json(map);
  });
});
app.get("/time_slots", (req, res) => {
  db.all("SELECT * FROM time_slots ORDER BY id", (err, slots) => {
    if (err) return res.status(500).send("فشل في تحميل الفترات");
    res.render("time_slots", { slots });
  });
});

app.post("/add-timeslot", (req, res) => {
  const { label, start, end } = req.body;
  db.run("INSERT INTO time_slots (label, start, end) VALUES (?, ?, ?)", [label, start, end], err => {
    if (err) return res.status(500).send("فشل في الإضافة");
    res.redirect("/admin_dashboard");
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
    services // ✅ [{ id, quantity }]
  } = req.body;

  const createdByUserId = req.session?.user?.id || null;
  const createdBySupplier = req.session?.user?.fullName || 'Admin';

  if (
    !customerPhone || !customerName || !customerLat || !customerLng ||
    !serviceDate || !serviceTime || !paymentMethod || !totalPrice ||
    !Array.isArray(services) || services.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "جميع الحقول مطلوبة ويجب اختيار خدمة واحدة على الأقل"
    });
  }

  const insertTaskQuery = `
    INSERT INTO tasks (
      customerPhone, customerName, customerLat, customerLng,
      serviceDate, serviceTime, paymentMethod, status,
      totalPrice, createdAt, createdByUserId,createdBySupplier
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, datetime('now'), ?,?)
  `;

  db.run(insertTaskQuery, [
    customerPhone,
    customerName,
    customerLat,
    customerLng,
    serviceDate,
    serviceTime,
    paymentMethod,
    totalPrice,
    createdByUserId,
    createdBySupplier
  ], function (err) {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    const taskId = this.lastID;

    const stmt = db.prepare('INSERT INTO task_services (task_id, service_id, quantity) VALUES (?, ?, ?)');
    services.forEach(s => {
      if (s.id && s.quantity) {
        stmt.run(taskId, s.id, s.quantity);
      }
    });
    stmt.finalize();

    res.json({ success: true, taskId });
  });
});

app.get("/search-by-creator", (req, res) => {
  const { creatorName = '' } = req.query;

  if (!creatorName) {
    return res.status(400).json({ success: false, message: "يجب إدخال اسم منشئ البحث" });
  }

  const query = `
    SELECT t.*, u.fullName AS creatorName
    FROM tasks t
    LEFT JOIN users u ON t.createdByUserId = u.id
    WHERE u.fullName LIKE ?
    ORDER BY t.createdAt DESC
  `;

  db.all(query, [`%${creatorName}%`], (err, tasks) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "خطأ في قاعدة البيانات" });
    }

    res.json({ success: true, tasks });
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
      SELECT ts.task_id, s.name, s.price, ts.quantity
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

      // ربط الخدمات بكل طلب مع الكمية والسعر
      const servicesMap = {};
      serviceRows.forEach(row => {
        if (!servicesMap[row.task_id]) servicesMap[row.task_id] = [];
        const totalPrice = row.price * row.quantity;
servicesMap[row.task_id].push(`${row.name} (×${row.quantity}) - ${totalPrice.toFixed(2)} SAR`);
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

//////////////////////////////////////////////////////////////////////////////////////
app.get("/user-tasks", (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

  db.all(`SELECT * FROM tasks WHERE createdByUserId = ?`, [userId], (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!tasks.length) return res.json([]);

    const taskIds = tasks.map(t => t.id);
    const placeholders = taskIds.map(() => '?').join(',');
    
    const serviceQuery = `
      SELECT ts.task_id, s.name, ts.quantity, s.price
      FROM task_services ts
      JOIN services s ON ts.service_id = s.id
      WHERE ts.task_id IN (${placeholders})
    `;

    db.all(serviceQuery, taskIds, (err, serviceRows) => {
      if (err) return res.status(500).json({ error: err.message });

      const servicesMap = {};
      serviceRows.forEach(row => {
        if (!servicesMap[row.task_id]) servicesMap[row.task_id] = [];
        const totalPrice = row.price * row.quantity;
        servicesMap[row.task_id].push({
          name: row.name,
          quantity: row.quantity,
          totalPrice: totalPrice.toFixed(2)
        });
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
    if (err) return res.status(500).send('حدث خطأ أثناء جلب بيانات المهمة');
    if (!task) return res.status(404).send('لم يتم العثور على المهمة');

    db.all(`SELECT service_id, quantity FROM task_services WHERE task_id = ?`, [taskId], (err, serviceRows) => {
      if (err) return res.status(500).send('حدث خطأ أثناء جلب خدمات المهمة');

      const selectedServiceIds = serviceRows.map(row => row.service_id);
      const serviceQuantities = {};
      serviceRows.forEach(row => {
        serviceQuantities[row.service_id] = row.quantity;
      });

      db.all(`SELECT * FROM services`, [], (err, allServices) => {
        if (err) return res.status(500).send('حدث خطأ أثناء جلب قائمة الخدمات');

        // ✅ حساب السعر الإجمالي مع الضريبة
        let baseTotal = 0;
        selectedServiceIds.forEach(id => {
          const service = allServices.find(s => s.id === id);
          if (service) {
            const qty = serviceQuantities[id] || 1;
            baseTotal += service.price * qty;
          }
        });

        const vat = baseTotal * 0.15;
        const calculatedTotalPrice = baseTotal + vat;

        // ✅ استخدم السعر المحفوظ في قاعدة البيانات إذا كان السعر المحسوب 0
        const finalTotalPrice = calculatedTotalPrice === 0 ? task.totalPrice : calculatedTotalPrice;

        res.render('editTask', {
          task: {
            ...task,
            serviceIds: selectedServiceIds,
            totalPrice: finalTotalPrice
          },
          allServices,
          selectedServiceIds,
          serviceQuantities
        });
      });
    });
  });
});
  app.post('/update_task/:id', (req, res) => {
    const taskId = req.params.id;
    
    const {
      customerPhone,
      customerName,
      customerLat,
      customerLng,
      serviceTime,
      paymentMethod,
      status,
      totalPrice
    } = req.body;
  
    const updateQuery = `
      UPDATE tasks SET customerName = ?, customerPhone = ?, customerLat = ?, customerLng = ?,
      serviceTime = ?, paymentMethod = ?, status = ?, totalPrice = ? WHERE id = ?
    `;
  
    db.run(updateQuery, [
      customerName,
      customerPhone,
      customerLat,
      customerLng,
      serviceTime,
      paymentMethod,
      status,
      totalPrice,
      taskId
    ], err => {
      if (err) return res.status(500).send("فشل التحديث");
  
      // 🧹 حذف الخدمات القديمة
      db.run(`DELETE FROM task_services WHERE task_id = ?`, [taskId], err => {
        if (err) return res.status(500).send("فشل حذف الخدمات");
  
        const insertStmt = db.prepare(`INSERT INTO task_services (task_id, service_id, quantity) VALUES (?, ?, ?)`);
  
        Object.keys(req.body).forEach(key => {
          if (key.startsWith("qty_")) {
            const serviceId = key.split("_")[1];
            const quantity = parseInt(req.body[key]);
            insertStmt.run(taskId, serviceId, quantity);
          }
        });
  
        insertStmt.finalize();
        res.redirect("/admin_dashboard");
      });
    });
  });
  app.post('/edit_task/:id', (req, res) => {
    const taskId = req.params.id;
    const {
      customerPhone,
      customerName,
      customerLat,
      customerLng,
      serviceTime,
      paymentMethod,
      status,
      totalPrice,
      services
    } = req.body;
  
    if (!customerPhone || !customerName || !customerLat || !customerLng || !serviceTime || !paymentMethod || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "جميع الحقول مطلوبة ويجب اختيار خدمة واحدة على الأقل" });
    }
  
    const updateQuery = `
      UPDATE tasks SET customerName = ?, customerPhone = ?, customerLat = ?, customerLng = ?,
      serviceTime = ?, paymentMethod = ?, status = ?, totalPrice = ? WHERE id = ?
    `;
  
    db.run(updateQuery, [
      customerName,
      customerPhone,
      customerLat,
      customerLng,
      serviceTime,
      paymentMethod,
      status,
      totalPrice,
      taskId
    ], err => {
      if (err) return res.status(500).json({ success: false, message: "فشل التحديث", error: err.message });
  
      // حذف الخدمات القديمة
      db.run(`DELETE FROM task_services WHERE task_id = ?`, [taskId], err => {
        if (err) return res.status(500).json({ success: false, message: "فشل حذف الخدمات" });
  
        const insertStmt = db.prepare(`INSERT INTO task_services (task_id, service_id, quantity) VALUES (?, ?, ?)`);
  
        services.forEach(service => {
          insertStmt.run(taskId, service.id, service.quantity || 1);
        });
  
        insertStmt.finalize();
        return res.json({ success: true, message: "تم التحديث بنجاح" });
      });
    });
  });
  
  //////////////////////////////
  app.get("/orders-by-supplier", (req, res) => {
    const supplier = req.query.supplier;
  
    if (!supplier) return res.status(400).send("يجب تحديد اسم المورد");
  
    db.all(`
      SELECT * FROM tasks
      WHERE createdByUserId IN (SELECT id FROM users WHERE supplier = ?)
      ORDER BY createdAt DESC
    `, [supplier], (err, tasks) => {
      if (err) return res.status(500).send("خطأ في قاعدة البيانات");
  
      if (!tasks.length) return res.render("orders_by_supplier", { supplier, tasks: [] });
  
      const taskIds = tasks.map(t => t.id);
      const placeholders = taskIds.map(() => '?').join(',');
  
      const serviceQuery = `
        SELECT ts.task_id, s.name, ts.quantity, s.price
        FROM task_services ts
        JOIN services s ON ts.service_id = s.id
        WHERE ts.task_id IN (${placeholders})
      `;
  
      db.all(serviceQuery, taskIds, (err, serviceRows) => {
        if (err) return res.status(500).send("فشل في جلب الخدمات");
  
        const servicesMap = {};
        serviceRows.forEach(row => {
          if (!servicesMap[row.task_id]) servicesMap[row.task_id] = [];
          const totalPrice = (row.price || 0) * (row.quantity || 1);
          servicesMap[row.task_id].push(`${row.name} (×${row.quantity}) - ${totalPrice.toFixed(2)} SAR`);
        });
  
        const enrichedTasks = tasks.map(task => ({
          ...task,
          serviceNames: servicesMap[task.id] ? servicesMap[task.id].join(', ') : "لا توجد خدمات"
        }));
  
        res.render("orders_by_supplier", { supplier, tasks: enrichedTasks });
      });
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

  if (!phone || phone.trim() === "") {
    return res.status(400).json({ success: false, message: 'رقم الهاتف مطلوب' });
  }

  db.get(`
    SELECT 
      id,
      customerPhone,
      customerName,
      customerLat,
      customerLng,
      serviceDate,
      serviceTime,
      paymentMethod,
      status,
      totalPrice,
      createdAt
    FROM tasks 
    WHERE customerPhone = ?
    ORDER BY createdAt DESC
    LIMIT 1
  `, [phone.trim()], (err, task) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: 'خطأ في قاعدة البيانات', error: err.message });
    }

    if (!task) {
      return res.status(404).json({ success: false, message: 'لا يوجد طلب مرتبط بهذا الرقم' });
    }

    // إضافة رابط الخريطة حسب خطوط الطول والعرض
    task.customerLocation = `https://www.google.com/maps?q=${task.customerLat},${task.customerLng}`;

    res.json({
      success: true,
      task: {
        id: task.id,
        customerPhone: task.customerPhone,
        customerName: task.customerName,
        customerLat: task.customerLat,
        customerLng: task.customerLng,
        customerLocation: task.customerLocation,
        serviceDate: task.serviceDate,
        serviceTime: task.serviceTime,
        paymentMethod: task.paymentMethod,
        status: task.status,
        totalPrice: task.totalPrice,
        createdAt: task.createdAt
      }
    });
  });
});




/////////////////////////////////////////////////
app.get("/search-tasks", (req, res) => {
  const { name = '', status = '' } = req.query;

  let baseQuery = `
    SELECT t.*, u.supplier AS createdBySupplier
    FROM tasks t
    LEFT JOIN users u ON t.createdByUserId = u.id
    WHERE 1=1
  `;
  const conditions = [];
  const params = [];

  if (name) {
    conditions.push("u.supplier LIKE ?");
    params.push(`%${name}%`);
  }

  if (status) {
    conditions.push("LOWER(t.status) = LOWER(?)");
    params.push(status.toLowerCase());
  }

  const finalQuery = [baseQuery, ...conditions.map(c => `AND ${c}`)].join(" ");

  db.all(finalQuery, params, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!tasks.length) return res.json([]);

    const taskIds = tasks.map(t => t.id);
    const placeholders = taskIds.map(() => '?').join(',');

    const serviceQuery = `
  SELECT ts.task_id, s.name, s.price, ts.quantity
  FROM task_services ts
  JOIN services s ON ts.service_id = s.id
  WHERE ts.task_id IN (${placeholders})
`;

db.all(serviceQuery, taskIds, (err, serviceRows) => {
  if (err) return res.status(500).json({ error: err.message });

  const servicesMap = {};
  serviceRows.forEach(r => {
    if (!servicesMap[r.task_id]) servicesMap[r.task_id] = [];
    const totalServicePrice = (r.price || 0) * (r.quantity || 1);
    servicesMap[r.task_id].push(`${r.name} (×${r.quantity}) - ${totalServicePrice.toFixed(2)} SAR`);
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
///////////////////////////////////////////////////////////////////
(async () => {
  await addColumnIfNotExists("services", "category", "TEXT");
})();

(async () => {
  await addColumnIfNotExists("task_services", "quantity", "INTEGER");
})();

(async () => {
  await addColumnIfNotExists("tasks", "createdBySupplier", "TEXT");
})();
//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
app.get('/manage-services', (req, res) => {
  db.all('SELECT * FROM services', [], (err, services) => {
    if (err) return res.status(500).send("حدث خطأ أثناء تحميل الخدمات");
    res.render('manage_services', { services });
  });
});

app.post('/add-service', (req, res) => {
  const { name, category, price } = req.body;
  db.run('INSERT INTO services (name, category, price) VALUES (?, ?, ?)', [name, category, price], err => {
    if (err) return res.status(500).send("فشل في الإضافة");
    res.redirect('admin_dashboard');
  });
});

app.post('/update-service/:id', (req, res) => {
  const { name, category, price } = req.body;
  db.run('UPDATE services SET name = ?, category = ?, price = ? WHERE id = ?', [name, category, price, req.params.id], err => {
    if (err) return res.status(500).send("فشل التعديل");
    res.redirect('/admin_dashboard');
  });
});

app.get('/delete-service/:id', (req, res) => {
  db.run('DELETE FROM services WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).send("فشل الحذف");
    res.redirect('/admin_dashboard');
  });
});

app.get("/api/services", (req, res) => {
  db.all("SELECT * FROM services", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "فشل في جلب الخدمات" });
    }

    // تقسيم حسب التصنيف
    const grouped = rows.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});

    res.json(grouped);
  });
});






// تشغيل الخادم
const PORT = process.env.PORT || 3000;;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});