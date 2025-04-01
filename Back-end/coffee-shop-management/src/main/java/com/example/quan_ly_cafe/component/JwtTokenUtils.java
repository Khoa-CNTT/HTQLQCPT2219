package com.example.quan_ly_cafe.component;


import com.example.quan_ly_cafe.model.Users;
import com.example.quan_ly_cafe.repo.IUserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.InvalidParameterException;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenUtils {
    @Value("${jwt.expiration}")
    private int expiration;

    @Value("${jwt.secretKey}")
    private String secret;

    @Autowired
    private IUserRepository userRepository;


    public String generateToken(Users user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole());  // Thêm vai trò của người dùng vào claims nếu cần
        try {
            String token = Jwts.builder()
                    .setClaims(claims)
                    .setSubject(user.getUsername())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L))  // Chú ý rằng expiration đã là giây
                    .signWith(getSignInkey(), SignatureAlgorithm.HS256)
                    .compact();
            return token;
        } catch (Exception e) {
            throw new InvalidParameterException("Cannot create token: " + e.getMessage());
        }
    }

    // phương thức này giải hóa bí mật dưới dạng key và nó trả về key
    private Key getSignInkey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);//BDAspyT6CJi0W/Ca5d9A5cKCi+pZSAhia7w83vk9gms=)
        return Keys.hmacShaKeyFor(keyBytes);

    }
    // trích xuất tất cả claims từ 1 token cụ thể
    public Claims extractAllClams(String  token){
        return Jwts.parserBuilder()
                .setSigningKey(getSignInkey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Phương thức này trích xuất một claim cụ thể từ token bằng cách sử dụng một hàm giải quyết claims.
    public <T> T extractClaim(String token, Function<Claims,T> clamsResolver){
        Claims claims = extractAllClams(token);
        return clamsResolver.apply(claims);
    }

    private String generateSecretKey() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] keyBytes = new byte[32];
        secureRandom.nextBytes(keyBytes);
        String secretKey = Encoders.BASE64.encode(keyBytes);
        return secretKey;
    }

    // đây laf hafm kiểm tra Jwt có hết hạn chưa
    public boolean isTokenExpired(String token, Users user) {
        Date expirationDate = extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    // lấy ra số  điện thoại từ 1 token
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // kiểm tra xem token này có hợp lệ hay khoong
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        Users users = userRepository.findByUsername(userName).orElse(null);
        // kiểm tra xem số điện thoại đem làm account có trùng không và xem thử token nó có còn hạn hay không
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token,users));
    }
}
