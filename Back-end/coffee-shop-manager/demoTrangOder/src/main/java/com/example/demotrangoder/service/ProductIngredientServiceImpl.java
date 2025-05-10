package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.ProductIngredientCreateDTO;
import com.example.demotrangoder.dto.ProductWithIngredientsDTO;
import com.example.demotrangoder.model.Ingredient;
import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.model.ProductIngredient;
import com.example.demotrangoder.repo.IProductIngredientRepository;
import com.example.demotrangoder.repo.IngredientRepository;
import com.example.demotrangoder.repo.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductIngredientServiceImpl implements IProductIngredientService {

    @Autowired
    private IProductIngredientRepository productIngredientRepository;
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private ProductRepository productRepository;
    @Override
    public List<ProductIngredient> findByProductId(Long productId) {
        return productIngredientRepository.findByProductProductId(productId);
    }
    @Override
    public Product updateProductIngredients(Long productId, ProductWithIngredientsDTO updatedProduct) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }

        Product product = productOpt.get();
        List<String> errors = new ArrayList<>();

        for (ProductWithIngredientsDTO.IngredientDTO ingredientDto : updatedProduct.getIngredients()) {
            Optional<Ingredient> ingredientOpt = ingredientRepository.findByName(ingredientDto.getName());
            if (!ingredientOpt.isPresent()) {
                errors.add("Nguyên liệu '" + ingredientDto.getName() + "' không tồn tại.");
                continue; // Bỏ qua cập nhật ingredient này
            }

            Ingredient ingredient = ingredientOpt.get();

            for (ProductIngredient productIngredient : product.getProductIngredients()) {
                if (productIngredient.getIngredient().getName().equals(ingredient.getName())) {
                    productIngredient.setAmountRequired(ingredientDto.getAmount());
                    productIngredientRepository.save(productIngredient);
                }
            }
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException(String.join("||", errors)); // Dùng '||' làm dấu phân cách
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProductAndIngredients(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            throw new RuntimeException("Không tìm thấy sản phẩm có ID: " + productId);
        }

        Product product = productOpt.get();

        // Xoá tất cả ProductIngredient liên quan
        List<ProductIngredient> ingredientLinks = productIngredientRepository.findByProductProductId(productId);
        productIngredientRepository.deleteAll(ingredientLinks);

        // Xoá chính sản phẩm
        productRepository.delete(product);
    }

    @Override
    public List<ProductWithIngredientsDTO> getAllProductWithIngredients() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(product -> {
                    List<ProductWithIngredientsDTO.IngredientDTO> ingredients = product.getProductIngredients().stream()
                            .map(pi -> new ProductWithIngredientsDTO.IngredientDTO(
                                    pi.getIngredient().getName(),
                                    pi.getAmountRequired()
                            )).collect(Collectors.toList());

                    return new ProductWithIngredientsDTO(product.getProductId(),product.getProductName(), ingredients);
                }).collect(Collectors.toList());
    }
    // service/impl/ProductIngredientServiceImpl.java
    @Override
    public void createProductIngredient(ProductIngredientCreateDTO dto) {
        Product product = productRepository.findByProductName(dto.getProductName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + dto.getProductName()));

        Ingredient ingredient = ingredientRepository.findByName(dto.getIngredientName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu: " + dto.getIngredientName()));

        // Kiểm tra trùng
        if (productIngredientRepository.existsByProductAndIngredient(product, ingredient)) {
            throw new RuntimeException("Nguyên liệu đã tồn tại trong sản phẩm này.");
        }

        // Kiểm tra lại dữ liệu
        System.out.println("Sản phẩm: " + product.getProductName() + " (ID: " + product.getProductId() + ")");
        System.out.println("Nguyên liệu: " + ingredient.getName() + " (ID: " + ingredient.getId() + ")");
        System.out.println("Định lượng: " + dto.getAmountRequired());

        // Tạo mới ProductIngredient
        ProductIngredient productIngredient = new ProductIngredient();
        productIngredient.setProduct(product);
        productIngredient.setIngredient(ingredient);
        productIngredient.setAmountRequired(dto.getAmountRequired());

        // Lưu vào cơ sở dữ liệu
        productIngredientRepository.save(productIngredient);
    }
    @Override
    public void deleteIngredientFromProduct(Long productId, String ingredientName) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }

        Product product = productOpt.get();
        Optional<Ingredient> ingredientOpt = ingredientRepository.findByName(ingredientName);
        if (!ingredientOpt.isPresent()) {
            throw new RuntimeException("Nguyên liệu không tồn tại");
        }

        Ingredient ingredient = ingredientOpt.get();

        // Tìm và xóa nguyên liệu từ sản phẩm
        ProductIngredient productIngredient = product.getProductIngredients()
                .stream()
                .filter(pi -> pi.getIngredient().equals(ingredient))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nguyên liệu không tìm thấy trong sản phẩm"));

        product.getProductIngredients().remove(productIngredient);
        productIngredientRepository.delete(productIngredient);  // Xóa khỏi cơ sở dữ liệu
    }

}
