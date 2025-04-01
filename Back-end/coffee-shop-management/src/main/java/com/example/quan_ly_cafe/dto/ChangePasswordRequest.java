package com.example.quan_ly_cafe.dto;

public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;

    // Getters và Setters
    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
