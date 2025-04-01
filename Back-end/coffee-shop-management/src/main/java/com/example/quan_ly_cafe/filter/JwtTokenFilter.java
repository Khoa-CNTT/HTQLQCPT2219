package com.example.quan_ly_cafe.filter;


import com.example.quan_ly_cafe.component.JwtTokenUtils;
import com.example.quan_ly_cafe.model.Users;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.modelmapper.internal.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
// thang nay dung de phan tich yeu cau cua http
// kiem tra xac thuc voi token dang nhu ve xe thong hanh
public class JwtTokenFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtils;
    private final ServletContext servletContext;

    /**
     *xu ly yeu cau va tiep tuc bo loc
     *
     * @param request  doi tuong HttpServletRequest duoc gui tu client
     * @param response doi tuong HttpServletResponse duoc  su dung  de gui phan hoi tu server ve client
     * @param filterChain Đối tượng FilterChain cho phép tiếp tục chuỗi các bộ lọc sau khi bộ lọc hiện tại đã hoàn thành xử lý.
     * @throws ServletException Ném ra ngoại lệ này nếu có lỗi xảy ra trong quá trình xử lý yêu cầu.
     * @throws IOException nem ra ngoai le trong qua trinh doc gghi du lieu
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Nếu endpoint được phép bỏ qua xác thực, tiếp tục filter
            if (isByPassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Xử lý token
            final String authenticate = request.getHeader("Authorization");
            if (authenticate == null || !authenticate.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            final String token = authenticate.substring(7);
            final String username = jwtTokenUtils.extractUserName(token);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Users userDetails = (Users) userDetailsService.loadUserByUsername(username);
                if (jwtTokenUtils.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }




    /**
     * kiem tra xem yeu cau co phai bo qua xac thuc hay khong
     * @param request doi tuong HttpServletRequest chua thong tin yeu cau tu Request
     * @return tra ve true neu bo qua token , false neu khong
     */

    private boolean isByPassToken(@NonNull HttpServletRequest request) {

        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of("/api/login", "POST"),
                Pair.of("/api/user/register", "POST"),
                Pair.of("/api/email/check-code", "POST"),
                Pair.of("/api/email/send-code-email", "POST"),
                Pair.of("/api/user/change-password", "POST"),
                Pair.of("/api/category", "GET"),
                Pair.of("/api/product/detail", "GET"),
                Pair.of("/api/product/searchByProductName", "GET"),
                Pair.of("/api/product/searchByCategory", "GET"),
                Pair.of("/api/username-exits-check", "POST"),
                Pair.of("/api/numberphone-exits-check", "POST"),
                Pair.of("/api/email-exits-check", "POST"),
                Pair.of("/api/product", "GET"),
                Pair.of("/api/saveUser", "POST"),
                Pair.of("/api/table/\\d+", "GET"),
                Pair.of("/api/topping", "GET"),
                Pair.of("/api/sizes", "GET"),
                Pair.of("/api/table/create", "POST"),
                Pair.of("/api/product/category/.*", "GET"), // Bỏ qua xác thực cho category/{categoryCode}
                Pair.of("/api/product/search", "GET"), // Bỏ qua xác thực cho category/{categoryCode}
                Pair.of("/api/payment/create", "POST"), // Bỏ qua xác thực cho category/{categoryCode}
                Pair.of("/api/vnpay/create-payment", "POST"), // Bỏ qua xác thực cho category/{categoryCode}
                Pair.of("/api/table/update/\\d+", "PUT"),
                Pair.of("/api/discounts/.*", "GET"), // Bỏ qua xác thực cho API /api/discounts/{code}
                Pair.of("/api/payment/create_payment", "GET"), // Bỏ qua xác thực cho API /api/discounts/{code}
                Pair.of("/api/payment/payment_infor", "GET"), // Bỏ qua xác thực cho API /api/discounts/{code}
                Pair.of("/api/orders/place", "POST"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/chat/ask", "GET"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/chat", "POST"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/feedback/\\d+", "POST"), // Chỉ chấp nhận số
                Pair.of("/api/feedback/hi", "GET"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/chat/get", "GET"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/check-phone", "GET"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/email/check-email", "GET"), // Thêm dòng này để bypass token cho API placeOrder
                Pair.of("/api/check-username", "GET") // Thêm dòng này để bypass token cho API placeOrder

        );
        System.out.println("Request Path: " + request.getServletPath());
        System.out.println("Request Method: " + request.getMethod());

        for (Pair<String, String> token : bypassTokens) {
            if (request.getServletPath().matches(token.getLeft()) && request.getMethod().equals(token.getRight())) {
                return true; // Trả về true nếu yêu cầu khớp với bất kỳ token nào trong danh sách
            }
        }
        return false; // Trả về false nếu không khớp
    }


}

