import api from './api';

const CategoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data.data; // return {catrgories[]}
  },

  async getCategory(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data.data; // return {category} - includes event[] (published only);
  },

  async createCategory({ name, icon }) {
    const response = await api.post('/categories/', { name, icon });
    return response.data.data; // return {category}
  },

  async updateCategory(id, { name, icon }) {
    const response = await api.put(`/categories/${id}`, { name, icon });
    return response.data.data; // return {category}
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data; // return {success, message}
  },
};
export default CategoryService;
