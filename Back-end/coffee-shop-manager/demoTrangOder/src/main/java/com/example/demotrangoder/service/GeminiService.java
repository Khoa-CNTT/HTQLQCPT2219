package com.example.demotrangoder.service;


import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    @Value("${gemini.api.key}")  // Đọc API Key từ application.properties
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();
    // Dữ liệu cứng về quán cà phê
    private static final Map<String, String> FAQ_DATA = Map.of(
            "business_hours", "Quán mở cửa từ 7:00 sáng đến 10:00 tối hàng ngày.",
            "location", "Quán nằm tại 123 Đường ABC, Quận 1, TP. HCM.",
            "menu", "Quán có các loại cà phê, trà sữa, bánh ngọt và nước ép trái cây."
    );
    // Hàm nhận diện intent của câu hỏi
    private String detectIntent(String userMessage) {
        List<String> businessHoursKeywords = List.of("giờ mở cửa", "mấy giờ mở", "khi nào đóng cửa", "quán mở tới mấy giờ");
        List<String> locationKeywords = List.of("địa chỉ", "quán ở đâu", "làm sao đến");
        List<String> menuKeywords = List.of("có gì", "menu", "món gì");

        if (businessHoursKeywords.stream().anyMatch(userMessage.toLowerCase()::contains)) {
            return "business_hours";
        } else if (locationKeywords.stream().anyMatch(userMessage.toLowerCase()::contains)) {
            return "location";
        } else if (menuKeywords.stream().anyMatch(userMessage.toLowerCase()::contains)) {
            return "menu";
        }
        return null; // Không tìm thấy intent, gửi đến AI xử lý
    }
    public String chatWithAI(String userMessage) throws IOException, JSONException {
        // Kiểm tra xem có intent phù hợp không
        String intent = detectIntent(userMessage);
        if (intent != null && FAQ_DATA.containsKey(intent)) {
            return FAQ_DATA.get(intent); // Trả về dữ liệu có sẵn
        }
        JSONObject requestBody = new JSONObject();
        JSONArray contents = new JSONArray();

        JSONObject userContent = new JSONObject();
        userContent.put("role", "user");

        JSONArray parts = new JSONArray();
        JSONObject textPart = new JSONObject();
        textPart.put("text", userMessage);
        parts.put(textPart);

        userContent.put("parts", parts);
        contents.put(userContent);

        requestBody.put("contents", contents);

        RequestBody body = RequestBody.create(requestBody.toString(), MediaType.get("application/json"));
        Request request = new Request.Builder()
                .url(API_URL + "?key=" + apiKey)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            JSONObject jsonResponse = new JSONObject(response.body().string());
            return jsonResponse.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");
        }
    }
}

