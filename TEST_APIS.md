# Test Backend APIs

## Chuẩn bị

```bash
# 1. Chạy server
npm run dev

# 2. Server chạy tại: http://localhost:5000
```

## Test bằng curl hoặc Postman

### 1. Lab APIs

```bash
# Lấy danh sách xét nghiệm
curl http://localhost:5000/api/lab/tests

# Thêm xét nghiệm mới
curl -X POST http://localhost:5000/api/lab/tests \
  -H "Content-Type: application/json" \
  -d '{"code":"XN001","name":"Xét nghiệm máu","category":"Hematology","price":100000}'

# Xóa xét nghiệm
curl -X DELETE http://localhost:5000/api/lab/tests/1

# Lấy danh sách phiếu XN
curl http://localhost:5000/api/lab/orders

# Tạo phiếu XN
curl -X POST http://localhost:5000/api/lab/orders \
  -H "Content-Type: application/json" \
  -d '{"patientId":"1","testId":"1","orderedBy":"Dr. Smith"}'

# Xóa phiếu XN
curl -X DELETE http://localhost:5000/api/lab/orders/1
```

### 2. Pharmacy APIs

```bash
# Lấy danh sách thuốc
curl http://localhost:5000/api/pharmacy/medicines

# Thêm thuốc
curl -X POST http://localhost:5000/api/pharmacy/medicines \
  -H "Content-Type: application/json" \
  -d '{"code":"MED001","name":"Paracetamol","unit":"Viên","price":5000,"stock":100,"minStock":20}'

# Sửa thuốc
curl -X PUT http://localhost:5000/api/pharmacy/medicines/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Paracetamol 500mg","price":6000}'

# Xóa thuốc
curl -X DELETE http://localhost:5000/api/pharmacy/medicines/1

# Điều chỉnh tồn kho
curl -X POST http://localhost:5000/api/pharmacy/medicines/1/stock \
  -H "Content-Type: application/json" \
  -d '{"type":"IN","quantity":50,"reason":"Nhập kho"}'
```

### 3. Inventory APIs

```bash
# Lấy danh sách vật tư
curl http://localhost:5000/api/inventory

# Thêm vật tư
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{"code":"INV001","name":"Băng gạc","category":"Medical Supplies","unit":"Hộp","quantity":50,"minQuantity":10}'

# Sửa vật tư
curl -X PUT http://localhost:5000/api/inventory/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity":60}'

# Xóa vật tư
curl -X DELETE http://localhost:5000/api/inventory/1

# Điều chỉnh số lượng
curl -X POST http://localhost:5000/api/inventory/1/adjust \
  -H "Content-Type: application/json" \
  -d '{"quantity":10,"reason":"Sử dụng"}'
```

### 4. Insurance APIs

```bash
# Lấy danh sách hợp đồng
curl http://localhost:5000/api/insurance/policies

# Thêm hợp đồng
curl -X POST http://localhost:5000/api/insurance/policies \
  -H "Content-Type: application/json" \
  -d '{"patientId":"1","provider":"Bảo Việt","policyNumber":"BV123","validFrom":"2024-01-01","validTo":"2024-12-31"}'

# Xóa hợp đồng
curl -X DELETE http://localhost:5000/api/insurance/policies/1

# Lấy danh sách yêu cầu bồi thường
curl http://localhost:5000/api/insurance/claims

# Tạo yêu cầu
curl -X POST http://localhost:5000/api/insurance/claims \
  -H "Content-Type: application/json" \
  -d '{"billId":"1","claimAmount":500000}'

# Cập nhật trạng thái
curl -X PATCH http://localhost:5000/api/insurance/claims/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'

# Xóa yêu cầu
curl -X DELETE http://localhost:5000/api/insurance/claims/1
```

### 5. Referrals APIs

```bash
# Lấy danh sách chuyển viện
curl http://localhost:5000/api/referrals

# Tạo chuyển viện
curl -X POST http://localhost:5000/api/referrals \
  -H "Content-Type: application/json" \
  -d '{"patientId":"1","toFacility":"Bệnh viện Trung ương","reason":"Cần phẫu thuật chuyên sâu"}'

# Sửa chuyển viện
curl -X PUT http://localhost:5000/api/referrals/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"accepted"}'

# Xóa chuyển viện
curl -X DELETE http://localhost:5000/api/referrals/1
```

### 6. Telemedicine APIs

```bash
# Lấy danh sách lịch khám
curl http://localhost:5000/api/telemedicine

# Tạo lịch khám
curl -X POST http://localhost:5000/api/telemedicine \
  -H "Content-Type: application/json" \
  -d '{"patientId":"1","doctorId":"1","scheduledAt":"2024-12-01T10:00:00Z","duration":30}'

# Sửa lịch khám
curl -X PUT http://localhost:5000/api/telemedicine/1 \
  -H "Content-Type: application/json" \
  -d '{"duration":45}'

# Xóa lịch khám
curl -X DELETE http://localhost:5000/api/telemedicine/1

# Bắt đầu phiên
curl -X POST http://localhost:5000/api/telemedicine/1/start

# Kết thúc phiên
curl -X POST http://localhost:5000/api/telemedicine/1/end
```

### 7. Consent APIs

```bash
# Lấy danh sách phiếu đồng ý
curl http://localhost:5000/api/consent

# Tạo phiếu đồng ý
curl -X POST http://localhost:5000/api/consent \
  -H "Content-Type: application/json" \
  -d '{"patientId":"1","type":"surgery","title":"Đồng ý phẫu thuật","content":"Tôi đồng ý..."}'

# Sửa phiếu đồng ý
curl -X PUT http://localhost:5000/api/consent/1 \
  -H "Content-Type: application/json" \
  -d '{"content":"Nội dung cập nhật"}'

# Ký phiếu đồng ý
curl -X PUT http://localhost:5000/api/consent/1/sign \
  -H "Content-Type: application/json" \
  -d '{"signedBy":"Nguyễn Văn A","signedAt":"2024-12-01T10:00:00Z"}'

# Xóa phiếu đồng ý
curl -X DELETE http://localhost:5000/api/consent/1
```

### 8. Doctors APIs

```bash
# Lấy danh sách bác sĩ
curl http://localhost:5000/api/doctors

# Thêm bác sĩ
curl -X POST http://localhost:5000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{"userId":"1","specialty":"Cardiology","licenseNumber":"BS123","yearsOfExperience":10}'

# Sửa bác sĩ
curl -X PUT http://localhost:5000/api/doctors/1 \
  -H "Content-Type: application/json" \
  -d '{"yearsOfExperience":11}'

# Xóa bác sĩ
curl -X DELETE http://localhost:5000/api/doctors/1
```

### 9. Bills APIs (đã có DELETE)

```bash
# Xóa hóa đơn
curl -X DELETE http://localhost:5000/api/bills/1
```

### 10. Staff APIs (đã có UPDATE)

```bash
# Sửa nhân viên
curl -X PUT http://localhost:5000/api/staff/1 \
  -H "Content-Type: application/json" \
  -d '{"position":"Senior Nurse"}'
```

### 11. Encounter APIs (đã có DELETE)

```bash
# Xóa cuộc khám
curl -X DELETE http://localhost:5000/api/encounters/1
```

### 12. Surgery APIs (đã có DELETE)

```bash
# Xóa phẫu thuật
curl -X DELETE http://localhost:5000/api/surgery/1
```

## Test với Postman

### Import Collection

Tạo file `postman_collection.json`:

```json
{
  "info": {
    "name": "HMS API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Lab",
      "item": [
        {
          "name": "Get Tests",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/lab/tests"
          }
        },
        {
          "name": "Create Test",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/lab/tests",
            "body": {
              "mode": "raw",
              "raw": "{\"code\":\"XN001\",\"name\":\"Xét nghiệm máu\",\"category\":\"Hematology\",\"price\":100000}"
            }
          }
        },
        {
          "name": "Delete Test",
          "request": {
            "method": "DELETE",
            "url": "{{baseUrl}}/api/lab/tests/1"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

Import vào Postman và test.

## Kiểm tra Database

```bash
# Vào Prisma Studio
npx prisma studio

# Hoặc kết nối trực tiếp database
# Kiểm tra dữ liệu đã được tạo/sửa/xóa đúng chưa
```

## Expected Results

### Success Response (200/201)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (400/404/500)
```json
{
  "success": false,
  "error": "Error message"
}
```

## Common Issues

### 404 Not Found
- Kiểm tra route đã được thêm vào `src/routes/index.ts`
- Kiểm tra controller đã export đúng function

### 500 Internal Server Error
- Xem logs trong terminal
- Kiểm tra database connection
- Kiểm tra Prisma schema

### Foreign Key Constraint
- Tạo dữ liệu phụ thuộc trước (Patient, Doctor, User, etc.)
- Kiểm tra ID có tồn tại trong database

## Automation Test Script

Tạo file `test-apis.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "Testing Lab APIs..."
curl -s $BASE_URL/api/lab/tests | jq
curl -s -X POST $BASE_URL/api/lab/tests -H "Content-Type: application/json" -d '{"code":"TEST","name":"Test","category":"Test","price":1000}' | jq

echo "Testing Pharmacy APIs..."
curl -s $BASE_URL/api/pharmacy/medicines | jq

echo "Testing Inventory APIs..."
curl -s $BASE_URL/api/inventory | jq

echo "Testing Insurance APIs..."
curl -s $BASE_URL/api/insurance/policies | jq
curl -s $BASE_URL/api/insurance/claims | jq

echo "Testing Referrals APIs..."
curl -s $BASE_URL/api/referrals | jq

echo "Testing Telemedicine APIs..."
curl -s $BASE_URL/api/telemedicine | jq

echo "Testing Consent APIs..."
curl -s $BASE_URL/api/consent | jq

echo "Testing Doctors APIs..."
curl -s $BASE_URL/api/doctors | jq

echo "All tests completed!"
```

Chạy:
```bash
chmod +x test-apis.sh
./test-apis.sh
```

## Kết luận

Sau khi test tất cả APIs:
- ✅ Tất cả GET endpoints trả về data
- ✅ Tất cả POST endpoints tạo được data
- ✅ Tất cả PUT/PATCH endpoints cập nhật được data
- ✅ Tất cả DELETE endpoints xóa được data
- ✅ Error handling hoạt động đúng
- ✅ Foreign key constraints được kiểm tra
