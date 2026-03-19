import api from "./axios";

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  // เพิ่ม field อื่นๆ ตามที่ Backend รองรับ
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export const userService = {
  // PATCH: /users/me/ สำหรับอัปเดตข้อมูลส่วนตัว
  updateProfile: (data: UpdateProfilePayload) => {
    return api.patch("/users/me/", data);
  },

  // POST: /users/change-password/ สำหรับเปลี่ยนรหัสผ่าน
  changePassword: (data: ChangePasswordPayload) => {
    return api.post("/users/change-password/", data);
  }
};