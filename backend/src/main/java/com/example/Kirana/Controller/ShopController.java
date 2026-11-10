package com.example.Kirana.Controller;

import com.example.Kirana.DTOs.Requests.ShopRequest;
import com.example.Kirana.DTOs.Response.ShopResponse;
import com.example.Kirana.Service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    // Shop owner creates shop
    @PostMapping
    public ResponseEntity<ShopResponse> createShop(
            Authentication auth,
            @RequestBody ShopRequest request) {
        String ownerId = auth.getPrincipal().toString();
        return ResponseEntity.ok(shopService.createShop(ownerId, request));
    }

    // Get shop by id — customers use this
    @GetMapping("/{shopId}")
    public ResponseEntity<ShopResponse> getShopById(@PathVariable String shopId) {
        return ResponseEntity.ok(shopService.getShopById(shopId));
    }

    // Browse shops by area — customer home screen
    @GetMapping("/area/{area}")
    public ResponseEntity<List<ShopResponse>> getShopsByArea(@PathVariable String area) {
        return ResponseEntity.ok(shopService.getShopsByArea(area));
    }

    // Shop owner views their own shop
    @GetMapping("/my")
    public ResponseEntity<ShopResponse> getMyShop(Authentication auth) {
        String ownerId = auth.getPrincipal().toString();
        return ResponseEntity.ok(shopService.getMyShop(ownerId));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<ShopResponse>> getAllShops(){
    	return ResponseEntity.ok(shopService.getAllShops());
    }
    
    @GetMapping("/areas")
    public List<String> getAreas(){
    	return shopService.getAreas();
    }

    // Shop owner updates shop info
    @PutMapping("/my")
    public ResponseEntity<ShopResponse> updateShop(
            Authentication auth,
            @RequestBody ShopRequest request) {
        String ownerId = auth.getPrincipal().toString();
        return ResponseEntity.ok(shopService.updateShop(ownerId, request));
    }

    // Toggle open/closed
    @PatchMapping("/my/toggle")
    public ResponseEntity<ShopResponse> toggleStatus(Authentication auth) {
        String ownerId = auth.getPrincipal().toString();
        return ResponseEntity.ok(shopService.toggleShopStatus(ownerId));
    }
}