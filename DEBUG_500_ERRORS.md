# Debug 500 Errors - Hướng dẫn tìm lỗi Backend

## ✅ Đã cập nhật

Tất cả các controllers quan trọng đã được cập nhật với error logging đầy đủ:

### Controllers đã fix:
1. ✅ **inventory.controller.ts** - Inventory management
2. ✅ **lab.controller.ts** - Lab tests & orders
3. ✅ **pharmacy.controller.ts** - Medicine management
4. ✅ **doctor.controller.ts** - Doctor management
5. ✅ **consent.controller.ts** - Consent forms

### Thay đổi:
- ✅ Thêm `errorResponse(res, err, 'functionName')` thay vì `serverError(res)`
- ✅ Thêm `console.log('[functionName] Request body:', req.body)` cho create/update
- ✅ Error messages giờ hiển thị context (tên function bị lỗi)
- ✅ Full error stack trace được log ra console

## 🔍 Cách debug khi gặp lỗi 500

### Bước 1: Xem backend terminal logs
Khi frontend báo lỗi 500, backend sẽ log chi tiết:

```
[ERROR - createItem]: PrismaClientValidationError: 
Invalid `prisma.inventoryItem.create()` invocation:
{
  data: {
    code: "INV001",
    name: "Bandage",
+   category: String,  // ← Missing required field
    ...
  }
}
```

### Bước 2: Kiểm tra request body
Mỗi create/update function giờ log request body:

```
[createItem] Request body: { code: 'INV001', name: 'Bandage', quantity: 100 }
```

### Bước 3: Đối chiếu với Prisma schema
Xem `prisma/schema.prisma` để biết required fields:

```prisma
model InventoryItem {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  category    String   // ← Required, không có default
  quantity    Int      @default(0)
  unit        String   // ← Required
  minQuantity Int      @default(5)
  ...
}
```

## 🐛 Các lỗi thường gặp

### 1. Missing Required Fields
**Lỗi:** `Argument 'category' is missing`

**Nguyên nhân:** Frontend không gửi field bắt buộc

**Fix:** Thêm validation ở frontend:
```typescript
if (!form.category || !form.unit) {
  throw new Error('Vui lòng nhập đầy đủ thông tin bắt buộc');
}
```

### 2. Foreign Key Constraint
**Lỗi:** `Foreign key constraint failed on the field: 'patientId'`

**Nguyên nhân:** Tham chiếu đến ID không tồn tại (ví dụ: patientId không có trong database)

**Fix:** 
- Tạo patient trước
- Hoặc kiểm tra patient tồn tại trước khi tạo

### 3. Unique Constraint Violation
**Lỗi:** `Unique constraint failed on the fields: ('code')`

**Nguyên nhân:** Trùng code/email/unique field

**Fix:** Kiểm tra trùng lặp trước khi tạo

### 4. Type Mismatch
**Lỗi:** `Expected number, received string`

**Nguyên nhân:** Frontend gửi string cho numeric field

**Fix:** Convert type ở frontend:
```typescript
const payload = {
  ...form,
  quantity: parseInt(form.quantity) || 0,
  price: parseFloat(form.price) || 0,
};
```

## 📋 Checklist khi thêm dữ liệu không được

### Frontend:
- [ ] Có validation cho required fields?
- [ ] Có convert data types (string → number)?
- [ ] Có error handling với toast?
- [ ] Console có log request payload?

### Backend:
- [ ] Controller có log errors?
- [ ] Terminal có hiển thị error message?
- [ ] Prisma schema có gì thay đổi?
- [ ] Database có data dependencies (foreign keys)?

## 🚀 Test từng trang

### 1. Inventory Page
```bash
# Required fields
code: "INV001"
name: "Bandage"
category: "Medical Supplies"  # ← Required
unit: "box"                   # ← Required
quantity: 100
minQuantity: 10
```

### 2. Lab Page
```bash
# Lab Test
code: "LAB001"
name: "Complete Blood Count"
category: "Hematology"
price: 50000

# Lab Order (cần có patient trước)
patientId: "<patient-id>"     # ← Must exist
testId: "<test-id>"           # ← Must exist
```

### 3. Pharmacy Page
```bash
# Medicine
code: "MED001"
name: "Paracetamol"
price: 5000
stock: 100
minStock: 20
unit: "viên"
```

### 4. Doctor Page
```bash
# Doctor (cần có user trước)
userId: "<user-id>"           # ← Must exist, unique
specialty: "Cardiology"
experienceYears: 5
```

### 5. Consent Page
```bash
# Consent Form (cần có patient trước)
patientId: "<patient-id>"     # ← Must exist
type: "GENERAL"
title: "Consent for Treatment"
content: "I agree to..."
```

## 💡 Tips

1. **Tạo data theo thứ tự:**
   - User → Doctor
   - Patient → Appointments/Lab Orders/Consent
   - Medicine → Prescriptions

2. **Kiểm tra database trước:**
   ```sql
   SELECT * FROM "User" LIMIT 5;
   SELECT * FROM "Patient" LIMIT 5;
   ```

3. **Xem backend logs realtime:**
   ```bash
   cd de_qlbv_server
   npm run dev
   # Logs sẽ hiển thị mỗi khi có request
   ```

4. **Test API trực tiếp với curl/Postman:**
   ```bash
   curl -X POST http://localhost:5000/api/inventory \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"code":"INV001","name":"Test","category":"Medical","unit":"box","quantity":10}'
   ```

## 🎯 Kết luận

Giờ đây khi gặp lỗi 500:
1. Backend sẽ log chi tiết lỗi gì
2. Bạn biết function nào bị lỗi
3. Bạn thấy request body được gửi lên
4. Dễ dàng fix theo error message

**Hãy test lại các trang và cho tôi biết error message cụ thể nếu vẫn còn lỗi!**
