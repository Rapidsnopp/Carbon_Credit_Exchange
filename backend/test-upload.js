// Script để test upload ảnh lên IPFS
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testUpload() {
  try {
    // Tạo file test image nếu chưa có
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('❌ Không tìm thấy test-image.jpg');
      console.log('Vui lòng tạo file test-image.jpg trong thư mục backend');
      return;
    }

    console.log('📤 Bắt đầu test upload...');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));

    const response = await axios.post('http://localhost:3001/api/upload/image', formData, {
      headers: formData.getHeaders(),
    });

    console.log('✅ Upload thành công!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
}

testUpload();
