package com.example.demotrangoder.controller;

import com.example.demotrangoder.service.GeminiService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000") // Thay bằng domain của frontend nếu deploy
@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public String chat(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            return geminiService.chatWithAI(message);
        } catch (IOException | JSONException e) {
            return "Lỗi khi gọi API Gemini: " + e.getMessage();
        }
    }


//    @Value("${gemini.api.key}")
//    private String geminiApiKey;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=";
//
//    @PostMapping
//    public ResponseEntity<String> chatWithGemini(@RequestBody Map<String, String> request) {
//        String userMessage = request.get("message");
//
//        // Tạo JSON request body
//        JsonObject requestBody = new JsonObject();
//        JsonArray contents = new JsonArray();
//        JsonObject messageObject = new JsonObject();
//        JsonArray parts = new JsonArray();
//        JsonObject textPart = new JsonObject();
//
//        textPart.addProperty("text", userMessage);
//        parts.add(textPart);
//        messageObject.add("parts", parts);
//        contents.add(messageObject);
//
//        requestBody.add("contents", contents);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        // ❌ Xóa dòng headers.set("Authorization", "Bearer " + geminiApiKey);
//
//        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);
//
//        // ✅ Đưa API Key vào URL
//        String url = GEMINI_API_URL + geminiApiKey;
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//            return ResponseEntity.ok(response.getBody());
//        } catch (HttpClientErrorException e) {
//            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
//        }
//
//    }
}



//import org.apache.commons.math3.linear.RealVector;
//import org.apache.commons.math3.linear.OpenMapRealVector;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
//
//@RestController
//@RequestMapping("/api/chat")
//public class ChatController {
//
//    private static final Map<String, String> faqDatabase = new HashMap<>();
//    private static final List<String> questions = new ArrayList<>();
//
//    static {
//        faqDatabase.put("Mấy giờ quán mở cửa?", "Quán mở cửa từ 7h sáng đến 10h tối.");
//        faqDatabase.put("quán có bán món cà phê nào ngon không", "Bạn có thể thử Cappuccino hoặc Latte hoặc cà phê muối nhé!");
//        faqDatabase.put("Đồ uống nào ngọt?", "Bạn có thể thử Trà sữa hoặc Mocha.");
//        faqDatabase.put("caf phê muối bao gồm những gif , cà phee muối là gì", "caf phê và muối bạn ạ.");
//        faqDatabase.put("Món đặc biệt của quán là gì?", "Hôm nay quán có món Special Espresso!");
//        faqDatabase.put("biết mit là ai không", "bé đó bị đần với thiểu năng á banj đừng dính vào khổ thân  ");
//        questions.addAll(faqDatabase.keySet());
//    }
//
//    @GetMapping("/ask")
//    public ResponseEntity<String> askChatbot(@RequestParam String question) {
//        String bestMatch = getBestMatch(question);
//        return ResponseEntity.ok(faqDatabase.getOrDefault(bestMatch, "Xin lỗi, mình chưa hiểu câu hỏi của bạn."));
//    }
//
//    private String getBestMatch(String input) {
//        double maxSimilarity = 0;
//        String bestMatch = null;
//
//        for (String q : questions) {
//            double similarity = calculateCosineSimilarity(input.toLowerCase(), q.toLowerCase());
//            if (similarity > maxSimilarity) {
//                maxSimilarity = similarity;
//                bestMatch = q;
//            }
//        }
//        return (maxSimilarity >= 0.5) ? bestMatch : null; // Ngưỡng 50% để xác định câu trả lời phù hợp
//    }
//
//    private double calculateCosineSimilarity(String text1, String text2) {
//        Map<String, Integer> freq1 = getWordFrequencies(text1);
//        Map<String, Integer> freq2 = getWordFrequencies(text2);
//
//        Set<String> allWords = new HashSet<>(freq1.keySet());
//        allWords.addAll(freq2.keySet());
//
//        RealVector v1 = new OpenMapRealVector(allWords.size());
//        RealVector v2 = new OpenMapRealVector(allWords.size());
//
//        int index = 0;
//        Map<String, Integer> wordIndex = new HashMap<>();
//        for (String word : allWords) {
//            wordIndex.put(word, index++);
//        }
//
//        for (Map.Entry<String, Integer> entry : freq1.entrySet()) {
//            v1.setEntry(wordIndex.get(entry.getKey()), entry.getValue());
//        }
//        for (Map.Entry<String, Integer> entry : freq2.entrySet()) {
//            v2.setEntry(wordIndex.get(entry.getKey()), entry.getValue());
//        }
//
//        double dotProduct = v1.dotProduct(v2);
//        double norm1 = v1.getNorm();
//        double norm2 = v2.getNorm();
//
//        return (norm1 == 0 || norm2 == 0) ? 0 : dotProduct / (norm1 * norm2);
//    }
//
//    private Map<String, Integer> getWordFrequencies(String text) {
//        Map<String, Integer> freqMap = new HashMap<>();
//        for (String word : text.split("\\s+")) {
//            freqMap.put(word, freqMap.getOrDefault(word, 0) + 1);
//        }
//        return freqMap;
//    }
//}
