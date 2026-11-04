import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    deviceType: '',
    room: '',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // 1. Lấy danh sách hoặc tìm kiếm thiết bị
  const fetchDevices = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const url = query 
        ? `${API_BASE_URL}/api/devices?search=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/api/devices`;
      const res = await axios.get(url);
      setDevices(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách thiết bị từ server!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(searchTerm);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Thêm hoặc Cập nhật thiết bị
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/devices/${formData._id || formData.deviceId}`, formData);
        setMessage('Cập nhật thiết bị thành công!');
      } else {
        await axios.post(`${API_BASE_URL}/api/devices`, formData);
        setMessage('Thêm thiết bị mới thành công!');
      }
      resetForm();
      fetchDevices();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thiết bị!');
    }
  };

  const handleEdit = (device) => {
    setIsEditing(true);
    setFormData(device);
  };

  const handleViewDetail = (device) => {
    setSelectedDevice(device);
  };

  // 3. Xóa thiết bị
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/devices/${id}`);
        setMessage('Xóa thiết bị thành công!');
        fetchDevices();
      } catch (err) {
        setError('Lỗi khi xóa thiết bị!');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      deviceId: '', name: '', deviceType: '', room: '',
      brand: '', model: '', quantity: 1, status: 'Đang sử dụng',
      purchaseDate: '', description: ''
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Quản Lý Thiết Bị Phòng Học</h1>

      {/* Thông báo kết quả / lỗi */}
      {message && <div style={{ color: 'green', background: '#e6ffed', padding: '10px', marginBottom: '10px', border: '1px solid green' }}>{message}</div>}
      {error && <div style={{ color: 'red', background: '#ffebee', padding: '10px', marginBottom: '10px', border: '1px solid red' }}>{error}</div>}

      {/* Ô tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm theo mã, tên, loại, phòng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Tìm kiếm</button>
      </form>

      {/* Form Thêm / Sửa */}
      <div style={{ background: '#f9f9f9', padding: '15px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ddd' }}>
        <h3>{isEditing ? 'Cập Nhật Thông Tin Thiết Bị' : 'Thêm Thiết Bị Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="deviceId" placeholder="Mã thiết bị" value={formData.deviceId} onChange={handleInputChange} disabled={isEditing} required />
          <input name="name" placeholder="Tên thiết bị" value={formData.name} onChange={handleInputChange} required />
          <input name="deviceType" placeholder="Loại thiết bị" value={formData.deviceType} onChange={handleInputChange} required />
          <input name="room" placeholder="Phòng học" value={formData.room} onChange={handleInputChange} required />
          <input name="brand" placeholder="Hãng sản xuất" value={formData.brand} onChange={handleInputChange} />
          <input name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleInputChange} required />
          
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="Đang sử dụng">Đang sử dụng</option>
            <option value="Hư hỏng">Hư hỏng</option>
            <option value="Đang sửa chữa">Đang sửa chữa</option>
            <option value="Ngừng sử dụng">Ngừng sử dụng</option>
          </select>

          <input name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} />
          <input name="description" placeholder="Mô tả / Ghi chú" value={formData.description} onChange={handleInputChange} />
          
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" style={{ padding: '10px 20px', marginRight: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {isEditing ? 'Lưu Thay Đổi' : 'Thêm Thiết Bị'}
            </button>
            {isEditing && <button type="button" onClick={resetForm} style={{ padding: '10px 20px' }}>Hủy</button>}
          </div>
        </form>
      </div>

      {/* Danh sách thiết bị */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f1f1f1' }}>
              <th>Mã TB</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th>Phòng</th>
              <th>Số lượng</th>
              <th>Tình trạng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device._id || device.deviceId}>
                <td>{device.deviceId}</td>
                <td>{device.name}</td>
                <td>{device.deviceType}</td>
                <td>{device.room}</td>
                <td>{device.quantity}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', borderRadius: '4px', color: '#fff', fontSize: '12px',
                    backgroundColor: device.status === 'Đang sử dụng' ? '#28a745' :
                                     device.status === 'Hư hỏng' ? '#dc3545' :
                                     device.status === 'Đang sửa chữa' ? '#ffc107' : '#6c757d'
                  }}>
                    {device.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleViewDetail(device)} style={{ marginRight: '5px' }}>Xem</button>
                  <button onClick={() => handleEdit(device)} style={{ marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => handleDelete(device._id || device.deviceId)} style={{ color: 'red' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Xem chi tiết */}
      {selectedDevice && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #007bff', background: '#eef7ff', borderRadius: '5px' }}>
          <h3>Chi Tiết Thiết Bị: {selectedDevice.name}</h3>
          <p><strong>Mã thiết bị:</strong> {selectedDevice.deviceId}</p>
          <p><strong>Loại thiết bị:</strong> {selectedDevice.deviceType}</p>
          <p><strong>Phòng học:</strong> {selectedDevice.room}</p>
          <p><strong>Hãng sản xuất:</strong> {selectedDevice.brand || 'N/A'}</p>
          <p><strong>Model:</strong> {selectedDevice.model || 'N/A'}</p>
          <p><strong>Số lượng:</strong> {selectedDevice.quantity}</p>
          <p><strong>Tình trạng:</strong> {selectedDevice.status}</p>
          <p><strong>Ngày mua/tiếp nhận:</strong> {selectedDevice.purchaseDate ? selectedDevice.purchaseDate.substring(0, 10) : 'N/A'}</p>
          <p><strong>Mô tả:</strong> {selectedDevice.description || 'N/A'}</p>
          <button onClick={() => setSelectedDevice(null)} style={{ padding: '5px 15px' }}>Đóng</button>
        </div>
      )}
    </div>
  );
}

export default App;